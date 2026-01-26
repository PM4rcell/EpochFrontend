import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function StatCard({ icon: Icon, label, value, description, theme = "default" }: StatCardProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          iconColor: "text-amber-500",
          iconGlow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]",
          border: "border-slate-800/50",
          hoverBorder: "hover:border-amber-500/30",
          hoverGlow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        };
      case "2000s":
        return {
          iconColor: "text-blue-400",
          iconGlow: "drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]",
          border: "border-slate-800/50",
          hoverBorder: "hover:border-blue-400/30",
          hoverGlow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.1)]",
        };
      case "modern":
        return {
          iconColor: "text-slate-400",
          iconGlow: "drop-shadow-[0_0_8px_rgba(226,232,240,0.3)]",
          border: "border-slate-800/50",
          hoverBorder: "hover:border-slate-400/30",
          hoverGlow: "hover:shadow-[0_0_20px_rgba(226,232,240,0.1)]",
        };
      default:
        return {
          iconColor: "text-amber-500",
          iconGlow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]",
          border: "border-slate-800/50",
          hoverBorder: "hover:border-amber-500/30",
          hoverGlow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-linear-to-br from-slate-900/60 to-black/60 backdrop-blur-sm border ${colors.border} ${colors.hoverBorder} ${colors.hoverGlow} transition-all duration-300 cursor-pointer`}
    >
      {/* Icon */}
      <div className="mb-4">
        <Icon className={`w-8 h-8 ${colors.iconColor} ${colors.iconGlow}`} />
      </div>

      {/* Label */}
      <p className="text-slate-400 mb-2">{label}</p>

      {/* Value */}
      <div className="mb-1">
        <span className="text-white">{value}</span>
      </div>

      {/* Description */}
      <p className="text-slate-500">{description}</p>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
}
