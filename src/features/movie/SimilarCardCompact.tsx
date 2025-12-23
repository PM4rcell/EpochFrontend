import { motion } from "motion/react";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";
import { Star } from "lucide-react";

interface SimilarCardCompactProps {
  title: string;
  year: number;
  image: string;
  rating?: number;
  era?: string;
  onClick?: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function SimilarCardCompact({ 
  title, 
  year, 
  image, 
  rating,
  era,
  onClick, 
  theme = "default" 
}: SimilarCardCompactProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          border: "border-amber-600/20",
          glow: "hover:shadow-[0_4px_16px_rgba(245,158,11,0.3)]",
          text: "group-hover:text-amber-400",
          rating: "text-amber-500",
          chip: "bg-amber-600/20 text-amber-400 border-amber-500/30",
        };
      case "2000s":
        return {
          border: "border-blue-500/20",
          glow: "hover:shadow-[0_4px_16px_rgba(96,165,250,0.3)]",
          text: "group-hover:text-blue-300",
          rating: "text-blue-400",
          chip: "bg-blue-500/20 text-blue-300 border-blue-400/30",
        };
      case "modern":
        return {
          border: "border-slate-400/20",
          glow: "hover:shadow-[0_4px_16px_rgba(226,232,240,0.3)]",
          text: "group-hover:text-white",
          rating: "text-slate-300",
          chip: "bg-slate-400/20 text-slate-300 border-slate-400/30",
        };
      default:
        return {
          border: "border-amber-600/20",
          glow: "hover:shadow-[0_4px_16px_rgba(245,158,11,0.3)]",
          text: "group-hover:text-amber-400",
          rating: "text-amber-500",
          chip: "bg-amber-600/20 text-amber-400 border-amber-500/30",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ y: -2, filter: "brightness(1.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        group cursor-pointer rounded-lg overflow-hidden border bg-black/40
        ${colors.border} ${colors.glow}
        transition-all duration-200
        flex items-center gap-3 p-3
      `}
    >
      {/* Thumbnail */}
      <div className="shrink-0 w-16 h-24 rounded overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={`
          text-slate-200 text-sm mb-1 line-clamp-1 transition-colors duration-200 
          ${colors.text}
        `}>
          {title}
        </h4>
        
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>{year}</span>
          {rating && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className={`w-3 h-3 ${colors.rating} fill-current`} />
                <span className="text-slate-400">{rating.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>

        {era && (
          <div className="mt-2">
            <span className={`
              inline-block text-[10px] px-2 py-0.5 rounded border
              ${colors.chip}
            `}>
              {era}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}