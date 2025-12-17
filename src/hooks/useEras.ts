import { useEffect, useState, useCallback } from "react";
import { fetchEras, type Era as EraType } from "../api/eras";

export function useEras() {
  const [eras, setEras] = useState<EraType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchEras();
        if (!mounted) return;
        setEras(data || []);
      } catch (err: any) {
        if (!mounted) return;
        if (err?.name === "AbortError") return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tick]);

  return { eras, loading, error, refresh } as const;
}
