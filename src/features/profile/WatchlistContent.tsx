import { useNavigate } from "react-router-dom";
import { WatchlistItem } from "./WatchlistItem";
import type { WatchlistEntry } from "../../types/api";
import fallbackImg from "../../assets/img/fallback-image.png";

interface WatchlistContentProps {
  watchlistItems: WatchlistEntry[];
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function WatchlistContent({ watchlistItems, theme = "default" }: WatchlistContentProps) {
  const navigate = useNavigate();

  return (
    <section className="py-8">
      {watchlistItems.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-500">Your saved movies will appear here</p>
        </div>
      ) : (
        // Temporary fallback cards until API returns expanded movie data.
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {watchlistItems.map((item) => (
            <WatchlistItem
              key={`${item.id}-${item.movie_id}`}
              watchlistItemId={item.id}
              movieId={item.movie_id}
              title={`${item.movie?.title ?? "Unknown Title"}`}
              rating={item.movie?.vote_avg ?? 0}
              length={`${item.movie?.runtime_min ?? "Unknown runtime"} min`}
              releaseYear={Number(item.movie?.release_date?.split("-")[0] ?? 0)}
              posterUrl={item.movie?.poster?.url ?? fallbackImg}
              theme={theme}
              // Navigate directly to movie details from watchlist card.
              onBookNow={() => navigate(`/movies/${item.movie_id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
