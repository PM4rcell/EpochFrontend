import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Reusable navigation hook to go to an article detail page by id.
// Place for analytics, prefetching, or scroll behavior.
export function useArticleNavigationId() {
  const navigate = useNavigate();

  return useCallback((id: number | string) => {
    if (id === undefined || id === null) return;

    // Analytics placeholder
    try {
      // window?.gtag?.('event', 'click_article', { article_id: id });
    } catch {}

    // TODO: add prefetch logic here if desired

    navigate(`/article/${id}`);
  }, [navigate]);
}
