import { useEffect, useRef } from "react";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

export function useStaleRefresh(lastUpdated: Date | null, loading: boolean, updateData: () => void) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // clear any previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (loading) return; // don't set timers while an update is in-flight

    const last = lastUpdated?.getTime() ?? 0; // if null, treat as "never updated"
    const age = Date.now() - last;
    const delay = Math.max(SIX_HOURS_MS - age, 0); // time left until 6h mark

    // If already stale, fire immediately; else schedule for the exact moment it turns stale
    timerRef.current = window.setTimeout(() => {
      if (!loading) updateData();
    }, delay);

    // cleanup on deps change/unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lastUpdated, loading, updateData]);
}