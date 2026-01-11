import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/fetch";

// Server-driven pagination hook for movies (or similar paginated endpoints).
// Params:
// - eraApiId: numeric era id used as query param `era_id`
// - perPage: items per page
// Returns current page items, page state and navigation helpers.
export function usePagination(eraApiId?: number | string, perPage = 6) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(eraApiId !== undefined && eraApiId !== null && String(eraApiId).trim() !== "");
  const [error, setError] = useState<Error | null>(null);
  const [hasFetched, setHasFetched] = useState<boolean>(false);

  const fetchPage = useCallback(async (page: number, signal?: AbortSignal) => {
    if (eraApiId === undefined || eraApiId === null || String(eraApiId).trim() === "") {
      setItems([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    // Mark that a new fetch has started so UI can show loading state
    setHasFetched(false);
    console.debug("usePagination: start fetch", { eraApiId, page, perPage, hasFetched });

    setLoading(true);
    setError(null);
    let aborted = false;
    try {
      const url = `/api/movies?era_id=${encodeURIComponent(String(eraApiId))}&page=${page}&per_page=${perPage}`;
      const data: any = await apiFetch(url, { signal });

      // Normalize response shapes: prefer `data` array, otherwise top-level array or `movies`/`items`.
      let arr: any[] = [];
      if (Array.isArray(data)) arr = data;
      else if (data && Array.isArray(data.data)) arr = data.data;
      else if (data && Array.isArray(data.movies)) arr = data.movies;
      else if (data && Array.isArray(data.items)) arr = data.items;

      setItems(arr || []);
      console.debug("usePagination: received data", { eraApiId, page, items: (arr || []).length, hasFetched });

      // Determine total pages from meta if available
      let maxPages = 1;
      if (data && data.meta) {
        if (typeof data.meta.last_page === "number") maxPages = data.meta.last_page;
        else if (typeof data.meta.total === "number" && typeof data.meta.per_page === "number") {
          maxPages = Math.max(1, Math.ceil(data.meta.total / data.meta.per_page));
        }
      }
      setTotalPages(maxPages);
    } catch (err: any) {
      // apiFetch normalizes aborts/timeouts into an Error with message
      // "Request aborted or timed out" (and original AbortError in `cause`).
      const isAbort = (err && ((err as any).name === "AbortError" || (err as any).message === "Request aborted or timed out" || (err as any).message?.toLowerCase().includes("aborted") || (err as any).cause?.name === "AbortError"));
      if (isAbort) {
        console.debug("usePagination: fetch aborted or timed out (ignored)", { eraApiId, page, err, hasFetched });
        aborted = true;
        return;
      }
      console.error("usePagination: fetch error", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
      if (!aborted) {
        setHasFetched(true);
        console.debug("usePagination: fetch end", { eraApiId, page, loading: false, hasFetched: true });
      } else {
        console.debug("usePagination: fetch end (aborted)", { eraApiId, page });
      }
    }
  }, [eraApiId, perPage]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    (async () => {
      if (!mounted) return;
      console.debug("usePagination: effect trigger", { eraApiId, currentPage, hasFetched });
      await fetchPage(currentPage, controller.signal);
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [fetchPage, currentPage]);

  useEffect(() => {
    // when era changes, reset to page 1 and mark loading so UI shows Loading state immediately
    setCurrentPage(1);
    setLoading(eraApiId !== undefined && eraApiId !== null && String(eraApiId).trim() !== "");
    setHasFetched(false);
  }, [eraApiId]);

  const next = useCallback(() => setCurrentPage((p) => Math.min(totalPages, p + 1)), [totalPages]);
  const prev = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const setPage = useCallback((page: number) => setCurrentPage(() => Math.max(1, Math.min(totalPages, page))), [totalPages]);

  return {
    items,
    currentPage,
    totalPages,
    loading,
    hasFetched,
    error,
    next,
    prev,
    setPage,
  } as const;
}

export default usePagination;
