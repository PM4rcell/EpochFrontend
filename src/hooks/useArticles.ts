import { useEffect, useState, useCallback } from "react";
import { fetchNews } from "../api/news";
import type { NewsItem } from "../types";

// Lightweight Article shape used by the UI (ArticleCard / ArticleGrid)
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  tag: string;
  date: string;
  readTime: string;
  category?: string;
}

// Fallback image used when the backend doesn't provide a thumbnail
const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1517604931442-7f8f8d7a3f1f?w=800&h=600&fit=crop";

// Map a backend `NewsItem` to the UI-friendly `Article` shape.
// Keep mappings defensive: tolerate multiple possible field names.
function mapNewsItemToArticle(item: NewsItem): Article {
  const id = String(item.id ?? item.external_id ?? item.title ?? Math.random());
  const title = item.title || "Untitled";
  const excerpt = String(item.excerp ?? item.body ?? item.summary ?? "");
  const image = String(item.image ?? item.cover ?? item.thumbnail ?? item.external_link ?? PLACEHOLDER_IMAGE);
  const rawTag = String(item.tag ?? item.category ?? "");
  const tag = rawTag || "News";
  const date = String(item.date ?? item.published_at ?? item.created_at ?? "");
  const readTime = item.read_time_min ? `${item.read_time_min} min` : item.read_time ? `${item.read_time} min` : "3 min";

  // Map backend category labels to canonical UI keys used by CategoryFilters
  const normalizeCategory = (s: string) => {
    const v = s.trim().toLowerCase();
    if (!v) return "all";
    if (v.includes("announce")) return "announcements";
    if (v.includes("event")) return "events";
    if (v.includes("review")) return "reviews";
    if (v.includes("behind")) return "behind-the-scenes";
    return "all";
  };

  const category = normalizeCategory(rawTag);

  return { id, title, excerpt, image, tag, date, readTime, category };
}

/**
 * useNews
 * - Fetches news from the backend (`/api/news`) and maps items to `Article`.
 * - Exposes `articles`, `loading`, `error`, and a `refresh()` helper.
 * - Uses a mounted-flag to avoid updating state after unmount.
 */
export function useNews() {
  // Data + UI state
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // `tick` lets callers trigger a refresh by incrementing it via `refresh()`.
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    // guard to prevent setState after unmount
    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchNews();
        if (!mounted) return;
        const mapped = (data || []).map(mapNewsItemToArticle);
        setArticles(mapped);
      } catch (err: any) {
        // Ignore aborts; surface other errors to the caller/UI
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

  // Return a stable, read-only shape for consumers
  return { articles, loading, error, refresh } as const;
}
