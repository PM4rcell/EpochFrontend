import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Armchair, Film } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";

interface NextShowCardProps {
  show: {
    title: string;
    poster: string;
    date: string;
    time: string;
    theater: string;
    seats: string;
    format: string;
  };
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
}

export function NextShowCard({ show, theme = "default", onNavigate }: NextShowCardProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          border: "border-amber-500/20",
          buttonBg: "bg-amber-500/10",
          buttonBorder: "border-amber-500/50",
          buttonText: "text-amber-400",
          buttonHover: "hover:bg-amber-500/20 hover:border-amber-500/70",
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
          formatBg: "bg-amber-500/20",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          border: "border-blue-400/20",
          buttonBg: "bg-blue-400/10",
          buttonBorder: "border-blue-400/50",
          buttonText: "text-blue-300",
          buttonHover: "hover:bg-blue-400/20 hover:border-blue-400/70",
          glow: "shadow-[0_0_30px_rgba(96,165,250,0.15)]",
          formatBg: "bg-blue-400/20",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          border: "border-slate-400/20",
          buttonBg: "bg-slate-400/10",
          buttonBorder: "border-slate-400/50",
          buttonText: "text-slate-300",
          buttonHover: "hover:bg-slate-400/20 hover:border-slate-400/70",
          glow: "shadow-[0_0_30px_rgba(226,232,240,0.15)]",
          formatBg: "bg-slate-400/20",
        };
      default:
        return {
          accent: "text-amber-500",
          border: "border-amber-500/20",
          buttonBg: "bg-amber-500/10",
          buttonBorder: "border-amber-500/50",
          buttonText: "text-amber-400",
          buttonHover: "hover:bg-amber-500/20 hover:border-amber-500/70",
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
          formatBg: "bg-amber-500/20",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-900/80 to-black/80 backdrop-blur-sm border ${colors.border} ${colors.glow} p-6`}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Poster */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="relative w-24 sm:w-32 h-36 sm:h-48 rounded-lg overflow-hidden shrink-0 group cursor-pointer"
        >
          <ImageWithFallback
            src={show.poster}
            alt={show.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-white mb-2">{show.title}</h3>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${colors.formatBg} ${colors.accent} backdrop-blur-sm`}>
                <Film className="w-3.5 h-3.5" />
                <span className="text-xs">{show.format}</span>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onNavigate?.("booking-tickets")}
                variant="outline"
                size="sm"
                className={`${colors.buttonBg} ${colors.buttonBorder} ${colors.buttonText} backdrop-blur-sm ${colors.buttonHover} transition-all duration-250`}
              >
                View Tickets
              </Button>
            </motion.div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>{show.date}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{show.time}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{show.theater}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Armchair className="w-4 h-4" />
              <span>Seats {show.seats}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
    </motion.div>
  );
}
