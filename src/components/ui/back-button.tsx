import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onBack: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
  label?: string;
}

export function BackButton({ onBack, theme = "default", label = "Back" }: BackButtonProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          text: "text-amber-500",
          hover: "hover:text-amber-400",
          bg: "hover:bg-amber-600/10",
          glow: "hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]",
        };
      case "2000s":
        return {
          text: "text-blue-400",
          hover: "hover:text-blue-300",
          bg: "hover:bg-blue-500/10",
          glow: "hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]",
        };
      case "modern":
        return {
          text: "text-slate-300",
          hover: "hover:text-white",
          bg: "hover:bg-slate-300/10",
          glow: "hover:drop-shadow-[0_0_8px_rgba(226,232,240,0.4)]",
        };
      default:
        return {
          text: "text-amber-500",
          hover: "hover:text-amber-400",
          bg: "hover:bg-amber-600/10",
          glow: "hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.button
      onClick={onBack}
      whileHover={{ scale: 1.05, x: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg
        ${colors.text} ${colors.hover} ${colors.bg} ${colors.glow}
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-slate-400/50
      `}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}
