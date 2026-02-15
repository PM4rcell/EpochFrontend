import { useCallback, useEffect, useState } from "react";
import { fetchArticle } from "../api/news";

type Featured = {
  id: string;
  title: string;
  tag: string;
  image?: string;
};

const DEFAULT: Featured = {
  id: "1",
  title: "Behind the Scenes: The Making of Modern Cinema",
  tag: "Announcements",
  image: "",
};

export default function useFeaturedArticle() {
  const [featured, setFeatured] = useState<Featured>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const c = new AbortController();
    try {
      const a = await fetchArticle(1, c.signal);
      if (!a) {
        setLoading(false);
        return;
      }
      const title = a.title ?? DEFAULT.title;
      const tag = (a as any).category ?? (a as any).tag ?? (a as any).section ?? DEFAULT.tag;
      const image = (a as any).image || (a as any).image_url || (a as any).cover || (a as any).poster?.url || (a as any).thumbnail;
      setFeatured({ id: String(a.id ?? 1), title, tag, image });
    } catch (err) {
      if ((err as any).name === "AbortError") {
        // aborted
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
    return () => c.abort();
  }, []);

  useEffect(() => {
    const c = new AbortController();
    // call refresh but ensure abort handling inside fetchArticle
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const a = await fetchArticle(1, c.signal);
        if (!a) return;
        const title = a.title ?? DEFAULT.title;
        const tag = (a as any).category ?? (a as any).tag ?? (a as any).section ?? DEFAULT.tag;
        const image = (a as any).image || (a as any).image_url || (a as any).cover || (a as any).poster?.url || (a as any).thumbnail;
        setFeatured({ id: String(a.id ?? 1), title, tag, image });
      } catch (err) {
        if ((err as any).name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    })();
    return () => c.abort();
  }, []);

  return { featured, loading, error, refresh } as const;
}
