import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Reusable navigation hook to go to a movie detail page by id.
// Place for analytics, prefetching, or scroll behavior.
export function useMovieNavigationId() {
  const navigate = useNavigate();

  return useCallback((id: number | string) => {
    if (id === undefined || id === null) return;

    // Analytics placeholder
    try {
      // window?.gtag?.('event', 'click_movie', { movie_id: id });
    } catch {}

    // TODO: add prefetch logic here if desired

    navigate(`/movies/${id}`);
  }, [navigate]);
}
