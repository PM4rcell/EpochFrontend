import { motion } from "motion/react";
import { Calendar, Clock, Film } from "lucide-react";
import dayjs from "dayjs";

interface ShowInfoProps {
  date: string;
  time: string;
  screeningType?: string;
  venue?: string;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function ShowInfo({ date, time, screeningType, venue, theme = "default" }: ShowInfoProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          border: "border-amber-600/20",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          border: "border-blue-500/20",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          border: "border-slate-400/20",
        };
      default:
        return {
          accent: "text-amber-500",
          border: "border-amber-600/20",
        };
    }
  };

  const colors = getThemeColors();

  // Prefer screeningType when provided (this comes from screening.screening_type.name)
  const screeningLabel = screeningType;

  const formattedTime = time ? dayjs(time).format("HH:mm") : "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-black/40 border border-slate-700/50 rounded-lg p-6 space-y-4 h-fit lg:sticky lg:top-28 overflow-hidden"
    >
      <h3 className="text-white mb-6">Show Information</h3>

      {/* Date */}
      <div className="flex items-start gap-3">
        <Calendar className={`w-5 h-5 ${colors.accent} mt-0.5`} />
        <div>
          <p className="text-slate-500 text-sm mb-1">Date</p>
          <p className="text-slate-200">{date}</p>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-start gap-3">
        <Clock className={`w-5 h-5 ${colors.accent} mt-0.5`} />
        <div>
          <p className="text-slate-500 text-sm mb-1">Time</p>
          <p className="text-slate-200">{formattedTime}</p>
        </div>
      </div>

      {/* Format / Screening Type */}
      <div className="flex items-start gap-3">
        <Film className={`w-5 h-5 ${colors.accent} mt-0.5`} />
        <div>
          <p className="text-slate-500 text-sm mb-1">Format</p>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-md border ${colors.border} bg-black/40`}>
            <span className={colors.accent}>{screeningLabel}</span>
          </div>
        </div>
      </div>

      {/* Venue (if provided) */}
      {venue && (
        <div className="pt-4 border-t border-slate-700/50">
          <p className="text-slate-500 text-sm mb-1">Venue</p>
          <p className="text-slate-200">{venue}</p>
        </div>
      )}
    </motion.div>
  );
}
