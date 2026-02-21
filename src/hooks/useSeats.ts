import { useCallback, useEffect, useState } from "react";
import { fetchSeats } from "../api/seats";
import type { SeatApi } from "../types";

export function useSeats(screeningId?: string | null) {
  const [seats, setSeats] = useState<SeatApi[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!screeningId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSeats(screeningId);
      if (signal?.aborted) return;
      setSeats(res || []);
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

  const refetch = useCallback(() => {
    const controller = new AbortController();
    load(controller.signal);
  }, [load]);

  return { seats, loading, error, refetch } as const;
}
