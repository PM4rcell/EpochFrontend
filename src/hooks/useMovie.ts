import { useEffect, useState } from "react";
import { fetchMovieById } from "../api/movies";

type MovieResult<T = any> = {
  movie: T | null;
  loading: boolean;
  error: Error | null;
};

// egy hook, ami egy adott ID-jú filmet kér le 
export function useMovie<T>(id?: string | null): MovieResult<T> {
  const [movie, setMovie] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setMovie(null);
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    // fetchMovieById normalizes response shapes from the API.
    const numericId = Number(id);
    fetchMovieById(isNaN(numericId) ? (id as unknown as number) : numericId)
      .then((data) => {
        // Log full API response for debugging
        try {
          console.log("fetchMovieById response:", data);
        } catch (e) {
          // ignore logging errors
        }
        if (!mounted) return;
        setMovie(data as T);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { movie, loading, error };
}

export default useMovie;
