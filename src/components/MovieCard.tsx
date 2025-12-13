import { motion } from "motion/react";
import { Star, Clock, Play } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./ImageWithFallback/ImageWithFallback";

interface MovieCardProps {
  title: string;
  year: number;
  rating: number;
  runtime: string;
  poster: string;
  theme: "90s" | "2000s" | "modern";
  onClick?: () => void;
}

export function MovieCard({ title, year, rating, runtime, poster, theme, onClick }: MovieCardProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          border: "border-amber-500/30",
          glow: "hover:shadow-[0_8px_30px_rgb(245,158,11,0.3)]",
          buttonBg: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/50",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          border: "border-blue-400/30",
          glow: "hover:shadow-[0_8px_30px_rgb(96,165,250,0.3)]",
          buttonBg: "bg-blue-400/10 hover:bg-blue-400/20 border-blue-400/50",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          border: "border-slate-300/30",
          glow: "hover:shadow-[0_8px_30px_rgb(226,232,240,0.3)]",
          buttonBg: "bg-slate-300/10 hover:bg-slate-300/20 border-slate-300/50",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border ${colors.border} ${colors.glow} transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Poster */}
      <div className="relative h-64 overflow-hidden group">
        <ImageWithFallback
          src={poster}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white mb-1">{title}</h3>
        <p className="text-slate-400 mb-3">{year}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? `${colors.accent} fill-current`
                  : "text-slate-600"
              }`}
            />
          ))}
          <span className="text-slate-400 ml-2">{rating.toFixed(1)}</span>
        </div>

        {/* Runtime */}
        <div className="flex items-center gap-2 text-slate-400 mb-4">
          <Clock className="w-4 h-4" />
          <span>{runtime}</span>
        </div>

        {/* Button */}
        <Button
          size="sm"
          className={`w-full ${colors.buttonBg} border ${colors.accent} transition-all duration-200`}
        >
          <Play className="w-4 h-4 mr-2" />
          Watch Trailer
        </Button>
      </div>
    </motion.div>
  );
}
