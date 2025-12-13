import { motion } from "motion/react";
import { ImageWithFallback } from "../ImageWithFallback/ImageWithFallback";

interface SuggestionItemProps {
  id: string;
  title: string;
  year: number;
  poster: string;
  inCinemas?: boolean;
  theme?: "90s" | "2000s" | "modern" | "default";
  onClick: (id: string) => void;
}

export function SuggestionItem({
  id,
  title,
  year,
  poster,
  inCinemas = false,
  theme = "default",
  onClick,
}: SuggestionItemProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          tag: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          hover: "hover:bg-amber-500/5",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          tag: "bg-blue-400/10 text-blue-300 border-blue-400/30",
          hover: "hover:bg-blue-400/5",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          tag: "bg-slate-300/10 text-slate-200 border-slate-300/30",
          hover: "hover:bg-slate-300/5",
        };
      default:
        return {
          accent: "text-amber-500",
          tag: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          hover: "hover:bg-amber-500/5",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.button
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 p-2 rounded-lg ${colors.hover} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50 text-left group`}
    >
      {/* Poster Thumbnail */}
      <div className="shrink-0 w-10 h-15 rounded overflow-hidden bg-slate-800/50">
        <ImageWithFallback
          src={poster}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white truncate group-hover:text-slate-100 transition-colors duration-200">
          {title}
        </h4>
        <p className="text-slate-400">{year}</p>
      </div>

      {/* Tag */}
      {inCinemas && (
        <div
          className={`shrink-0 px-2 py-1 rounded-full border text-xs ${colors.tag}`}
        >
          Now showing
        </div>
      )}
    </motion.button>
  );
}
