import { motion } from "motion/react";
import { Star, Clock, Calendar, X } from "lucide-react";
import { Button } from "../../components/ui/button";

interface WatchlistItemProps {
  movieId: number;
  title: string;
  rating: number;
  length: string;
  releaseYear: number;
  posterUrl: string;
  theme?: "90s" | "2000s" | "modern" | "default";
  onRemove?: () => void;
  onBookNow?: () => void;
}

export function WatchlistItem({
  movieId,
  title,
  rating,
  length,
  releaseYear,
  posterUrl,
  theme = "default",
  onRemove,
  onBookNow,
}: WatchlistItemProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          border: "border-amber-500/30",
          buttonBg: "bg-amber-500/10",
          buttonHover: "hover:bg-amber-500/20",
          buttonBorder: "border-amber-500/50",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          border: "border-blue-400/30",
          buttonBg: "bg-blue-400/10",
          buttonHover: "hover:bg-blue-400/20",
          buttonBorder: "border-blue-400/50",
          glow: "shadow-[0_0_20px_rgba(96,165,250,0.1)]",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          border: "border-slate-400/30",
          buttonBg: "bg-slate-400/10",
          buttonHover: "hover:bg-slate-400/20",
          buttonBorder: "border-slate-400/50",
          glow: "shadow-[0_0_20px_rgba(226,232,240,0.1)]",
        };
      default:
        return {
          accent: "text-amber-500",
          border: "border-amber-500/30",
          buttonBg: "bg-amber-500/10",
          buttonHover: "hover:bg-amber-500/20",
          buttonBorder: "border-amber-500/50",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={`relative group rounded-xl bg-gradient-to-br from-slate-900/60 via-black/40 to-black/60 backdrop-blur-sm border ${colors.border} ${colors.glow} overflow-hidden`}
    >
      {/* Remove button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-250"
      >
        <Button
          onClick={onRemove}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 bg-black/80 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 rounded-lg"
        >
          <X className="w-4 h-4 text-slate-400 hover:text-red-400" />
        </Button>
      </motion.div>

      <div className="flex gap-4 p-4">
        {/* Poster */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="relative flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden"
        >
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          {/* Title */}
          <div>
            <h3 className="text-white font-medium truncate mb-2">{title}</h3>
            <p className="text-slate-500 text-xs mb-2">Movie ID: {movieId}</p>

            {/* Metadata */}
            <div className="space-y-2">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${colors.accent} fill-current`} />
                <span className={`text-sm ${colors.accent}`}>
                  {rating > 0 ? rating.toFixed(1) : "N/A"}
                </span>
                <span className="text-slate-500 text-sm">/ 10</span>
              </div>

              {/* Length */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{length}</span>
              </div>

              {/* Release Year */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">{releaseYear > 0 ? releaseYear : "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Watch button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-3"
          >
            <Button
              size="sm"
              onClick={onBookNow}
              className={`w-full ${colors.buttonBg} ${colors.buttonBorder} ${colors.buttonHover} border ${colors.accent} transition-all duration-250`}
            >
              Book Now
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
