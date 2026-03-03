import { apiFetch } from "./fetch";

// Remove a watchlist item from the user's watchlist by its ID. 

export async function removeFromWatchlist(watchlistItemId: number) {
  return apiFetch(`/api/profileWatchlists/${watchlistItemId}`, {
    method: "DELETE",
  });
}