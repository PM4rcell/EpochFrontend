import { motion } from "motion/react";
import { Star } from "lucide-react";

interface RatingBadgeProps {
  rating: number;
  maxRating?: number;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function RatingBadge({ rating, maxRating = 10, theme = "default" }: RatingBadgeProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          bg: "bg-amber-600/20",
          border: "border-amber-600/50",
          star: "text-amber-500 fill-amber-500",
          text: "text-amber-400",
        };
      case "2000s":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/50",
          star: "text-blue-400 fill-blue-400",
          text: "text-blue-300",
        };
      case "modern":
        return {
          bg: "bg-slate-400/20",
          border: "border-slate-400/50",
          star: "text-slate-300 fill-slate-300",
          text: "text-slate-200",
        };
      default:
        return {
          bg: "bg-amber-600/20",
          border: "border-amber-600/50",
          star: "text-amber-500 fill-amber-500",
          text: "text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg border
        ${colors.bg} ${colors.border}
        transition-all duration-200
      `}
    >
      <Star className={`w-4 h-4 ${colors.star}`} />
      <span className={`text-sm ${colors.text}`}>
        {rating.toFixed(1)}
        <span className="text-slate-500 ml-0.5">/{maxRating}</span>
      </span>
    </motion.div>
  );
}
