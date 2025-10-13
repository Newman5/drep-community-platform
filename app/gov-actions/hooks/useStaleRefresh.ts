// ./hooks/useStaleRefresh.ts
"use client";

import { useEffect, useRef, useCallback } from "react";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

type Options = {
  /** If true, when there's no timestamp (first run / cleared storage), run immediately once. */
  runIfNeverUpdated?: boolean;
  /** localStorage key to READ lastUpdated from (updateData writes it). */
  storageKey?: string;
};

/**
 * Schedules updateData to run exactly 6h after the last successful update.
 * - Reads lastUpdated from state, or falls back to localStorage[storageKey].
 * - Does NOT write to localStorage (persistence is handled in updateData()).
 */
export function useStaleRefresh(
  lastUpdated: Date | null,
  loading: boolean,
  updateData: () => void,
  opts: Options = {}
) {
  const { runIfNeverUpdated = true, storageKey = "govActions:lastUpdated" } = opts;

  // Keep latest values without rescheduling timers on every render
  const loadingRef = useRef(loading);
  const updateRef = useRef(updateData);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    updateRef.current = updateData;
  }, [updateData]);

  // Read effective lastUpdated (state first, otherwise localStorage)
  const getEffectiveLastUpdated = useCallback((): number | null => {
    if (lastUpdated) return lastUpdated.getTime();
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      }
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
    return null;
  }, [lastUpdated, storageKey]);

  useEffect(() => {
    // clear any previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const last = getEffectiveLastUpdated();

    // If we don't have a timestamp yet
    if (last == null) {
      if (runIfNeverUpdated && !loadingRef.current) {
        // fire once immediately; updateData will set state and write localStorage
        updateRef.current();
      }
      return;
    }

    // Compute delay until the 6h mark from last update
    const age = Date.now() - last;
    const delay = Math.max(SIX_HOURS_MS - age, 0);

    timerRef.current = window.setTimeout(() => {
      if (!loadingRef.current) {
        updateRef.current();
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // Intentionally exclude `loading`/`updateData` to keep scheduling stable.
  }, [getEffectiveLastUpdated, runIfNeverUpdated]);
}