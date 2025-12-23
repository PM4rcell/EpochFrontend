import { motion } from "motion/react";
import { Badge } from "../../components/ui/badge";
import { useEra } from "../../context/EraContext";

interface EventItemProps {
  event: {
    id: string;
    title: string;
    date: string;
  };
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function EventItem({ event, theme }: EventItemProps) {
  const { era } = useEra();
  const appliedTheme = theme ?? (era ?? "default");

  const getThemeColors = () => {
    switch (appliedTheme) {
      case "90s":
        return {
          badge: "border-amber-500/50 text-amber-400 bg-amber-500/10",
          hover: "hover:text-amber-400",
        };
      case "2000s":
        return {
          badge: "border-blue-400/50 text-blue-300 bg-blue-400/10",
          hover: "hover:text-blue-300",
        };
      case "modern":
        return {
          badge: "border-slate-400/50 text-slate-300 bg-slate-400/10",
          hover: "hover:text-slate-200",
        };
      default:
        return {
          badge: "border-amber-500/50 text-amber-400 bg-amber-500/10",
          hover: "hover:text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className="group cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <Badge
          variant="outline"
          className={`${colors.badge} backdrop-blur-sm shrink-0 mt-0.5`}
        >
          {event.date}
        </Badge>
        <p className={`text-slate-300 ${colors.hover} transition-colors duration-250 flex-1`}>
          {event.title}
        </p>
      </div>
    </motion.div>
  );
}
