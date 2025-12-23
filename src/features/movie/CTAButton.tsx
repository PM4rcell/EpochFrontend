import { motion } from "motion/react";
import { Calendar } from "lucide-react";

interface CTAButtonProps {
  label?: string;
  onClick: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
  icon?: boolean;
}

export function CTAButton({ 
  label = "View schedules", 
  onClick, 
  theme = "default",
  icon = true 
}: CTAButtonProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          bg: "bg-amber-600 hover:bg-amber-500",
          glow: "hover:shadow-[0_8px_32px_rgba(245,158,11,0.5)]",
        };
      case "2000s":
        return {
          bg: "bg-blue-500 hover:bg-blue-400",
          glow: "hover:shadow-[0_8px_32px_rgba(96,165,250,0.5)]",
        };
      case "modern":
        return {
          bg: "bg-slate-300 hover:bg-slate-200",
          glow: "hover:shadow-[0_8px_32px_rgba(226,232,240,0.5)]",
        };
      default:
        return {
          bg: "bg-amber-600 hover:bg-amber-500",
          glow: "hover:shadow-[0_8px_32px_rgba(245,158,11,0.5)]",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 rounded-lg
        ${colors.bg} ${colors.glow}
        text-black
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-slate-400/50
      `}
    >
      {icon && <Calendar className="w-5 h-5" />}
      <span>{label}</span>
    </motion.button>
  );
}
