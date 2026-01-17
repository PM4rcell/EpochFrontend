import { motion } from "motion/react";
import { SuggestionItem } from "./SuggestionItem.tsx";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import type { Movie } from "../../api/movies";

interface SuggestionListProps {
  query: string;
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  theme?: "90s" | "2000s" | "modern" | "default";
  onMovieClick: (movieId: string) => void;
  onSeeAllResults: () => void;
}

export function SuggestionList({
  query,
  movies,
  loading,
  error,
  theme = "default",
  onMovieClick,
  onSeeAllResults,
}: SuggestionListProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          hoverText: "hover:text-amber-400",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          hoverText: "hover:text-blue-300",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          hoverText: "hover:text-white",
        };
      default:
        return {
          accent: "text-amber-500",
          hoverText: "hover:text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  // Show loading state with skeleton items
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
        className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50"
      >
        {/* Skeleton Suggestions */}
        <div className="p-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full flex items-center gap-3 p-2 rounded-lg"
            >
              {/* Poster Thumbnail Skeleton */}
              <div className="shrink-0 w-10 h-15 rounded overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>

              {/* Info Skeleton */}
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
        className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-4 z-50"
      >
        <p className="text-slate-400 text-center">Error searching movies</p>
      </motion.div>
    );
  }

  // Limit to 6 results for display (ensure movies is an array)
  const displayedMovies = (movies || []).slice(0, 5);

  // Show no results state
  if (displayedMovies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
        className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] p-4 z-50"
      >
        <p className="text-slate-400 text-center">No movies found</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
      className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50"
    >
      {/* Suggestions */}
      <div className="p-2 max-h-100 overflow-y-auto overflow-x-visible">
        {displayedMovies.map((movie) => {
          const year = movie.release_date ? new Date(movie.release_date).getFullYear() : NaN;
          const posterUrl = (movie as any).poster?.url || (movie as any).poster || (movie as any).poster_path || "";
          
          return (
            <SuggestionItem
              key={movie.id}
              id={String(movie.id)}
              title={movie.title}
              year={year}
              poster={posterUrl}
              inCinemas={movie.is_featured || false}
              theme={theme}
              onClick={onMovieClick}
            />
          );
        })}
      </div>

      {/* See All Results */}
      <motion.button
        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
        onClick={onSeeAllResults}
        className="w-full flex items-center justify-between p-3 border-t border-slate-700/50 text-slate-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
      >
        <span className={`${colors.hoverText} transition-colors duration-200`}>
          See all results for &apos;{query}&apos;
        </span>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}