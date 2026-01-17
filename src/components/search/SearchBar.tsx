import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X } from "lucide-react";
import { SuggestionList } from "./SuggestionList.tsx";
import { useSearchMovies } from "../../hooks/useSearchMovies";

interface SearchBarProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onMovieClick?: (movieId: string) => void;
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
  showDropdown?: boolean;
  className?: string;
}

export function SearchBar({
  theme = "default",
  onMovieClick,
  onSearchSubmit,
  placeholder = "Search movies...",
  showDropdown = true,
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Use the search hook to fetch movies as the user types
  const { movies, loading, error } = useSearchMovies(query);

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          border: "border-amber-500/30",
          focusBorder: "border-amber-500/60",
          focusRing: "ring-amber-500/50",
          hoverIcon: "hover:text-amber-400",
          glow: "shadow-[0_0_16px_rgba(245,158,11,0.3)]",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          border: "border-blue-400/30",
          focusBorder: "border-blue-400/60",
          focusRing: "ring-blue-400/50",
          hoverIcon: "hover:text-blue-300",
          glow: "shadow-[0_0_16px_rgba(96,165,250,0.3)]",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          border: "border-slate-300/30",
          focusBorder: "border-slate-300/60",
          focusRing: "ring-slate-300/50",
          hoverIcon: "hover:text-white",
          glow: "shadow-[0_0_16px_rgba(226,232,240,0.3)]",
        };
      default:
        return {
          accent: "text-amber-500",
          border: "border-amber-500/30",
          focusBorder: "border-amber-500/60",
          focusRing: "ring-amber-500/50",
          hoverIcon: "hover:text-amber-400",
          glow: "shadow-[0_0_16px_rgba(245,158,11,0.3)]",
        };
    }
  };

  const colors = getThemeColors();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Only show dropdown if query has at least 2 characters (matching hook requirement)
    if (value.trim().length >= 2 && showDropdown) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearchSubmit) {
      onSearchSubmit(query);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() && onSearchSubmit) {
      onSearchSubmit(query);
      setIsOpen(false);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={isOpen ? { scale: 1 } : { scale: 1 }}
          className={`relative flex items-center bg-black/60 backdrop-blur-sm border ${
            isOpen ? `${colors.focusBorder} ${colors.glow}` : colors.border
          } rounded-lg transition-all duration-250 overflow-hidden`}
        >
          {/* Search Icon */}
          <button
            type="submit"
            className={`flex items-center justify-center w-10 h-10 text-slate-400 ${colors.hoverIcon} transition-colors duration-200 focus:outline-none`}
            aria-label="Submit search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && showDropdown && setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white placeholder:text-slate-500 px-2 py-2 focus:outline-none"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                type="button"
                onClick={handleClear}
                className={`flex items-center justify-center w-10 h-10 text-slate-400 ${colors.hoverIcon} transition-colors duration-200 focus:outline-none`}
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Suggestion Dropdown */}
      <AnimatePresence>
        {isOpen && query.trim().length >= 2 && (
          <SuggestionList
            query={query}
            movies={movies}
            loading={loading}
            error={error}
            theme={theme}
            onMovieClick={(movieId: string) => {
              onMovieClick?.(movieId);
              setIsOpen(false);
              setQuery("");
            }}
            onSeeAllResults={() => {
              onSearchSubmit?.(query);
              setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
