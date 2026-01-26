import { motion } from "motion/react";
import { Ticket, Bookmark, Star } from "lucide-react";

interface RecentActivityCardProps {
  activity: {
    type: "booking" | "watchlist" | "review";
    title: string;
    movie: string;
    date: string;
  };
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function RecentActivityCard({ activity, theme = "default" }: RecentActivityCardProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          iconColor: "text-amber-500",
          border: "border-slate-800/50",
          hoverBorder: "hover:border-amber-500/20",
          hoverGlow: "hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]",
        };
      case "2000s":
        return {
          iconColor: "text-blue-400",
          border: "border-slate-800/50",
          hoverBorder: "hover:border-blue-400/20",
          hoverGlow: "hover:shadow-[0_0_15px_rgba(96,165,250,0.1)]",
        };
      case "modern":
        return {
          iconColor: "text-slate-400",
          border: "border-slate-800/50",
          hoverBorder: "hover:border-slate-400/20",
          hoverGlow: "hover:shadow-[0_0_15px_rgba(226,232,240,0.1)]",
        };
      default:
        return {
          iconColor: "text-amber-500",
          border: "border-slate-800/50",
          hoverBorder: "hover:border-amber-500/20",
          hoverGlow: "hover:shadow-[0_0_15px_rgba(245,158,11,0.1)]",
        };
    }
  };

  const colors = getThemeColors();

  const getIcon = () => {
    switch (activity.type) {
      case "booking":
        return Ticket;
      case "watchlist":
        return Bookmark;
      case "review":
        return Star;
      default:
        return Ticket;
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-4 p-4 rounded-xl bg-linear-to-r from-slate-900/40 to-black/40 backdrop-blur-sm border ${colors.border} ${colors.hoverBorder} ${colors.hoverGlow} transition-all duration-250 cursor-pointer`}
    >
      {/* Icon */}
      <div className={`shrink-0 w-10 h-10 rounded-full bg-slate-900/60 flex items-center justify-center border ${colors.border}`}>
        <Icon className={`w-5 h-5 ${colors.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-slate-300 truncate">{activity.title}</p>
        <p className="text-slate-500 truncate">{activity.movie}</p>
      </div>

      {/* Date */}
      <div className="text-slate-500 text-sm shrink-0">{activity.date}</div>
    </motion.div>
  );
}
