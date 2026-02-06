import { useCallback, useEffect, useState } from "react";
import { fetchScreening } from "../api/screenings";

export function useScreening(screeningId?: string | null) {
  const [screening, setScreening] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!screeningId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchScreening(screeningId);
      if (signal?.aborted) return;
      // backend may return { data: {...} } or the object directly
      setScreening(res?.data ?? res ?? null);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [screeningId]);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { screening, loading, error } as const;
}
