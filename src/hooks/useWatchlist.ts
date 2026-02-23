import { useCallback, useEffect, useState } from "react";
import type { Movie } from "../types";

export type WatchlistEntry = {
  id: number;
  user_id: number;
  movie_id: number;
  movie: Movie;
};

type StoredWatchlistObject = {
  id: number;
  user_id: number;
  movie_id: number;
  movie: Movie;
};

// Reads persisted watchlist and normalizes entries to { id, movieId, movie }.
const parseWatchlist = (): WatchlistEntry[] => {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("epoch_user");
    if (!raw) return [];

    const stored = JSON.parse(raw) as { data?: { watchlist?: StoredWatchlistObject[] } };
    const list = stored?.data?.watchlist;
    if (!Array.isArray(list)) return [];

    return list
      .map((item: StoredWatchlistObject, index: number) => {
        if (typeof item === "object" && item !== null) {
          const asRecord = item as StoredWatchlistObject;
          const movieId = Number(asRecord.movie_id ?? asRecord.id ?? 0);
          const id = Number(asRecord.id ?? index);
          const userId = Number(asRecord.user_id ?? 0);
          if (!Number.isFinite(movieId) || movieId <= 0) return null;
          return { id, movie_id: movieId, user_id: userId, movie: asRecord.movie };
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

  }, [refreshWatchlist]);

  return { watchlistItems, refreshWatchlist } as const;
}
