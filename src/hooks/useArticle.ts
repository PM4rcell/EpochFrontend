import { useEffect, useState, useCallback } from "react";
import { fetchArticle, type NewsItem } from "../api/news";

export interface ArticleDetail {
  id: string;
  title: string;
  excerpt: string;
  image: string | null;
  tag: string;
  date: string;
  readTime: string;
  author: string;
  body: string;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1517604931442-7f8f8d7a3f1f?w=1200&h=600&fit=crop";

function mapNewsItemToDetail(item: NewsItem | null): ArticleDetail | null {
  if (!item) return null;
  const id = String(item.id ?? "");
  const title = item.title ?? "Untitled";
  const excerpt = String(item.excerp ?? item.body ?? "");
  const image = String(item.poster ?? item.image ?? item.cover ?? item.thumbnail ?? item.external_link ?? PLACEHOLDER_IMAGE);
  const tag = String(item.category ?? item.tag ?? "News");
  const date = String(item.date ?? item.published_at ?? item.created_at ?? "");
  const readTime = item.read_time_min ? `${item.read_time_min} min` : item.read_time ? `${item.read_time} min` : "3 min";
  const author = String((item.author && (item.author as any).name) ?? item.author ?? "" );
  const body = String(item.body ?? "");

  return { id, title, excerpt, image, tag, date, readTime, author, body };
}

export function useArticle(articleId?: string | null) {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!articleId) {
      setArticle(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Do not forward the caller signal into apiFetch to avoid
      // cases where an already-aborted signal causes immediate failures.
      const data = await fetchArticle(articleId);
      setArticle(mapNewsItemToDetail(data));
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await fetch();
      } catch {}
    })();

    return () => {
      mounted = false;
    };
  }, [fetch]);

  const refresh = useCallback(() => {
    fetch().catch(() => {});
  }, [fetch]);

  return { article, loading, error, refresh } as const;
}
