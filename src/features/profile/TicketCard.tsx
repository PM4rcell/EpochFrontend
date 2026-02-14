import { motion } from "motion/react";
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
  ticketType?: string | null;
  bookingStatus?: string | null;
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
  ticketType = null,
  bookingStatus = null,
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
      <div className="grid md:grid-cols-[1fr_200px] md:grid-rows-[auto_auto] p-6">
        {/* Left: Details (top-left) */}
        <div className="space-y-6 md:col-start-1 md:row-start-1">
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

          {/* Actions removed: no download/wallet/print buttons */}
        </div>

        {/* Barcode (bottom-left) */}
        <div className="pt-4 border-t border-slate-700/50 md:col-start-1 md:row-start-2">
          <div className="flex items-start">
            <div className="flex flex-col items-start">
              <p className="text-slate-500 text-sm mb-2">Barcode</p>
              <div className="bg-white p-3 rounded inline-flex items-center">
                <div className="flex gap-0.5 mr-3">
                  {String(barcode).split("").map((digit, index) => (
                    <div
                      key={index}
                      className="bg-black"
                      style={{
                        width: Number.isNaN(parseInt(digit, 10)) ? 2 : (parseInt(digit, 10) % 2 === 0 ? 3 : 2),
                        height: "48px",
                      }}
                    />
                  ))}
                </div>
                <span className="text-black text-xs font-mono">{barcode}</span>
              </div>
            </div>
            {/* On small screens show ticket info next to barcode */}
            <div className="ml-4 md:hidden">
              <p className="text-slate-500 text-xs">Ticket type:</p>
              <span className={`text-sm ${colors.accent} font-medium`}>{ticketType ?? ""}</span>
              <p className="text-slate-500 text-xs mt-2">Status</p>
              <span className={`text-sm ${colors.accent} font-medium`}>{bookingStatus ?? ""}</span>
            </div>
          </div>
        </div>

        {/* Right: ticket info (bottom-right) */}
        <div className="hidden md:flex md:col-start-2 md:row-start-2 md:items-start md:justify-end">
          <div className="flex flex-col items-end text-right mr-14 mt-5">
            <p className="text-slate-500 text-xs">Ticket type:</p>
            <span className={`text-sm ${colors.accent} font-medium`}>{ticketType ?? ""}</span>
            <p className="text-slate-500 text-xs mt-2">Status:</p>
            <span className={`text-sm ${colors.accent} font-medium`}>{bookingStatus ?? ""}</span>
          </div>
        </div>

        {/* Right: Poster (top-right) */}
        <div className="hidden md:block md:col-start-2 md:row-start-1">
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
