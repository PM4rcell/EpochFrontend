import { motion } from "motion/react";
import { Calendar, Clock, Film } from "lucide-react";

interface ShowInfoProps {
  date: string;
  time: string;
  era?: string;
  venue?: string;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function ShowInfo({ date, time, era, venue, theme = "default" }: ShowInfoProps) {
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

  const normalizeEraLabel = (raw?: string | null) => {
    if (!raw) return "";
    const s = String(raw).toLowerCase();
    if (s.includes("90s")) return "90s";
    if (s.includes("20s") || s.includes("00s") || s.includes("00s")) return "2000s";
    if (s.includes("nowdays")) return "modern";
    // fallback: if it already looks like a short era label
    if (s === "90s" || s === "2000s" || s === "modern") return raw as string;
    return raw;
  };

  const eraLabel = normalizeEraLabel(era);

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
          <p className="text-slate-200">{time}</p>
        </div>
      </div>

      {/* Era */}
      <div className="flex items-start gap-3">
        <Film className={`w-5 h-5 ${colors.accent} mt-0.5`} />
        <div>
          <p className="text-slate-500 text-sm mb-1">Era</p>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-md border ${colors.border} bg-black/40`}>
            <span className={colors.accent}>{eraLabel}</span>
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
