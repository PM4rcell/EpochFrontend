import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useEra } from "../../context/EraContext";
import { motion, AnimatePresence } from "motion/react";
import { Skeleton } from "../../components/ui/skeleton";
import { Spinner } from "../../components/ui/spinner";
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { SearchBar } from "./SearchBar";
import { MovieCard } from "../../components/ui/movie-card";
import { useSearchMovies } from "../../hooks/useSearchMovies";
import { useMovieNavigationId } from "../../hooks/useMovieNavigationId";
import type { Movie as ApiMovie } from "../../types";
import { Filter, ChevronDown } from "lucide-react";

interface SearchResultsPageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  initialQuery?: string;
  onNavigate?: (page: string) => void;
  onMovieClick?: (movieId: string) => void;
  onSearchSubmit?: (query: string) => void;
}

type FilterType = "all" | "inCinemas" | "upcoming" | "byRating";
type SortType = "relevant" | "newest" | "alphabetical";

export function SearchResultsPage({
  initialQuery = "",
  onMovieClick,
  onSearchSubmit,
}: SearchResultsPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("relevant");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const location = useLocation();
  const navigateToMovie = useMovieNavigationId();
  const { era } = useEra();

  // Compute the applied theme (EraContext overrides the page `theme` prop).
  // When no era is selected (null) use the 90s theme by default.
  const appliedTheme = (era ?? "90s") as "90s" | "2000s" | "modern";

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q") ?? initialQuery;
    setQuery(q);
  }, [location.search, initialQuery]);

  const getThemeColors = () => {
    return {
      accent: "text-[var(--theme-accent)]",
      activeBg: "bg-[color:var(--theme-glow)] border-[color:var(--theme-border)]",
      inactiveBorder: "border-[color:var(--theme-border)]",
      hoverBg: "hover:bg-[color:var(--theme-glow)]",
      gradientFrom: "from-[var(--theme-button-bg)]",
      gradientTo: "to-[var(--theme-button-hover)]",
    };
  };

  const colors = getThemeColors();

  // Use search hook to fetch matching movies when a query exists
  const { movies: apiMovies, loading } = useSearchMovies(query);

  // Map API movie shape to the simplified model used by this page
  const sourceMovies = (apiMovies || []).map((m: ApiMovie) => ({
    id: String((m as any).id ?? ""),
    title: (m as any).title ?? "",
    year: m.release_date ? new Date(m.release_date).getFullYear() : ((m as any).year ?? 0),
    rating: (m as any).vote_avg ?? (m as any).rating ?? 0,
    runtime: (m as any).runtime_min ? `${(m as any).runtime_min} min` : (m as any).runtime ?? "",
    poster: (m as any).poster?.url || (m as any).poster || (m as any).poster_path || "",
    inCinemas: !!(m as any).is_featured,
  }));

  // Filter and sort logic (operates on the mapped `sourceMovies`)
  const getFilteredMovies = () => {
    const base = query ? sourceMovies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase())) : sourceMovies;
    let filtered = [...base];

    // Apply filter
    switch (activeFilter) {
      case "inCinemas":
        filtered = filtered.filter((movie) => movie.inCinemas);
        break;
      case "upcoming":
        filtered = filtered.filter((movie) => movie.year >= 2024);
        break;
      case "byRating":
        filtered = filtered.filter((movie) => movie.rating >= 4.5);
        break;
      default:
        break;
    }

    // Apply sort
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => b.year - a.year);
        break;
      case "alphabetical":
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // relevant - keep original order
        break;
    }

    return filtered;
  };

  const filteredMovies = getFilteredMovies();
  const hasQuery = query.trim().length > 0;

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "inCinemas", label: "In cinemas" },
    { id: "upcoming", label: "Upcoming" },
    { id: "byRating", label: "Top rated" },
  ];

  const sortOptions: { id: SortType; label: string }[] = [
    { id: "relevant", label: "Most relevant" },
    { id: "newest", label: "Newest first" },
    { id: "alphabetical", label: "A-Z" },
  ];

  return (
    <div data-theme={appliedTheme} className="min-h-screen bg-black text-white">
      <Navbar theme={appliedTheme} activePage="movies" />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h1
              className={`mb-3 bg-linear-to-r ${colors.gradientFrom} via-slate-200 ${colors.gradientTo} bg-clip-text text-transparent`}
            >
              {hasQuery ? "Search results" : "Browse movies"}
            </h1>
            {hasQuery && (
              <p className="text-slate-400">
                Results for &apos;{query}&apos; ({filteredMovies.length}{" "}
                {filteredMovies.length === 1 ? "movie" : "movies"})
              </p>
            )}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6"
          >
            <SearchBar
              theme={appliedTheme}
              onMovieClick={onMovieClick}
              onSearchSubmit={(newQuery) => {
                setQuery(newQuery);
                onSearchSubmit?.(newQuery);
              }}
              showDropdown={true}
              className="max-w-2xl"
            />
          </motion.div>

          {/* Filters and Sort */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          >
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50 ${
                    activeFilter === filter.id
                      ? `${colors.activeBg} ${colors.accent}`
                      : `${colors.inactiveBorder} text-slate-400 ${colors.hoverBg}`
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className={`flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm border ${colors.inactiveBorder} rounded-lg text-slate-400 ${colors.hoverBg} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50`}
              >
                <span>
                  Sort:{" "}
                  {sortOptions.find((opt) => opt.id === sortBy)?.label}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showSortMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Sort Dropdown */}
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-md border border-slate-700/50 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden z-20"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 transition-colors duration-200 focus:outline-none ${
                          sortBy === option.id
                            ? `${colors.accent} bg-white/5`
                            : `text-slate-400 hover:bg-white/5`
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Grid */}
          <AnimatePresence mode="wait">
            {filteredMovies.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.05, 0.3),
                    }}
                  >
                      <MovieCard
                      title={movie.title}
                      year={movie.year}
                      rating={movie.rating}
                      runtime={movie.runtime}
                      poster={movie.poster}
                      theme={appliedTheme}
                      onClick={() => {
                        if (onMovieClick) onMovieClick(movie.id);
                        else navigateToMovie(movie.id);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20"
              >
                {loading && hasQuery ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center text-center py-6">
                      <Spinner theme={appliedTheme} size="sm" />
                      <h3 className="mt-3 italic text-slate-400">Loading movies...</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-56 w-full rounded-lg" />
                          <div className="flex gap-2 items-center">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                          </div>
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className={`w-20 h-20 mx-auto mb-6 rounded-full bg-linear-to-br ${colors.gradientFrom} ${colors.gradientTo} opacity-20 flex items-center justify-center`}
                    >
                      <Filter className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="mb-3 text-white">
                      No movies found
                      {hasQuery && ` for "${query}"`}
                    </h2>
                    <p className="text-slate-400 mb-6">
                      Try a different search term or adjust your filters
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer theme={appliedTheme} />

      {/* Ambient lighting */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-slate-400/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}