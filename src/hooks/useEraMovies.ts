import { useEffect, useState, useCallback } from "react";
import { fetchMoviesByEra } from "../api/movies";
import type { Movie } from "../types";

// Hook: fetch and manage movies for a given era.
// Params:
// - eraId: era identifier (number|string)
// - options.enabled: disable automatic fetching
// Returns: { movies, loading, error, refresh }
export function useEraMovies(eraId?: number | string, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // tick allows callers to trigger a refresh()
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!enabled) return;
    if (eraId === undefined || eraId === null || String(eraId).trim() === "") {
      // no era selected -> empty list
      setMovies([]);
      setLoading(false);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const id = typeof eraId === "string" ? parseInt(eraId, 10) : (eraId as number);
        const data = await fetchMoviesByEra(Number(id), controller.signal);
        if (!mounted) return; // avoid state updates after unmount
        setMovies(data || []);
      } catch (err: any) {
        if (!mounted) return;
        if (err?.name === "AbortError") return; // treat aborts as no-op
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eraId, tick, enabled]);

  return { movies, loading, error, refresh } as const;
}

export default useEraMovies;
