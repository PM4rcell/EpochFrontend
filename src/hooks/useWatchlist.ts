import { useCallback, useEffect, useState } from "react";

export type WatchlistEntry = {
  id: number;
  movieId: number;
};

type StoredWatchlistObject = {
  id?: number;
  movie_id?: number;
  movieId?: number;
};

// Reads persisted watchlist and normalizes entries to { id, movieId }.
const parseWatchlist = (): WatchlistEntry[] => {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("epoch_user");
    if (!raw) return [];

    const stored = JSON.parse(raw) as { data?: { watchlist?: unknown } };
    const list = stored?.data?.watchlist;
    if (!Array.isArray(list)) return [];

    return list
      .map((item: unknown, index: number) => {
        if (typeof item === "number") {
          return { id: index, movieId: item };
        }

        if (typeof item === "object" && item !== null) {
          const asRecord = item as StoredWatchlistObject;
          const movieId = Number(asRecord.movie_id ?? asRecord.movieId ?? asRecord.id ?? 0);
          const id = Number(asRecord.id ?? index);
          if (!Number.isFinite(movieId) || movieId <= 0) return null;
          return { id, movieId };
        }

        return null;
      })
      .filter((entry): entry is WatchlistEntry => entry !== null);
  } catch {
    return [];
  }
};

export default function useWatchlist() {
  const [watchlistItems, setWatchlistItems] = useState<WatchlistEntry[]>(() => parseWatchlist());

  // Manual refresh point for callers after local mutations.
  const refreshWatchlist = useCallback(() => {
    setWatchlistItems(parseWatchlist());
  }, []);

  useEffect(() => {
    refreshWatchlist();

    // Sync across tabs/windows when epoch_user changes.
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "epoch_user") refreshWatchlist();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [refreshWatchlist]);

  return { watchlistItems, refreshWatchlist } as const;
}
