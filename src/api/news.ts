import { apiFetch } from "./fetch";

export interface NewsItem {
  id: number;
  title: string;
  body: string;
  category?: string;
  excerp?: string; // backend uses this field name in example
  read_time_min?: number;
  external_link?: string | null;
  [key: string]: any;
}

/**
 * Fetch news from the backend and normalize common response shapes.
 * Returns an array of `NewsItem` or an empty array on error/unexpected shape.
 */
export async function fetchNews(signal?: AbortSignal): Promise<NewsItem[]> {
  const data = await apiFetch<any>("/api/news", { signal });

  if (Array.isArray(data)) return data as NewsItem[];
  if (data && Array.isArray((data as any).news)) return (data as any).news as NewsItem[];
  if (data && Array.isArray((data as any).data)) return (data as any).data as NewsItem[];
  if (data && Array.isArray((data as any).items)) return (data as any).items as NewsItem[];

  console.warn("fetchNews: unexpected response shape", data);
  return [];
}

/**
 * Fetch single article by id and normalize response.
 */
export async function fetchArticle(id: string | number, signal?: AbortSignal): Promise<NewsItem | null> {
  if (id === undefined || id === null) return null;

  const data = await apiFetch<any>(`/api/news/${id}`, { signal });

  // Common shapes: { data: { ... } } or direct object
  if (!data) return null;
  if ((data as any).data && typeof (data as any).data === "object") return (data as any).data as NewsItem;
  if (typeof data === "object") return data as NewsItem;

  return null;
}
