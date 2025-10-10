// ./hooks/useStaleRefresh.ts
"use client";

import { useEffect, useRef, useCallback } from "react";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

type Options = {
  /** If true, when there's no timestamp (first run / cleared storage), run immediately once. */
  runIfNeverUpdated?: boolean;
  /** localStorage key used to persist lastUpdated. Use a unique key per feature. */
  storageKey?: string;
};

export function useStaleRefresh(
  lastUpdated: Date | null,
  loading: boolean,
  updateData: () => void,
  opts: Options = {}
) {
  const { runIfNeverUpdated = true, storageKey = "lastUpdated" } = opts;

  // Refs to avoid re-scheduling timers when these change
  const loadingRef = useRef(loading);
  const updateRef = useRef(updateData);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    updateRef.current = updateData;
  }, [updateData]);

  // Persist to localStorage when a new lastUpdated arrives
  useEffect(() => {
    if (!storageKey) return;
    if (lastUpdated) {
      try {
        localStorage.setItem(storageKey, String(lastUpdated.getTime()));
      } catch {
        // ignore storage errors (private mode, quota, etc.)
      }
    }
  }, [lastUpdated, storageKey]);

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
      // ignore
    }
    return null;
  }, [lastUpdated, storageKey]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const last = getEffectiveLastUpdated();

    // If we don't have a timestamp yet
    if (last == null) {
      if (runIfNeverUpdated && !loadingRef.current) {
        // Fire once immediately, then exit (will get a timestamp after success)
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

    // Cleanup on deps change/unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    // Intentionally exclude `loading`/`updateData` to keep scheduling stable.
  }, [getEffectiveLastUpdated, runIfNeverUpdated]);
}