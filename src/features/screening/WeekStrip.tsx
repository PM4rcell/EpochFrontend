import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DayData {
  day: string;
  date: number;
  month: string;
  isToday?: boolean;
}

interface WeekStripProps {
  days: DayData[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  isSticky?: boolean;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function WeekStrip({
  days,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  isSticky = false,
  theme = "default",
}: WeekStripProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          active: "bg-amber-600 text-black",
          hover: "hover:bg-amber-600/20 hover:border-amber-500",
          dot: "bg-amber-500",
          chevron: "text-amber-500 hover:text-amber-400",
        };
      case "2000s":
        return {
          active: "bg-blue-500 text-black",
          hover: "hover:bg-blue-500/20 hover:border-blue-400",
          dot: "bg-blue-400",
          chevron: "text-blue-400 hover:text-blue-300",
        };
      case "modern":
        return {
          active: "bg-slate-300 text-black",
          hover: "hover:bg-slate-300/20 hover:border-slate-400",
          dot: "bg-slate-300",
          chevron: "text-slate-300 hover:text-white",
        };
      default:
        return {
          active: "bg-amber-600 text-black",
          hover: "hover:bg-amber-600/20 hover:border-amber-500",
          dot: "bg-amber-500",
          chevron: "text-amber-500 hover:text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={isSticky ? { y: 0 } : { y: 0 }}
      transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
      className={`
        bg-black/80 backdrop-blur-md border-b border-slate-700/30
        ${isSticky ? "shadow-[0_8px_16px_rgba(0,0,0,0.4)]" : ""}
        transition-shadow duration-300
      `}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Previous week button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevWeek}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${colors.chevron} transition-colors duration-200`}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Days */}
          <div className="flex-1 grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dateKey = `${day.month}-${day.date}`;
              const isSelected = selectedDate === dateKey;

              return (
                <motion.button
                  key={dateKey}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectDate(dateKey)}
                  className={`
                    relative h-16 rounded-xl border flex flex-col items-center justify-center
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-slate-400/50
                    ${
                      isSelected
                        ? `${colors.active} border-transparent`
                        : `bg-black/40 border-slate-700/50 text-slate-300 ${colors.hover}`
                    }
                  `}
                >
                  <span className={`text-xs mb-1 ${isSelected ? "opacity-80" : "opacity-60"}`}>
                    {day.day}
                  </span>
                  <span className={isSelected ? "" : ""}>{day.date}</span>
                  
                  {/* Today indicator dot */}
                  {day.isToday && !isSelected && (
                    <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Next week button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextWeek}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${colors.chevron} transition-colors duration-200`}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Scanline overlay for 90s era */}
      {theme === "90s" && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
          }}
        />
      )}
    </motion.div>
  );
}
