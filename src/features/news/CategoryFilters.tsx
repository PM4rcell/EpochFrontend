import { motion } from "motion/react";
import type { NewsCategory } from "./NewsPage";

interface CategoryFiltersProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  activeCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

export function CategoryFilters({
  theme = "default",
  activeCategory,
  onCategoryChange,
}: CategoryFiltersProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          active: "bg-amber-500 text-black border-amber-500",
          inactive: "text-slate-400 border-slate-700 bg-black/40",
          hover: "hover:border-amber-500/50 hover:text-amber-500/80 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]",
        };
      case "2000s":
        return {
          active: "bg-blue-400 text-black border-blue-400",
          inactive: "text-slate-400 border-slate-700 bg-black/40",
          hover: "hover:border-blue-400/50 hover:text-blue-400/80 hover:shadow-[0_0_12px_rgba(96,165,250,0.2)]",
        };
      case "modern":
        return {
          active: "bg-slate-300 text-black border-slate-300",
          inactive: "text-slate-400 border-slate-700 bg-black/40",
          hover: "hover:border-slate-400/50 hover:text-slate-300/80 hover:shadow-[0_0_12px_rgba(226,232,240,0.2)]",
        };
      default:
        return {
          active: "bg-amber-500 text-black border-amber-500",
          inactive: "text-slate-400 border-slate-700 bg-black/40",
          hover: "hover:border-amber-500/50 hover:text-amber-500/80 hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]",
        };
    }
  };

  const colors = getThemeColors();

  const categories: Array<{ id: NewsCategory; label: string }> = [
    { id: "all", label: "All" },
    { id: "announcements", label: "Announcements" },
    { id: "events", label: "Events" },
    { id: "reviews", label: "Reviews" },
    { id: "behind-the-scenes", label: "Behind the Scenes" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((category, index) => {
          const isActive = activeCategory === category.id;

          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: 0.25 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-250 ${
                isActive
                  ? colors.active
                  : `${colors.inactive} ${colors.hover} backdrop-blur-sm`
              }`}
            >
              {category.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
