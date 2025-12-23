import { useState } from "react";
import { Star } from "lucide-react";
import { motion } from "motion/react";

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function StarRating({ 
  rating, 
  onChange, 
  readonly = false, 
  size = "md",
  theme = "default" 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          active: "text-amber-500 fill-amber-500",
          hover: "text-amber-400 fill-amber-400",
          inactive: "text-slate-700",
        };
      case "2000s":
        return {
          active: "text-blue-400 fill-blue-400",
          hover: "text-blue-300 fill-blue-300",
          inactive: "text-slate-700",
        };
      case "modern":
        return {
          active: "text-slate-300 fill-slate-300",
          hover: "text-slate-200 fill-slate-200",
          inactive: "text-slate-700",
        };
      default:
        return {
          active: "text-amber-500 fill-amber-500",
          hover: "text-amber-400 fill-amber-400",
          inactive: "text-slate-700",
        };
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-3.5 h-3.5";
      case "md":
        return "w-5 h-5";
      case "lg":
        return "w-6 h-6";
    }
  };

  const colors = getThemeColors();
  const sizeClass = getSizeClass();

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoverRating || rating) >= star;
        const isHovered = !readonly && hoverRating >= star;

        return (
          <motion.button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            whileHover={!readonly ? { scale: 1.1 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            transition={{ duration: 0.15 }}
            className={`
              ${readonly ? "cursor-default" : "cursor-pointer"}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
              ${theme === "90s" ? "focus:ring-amber-500/50" : theme === "2000s" ? "focus:ring-blue-400/50" : theme === "modern" ? "focus:ring-slate-300/50" : "focus:ring-amber-500/50"}
              rounded
            `}
          >
            <Star
              className={`
                ${sizeClass}
                ${isFilled 
                  ? isHovered ? colors.hover : colors.active
                  : colors.inactive
                }
                transition-colors duration-150
              `}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
