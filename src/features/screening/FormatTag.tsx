import { motion } from "motion/react";

interface FormatTagProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function FormatTag({
  label,
  isActive = false,
  onClick,
  theme = "default",
}: FormatTagProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          active: "bg-amber-600 text-black border-amber-600",
          inactive: "bg-transparent text-slate-300 border-slate-700/50",
          hover: "hover:border-amber-500/50 hover:text-amber-400",
        };
      case "2000s":
        return {
          active: "bg-blue-500 text-black border-blue-500",
          inactive: "bg-transparent text-slate-300 border-slate-700/50",
          hover: "hover:border-blue-400/50 hover:text-blue-300",
        };
      case "modern":
        return {
          active: "bg-slate-300 text-black border-slate-300",
          inactive: "bg-transparent text-slate-300 border-slate-700/50",
          hover: "hover:border-slate-400/50 hover:text-white",
        };
      default:
        return {
          active: "bg-amber-600 text-black border-amber-600",
          inactive: "bg-transparent text-slate-300 border-slate-700/50",
          hover: "hover:border-amber-500/50 hover:text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-md border text-sm
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-slate-400/50
        ${isActive ? colors.active : `${colors.inactive} ${colors.hover}`}
      `}
    >
      {label}
    </motion.button>
  );
}
