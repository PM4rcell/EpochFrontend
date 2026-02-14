import { motion } from "motion/react";
import { Calendar } from "lucide-react";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";


interface TicketCardProps {
  movieTitle: string;
  posterUrl: string;
  row: string;
  seat: number;
  date: string;
  time: string;
  format: string;
  venue?: string;
  barcode?: string;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function TicketCard({
  movieTitle,
  posterUrl,
  row,
  seat,
  date,
  time,
  format,
  venue,
  barcode = "1234567890",
  theme = "default",
}: TicketCardProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          border: "border-amber-600/30",
          glow: "hover:shadow-[0_4px_16px_rgba(245,158,11,0.3)]",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          border: "border-blue-500/30",
          glow: "hover:shadow-[0_4px_16px_rgba(96,165,250,0.3)]",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          border: "border-slate-400/30",
          glow: "hover:shadow-[0_4px_16px_rgba(226,232,240,0.3)]",
        };
      default:
        return {
          accent: "text-amber-500",
          border: "border-amber-600/30",
          glow: "hover:shadow-[0_4px_16px_rgba(245,158,11,0.3)]",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        bg-black/40 border rounded-lg overflow-hidden
        ${colors.border} ${colors.glow}
        transition-all duration-200
      `}
    >
      <div className="grid md:grid-cols-[1fr_200px] gap-6 p-6">
        {/* Left: Details and Barcode */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-white mb-1">{movieTitle}</h3>
            {venue && <p className="text-slate-400 text-sm">{venue}</p>}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-slate-500 text-sm mb-1">Date</p>
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${colors.accent}`} />
                <p className="text-slate-200">{date}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Time</p>
              <div className="flex items-center gap-2">
                <p className="text-slate-200">{time}</p>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Seat</p>
              <p className={`${colors.accent}`}>
                Row {row}, Seat {seat}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-sm mb-1">Format</p>
              <p className="text-slate-200">{format}</p>
            </div>
          </div>

          {/* Barcode */}
          <div className="pt-4 border-t border-slate-700/50">
            <p className="text-slate-500 text-sm mb-3">Barcode</p>
            <div className="bg-white p-4 rounded inline-flex flex-col items-center">
              {/* Simple barcode representation */}
              <div className="flex gap-0.5 mb-2">
                {barcode.split("").map((digit, index) => (
                  <div
                    key={index}
                    className="bg-black"
                    style={{
                      width: parseInt(digit) % 2 === 0 ? "3px" : "2px",
                      height: "60px",
                    }}
                  />
                ))}
              </div>
              <span className="text-black text-xs font-mono">{barcode}</span>
            </div>
          </div>

          {/* Actions removed: no download/wallet/print buttons */}
        </div>

        {/* Right: Poster */}
        <div className="hidden md:block">
          <div className="aspect-2/3 rounded-lg overflow-hidden border border-slate-700/30">
            <ImageWithFallback
              src={posterUrl}
              alt={movieTitle}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
