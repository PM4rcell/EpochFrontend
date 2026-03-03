import {  removeFromWatchlist } from "../api/watchlist";

export function useRemoveWatchlistItem() {
  const removeItem = async (watchlistItemId: number) => {
    try {
      await removeFromWatchlist(watchlistItemId);
      // Optionally, you could trigger a refetch of the watchlist here or return a success status
    } catch (error) {
      console.error("Failed to remove item from watchlist:", error);
      // Optionally, you could return an error status or throw the error to be handled by the caller
    }
  };
  return removeItem;
}