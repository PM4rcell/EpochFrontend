import { useEffect, useState } from "react";
import { fetchMoviesByTitle } from "../api/movies";
import type { Movie } from "../api/movies";

type UseSearchMoviesResult = {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
};

export function useSearchMovies(query?: string | null): UseSearchMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only search if query exists and has at least 2 characters
    if (!query || query.trim().length < 2) {
      setMovies([]);
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    (async () => {
      try {
        const res = await fetchMoviesByTitle(query.trim(), controller.signal);
        if (!mounted) return;
        setMovies(res || []);
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
  }, [query]);
  
  return { movies, loading, error };
}

export default useSearchMovies;

