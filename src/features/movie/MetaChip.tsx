import { motion } from "motion/react";

interface MetaChipProps {
  label: string;
  variant?: "default" | "quality" | "rating";
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function MetaChip({ label, variant = "default", theme = "default" }: MetaChipProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "border-amber-600 text-amber-500",
          bg: "bg-amber-600/10",
        };
      case "2000s":
        return {
          accent: "border-blue-500 text-blue-400",
          bg: "bg-blue-500/10",
        };
      case "modern":
        return {
          accent: "border-slate-400 text-slate-300",
          bg: "bg-slate-400/10",
        };
      default:
        return {
          accent: "border-amber-600 text-amber-500",
          bg: "bg-amber-600/10",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.15 }}
      className={`
        inline-flex items-center px-3 py-1.5 rounded-md border text-sm
        transition-all duration-200
        ${variant === "quality" || variant === "rating" 
          ? `${colors.accent} ${colors.bg}` 
          : "border-slate-700/50 text-slate-400 bg-black/40"
        }
      `}
    >
      {label}
    </motion.div>
  );
}
