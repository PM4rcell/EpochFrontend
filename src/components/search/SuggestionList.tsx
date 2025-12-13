import { motion } from "motion/react";
import { SuggestionItem } from "./SuggestionItem.tsx";
import { ChevronRight } from "lucide-react";

// Mock movie data for typeahead
const MOVIES = [
  {
    id: "1",
    title: "Avatar: The Way of Water",
    year: 2022,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Adventure"],
    rating: 4.5,
    runtime: "192 min",
    inCinemas: true,
  },
  {
    id: "2",
    title: "Avatar",
    year: 2009,
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Adventure"],
    rating: 4.7,
    runtime: "162 min",
    inCinemas: false,
  },
  {
    id: "3",
    title: "The Matrix Resurrections",
    year: 2021,
    poster: "https://images.unsplash.com/photo-1574267432644-f294cd0b5e6e?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Action"],
    rating: 4.0,
    runtime: "148 min",
    inCinemas: false,
  },
  {
    id: "4",
    title: "Blade Runner 2049",
    year: 2017,
    poster: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Thriller"],
    rating: 4.6,
    runtime: "164 min",
    inCinemas: false,
  },
  {
    id: "5",
    title: "Interstellar",
    year: 2014,
    poster: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Drama"],
    rating: 4.8,
    runtime: "169 min",
    inCinemas: false,
  },
  {
    id: "6",
    title: "Inception",
    year: 2010,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Thriller"],
    rating: 4.8,
    runtime: "148 min",
    inCinemas: false,
  },
  {
    id: "7",
    title: "The Dark Knight",
    year: 2008,
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
    genres: ["Action", "Crime"],
    rating: 4.9,
    runtime: "152 min",
    inCinemas: false,
  },
  {
    id: "8",
    title: "Pulp Fiction",
    year: 1994,
    poster: "https://images.unsplash.com/photo-1485095329183-d0797cdc5676?w=400&h=600&fit=crop",
    genres: ["Crime", "Drama"],
    rating: 4.7,
    runtime: "154 min",
    inCinemas: false,
  },
  {
    id: "9",
    title: "The Shawshank Redemption",
    year: 1994,
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    genres: ["Drama"],
    rating: 4.9,
    runtime: "142 min",
    inCinemas: false,
  },
  {
    id: "10",
    title: "Goodfellas",
    year: 1990,
    poster: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
    genres: ["Crime", "Drama"],
    rating: 4.8,
    runtime: "146 min",
    inCinemas: false,
  },
  {
    id: "11",
    title: "Oppenheimer",
    year: 2023,
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop",
    genres: ["Biography", "Drama"],
    rating: 4.7,
    runtime: "180 min",
    inCinemas: true,
  },
  {
    id: "12",
    title: "Dune: Part Two",
    year: 2024,
    poster: "https://images.unsplash.com/photo-1491677533189-49af044391ed?w=400&h=600&fit=crop",
    genres: ["Sci-Fi", "Adventure"],
    rating: 4.6,
    runtime: "166 min",
    inCinemas: true,
  },
];

interface SuggestionListProps {
  query: string;
  theme?: "90s" | "2000s" | "modern" | "default";
  onMovieClick: (movieId: string) => void;
  onSeeAllResults: () => void;
}

export function SuggestionList({
  query,
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

  // Filter movies based on query (case-insensitive)
  const filteredMovies = MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6); // Limit to 6 results

  if (filteredMovies.length === 0) {
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
        {filteredMovies.map((movie) => (
          <SuggestionItem
            key={movie.id}
            id={movie.id}
            title={movie.title}
            year={movie.year}
            poster={movie.poster}
            inCinemas={movie.inCinemas}
            theme={theme}
            onClick={onMovieClick}
          />
        ))}
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

export { MOVIES };