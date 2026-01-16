import { useEffect, useState } from "react";
import { fetchSimilarMovies } from "../api/movies";
import type { Movie } from "../api/movies";

type UseSimilarMoviesResult = {
  items: Movie[];
  loading: boolean;
  error: Error | null;
};

export function useSimilarMovies(movieId?: string | number | null): UseSimilarMoviesResult {
  const [items, setItems] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!movieId) {
      setItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    const controller = new AbortController();
    const numericId = Number(movieId);

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetchSimilarMovies(isNaN(numericId) ? (movieId as unknown as number) : numericId, controller.signal);
        if (!mounted) return;
        setItems(res || []);
      } catch (err: any) {
        if (!mounted) return;
        const isAbort = (err && ((err as any).name === "AbortError" || (err as any).message === "Request aborted or timed out"));
        if (isAbort) return;
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
  }, [movieId]);
  
  return { items, loading, error };
}

export default useSimilarMovies;
