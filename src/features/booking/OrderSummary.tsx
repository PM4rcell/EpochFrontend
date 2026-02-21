import { motion } from "motion/react";
import { Calendar, Clock, Film, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";

interface SeatInfo {
  id?: number;
  row: string;
  number: number;
  price: number;
}

interface OrderSummaryProps {
  posterUrl: string;
  movieTitle: string;
  date: string;
  time: string;
  format: string;
  screeningType?: string;
  ticketType?: string;
  venue?: string;
  seats: SeatInfo[];
  total?: number;
  onBack?: () => void;
  onPay: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
  isProcessing?: boolean;
}

export function OrderSummary({
  posterUrl,
  movieTitle,
  date,
  time,
  format,
  screeningType,
  ticketType,
  venue,
  seats,
  total,
  onBack,
  onPay,
  theme = "default",
  isProcessing = false,
}: OrderSummaryProps) {
  const getThemeColors = () => {
    return {
      button: "bg-[var(--theme-button-bg)] hover:bg-[var(--theme-button-hover)] text-black",
      glow: "hover:shadow-[0_8px_24px_var(--theme-glow)]",
      accent: "text-[var(--theme-accent)]",
      border: "border-[color:var(--theme-border)]",
    };
  };

  const colors = getThemeColors();
  const screeningLabel = screeningType ?? format;
  const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
  const finalTotal = typeof total === "number" ? total : subtotal;

  return (
    <motion.div
      data-theme={theme}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-black/40 border border-slate-700/50 rounded-lg p-6 space-y-6 h-fit lg:sticky lg:top-28 overflow-hidden"
    >
      <h3 className="text-white">Order Summary</h3>

      {/* Movie info */}
      <div className="flex gap-4">
        <div className="w-20 h-28 rounded-lg overflow-hidden border border-slate-700/30 shrink-0">
          <ImageWithFallback
            src={posterUrl}
            alt={movieTitle}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-white mb-2">{movieTitle}</h4>
          {venue && <p className="text-slate-400 text-sm mb-2">{venue}</p>}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar className="w-3 h-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Format */}
      <div className={`inline-flex items-center px-3 py-1.5 rounded-md border ${colors.border} bg-black/40`}>
        <Film className="w-4 h-4 mr-2" />
        <span className="text-slate-400 mr-2">Format:</span>
        <span className={colors.accent}>{screeningLabel}</span>
      </div>

      {/* Seats */}
      <div className="space-y-2 border-t border-slate-700/50 pt-4">
        <p className="text-slate-400 text-sm mb-3">Selected Seats ({ticketType ?? "Standard"} ticket)</p>
        {seats.map((seat) => (
          <div
            key={seat.id ?? `${seat.row}-${seat.number}`}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-slate-400">
              Row {seat.row}, Seat {seat.number} 
            </span>
            <span className="text-slate-300">${seat.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Pricing breakdown */}
      <div className="space-y-2 border-t border-slate-700/50 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Seats total</span>
          <span className="text-slate-300">${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
        <span className="text-white">Total</span>
        <span className={`text-2xl ${colors.accent}`}>
          ${finalTotal.toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <Button
          onClick={onPay}
          disabled={isProcessing}
          className={`
            w-full ${colors.button} ${colors.glow}
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
              />
              Processing...
            </span>
          ) : (
            "Pay Now"
          )}
        </Button>
        {onBack && (
          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full text-slate-400 hover:text-slate-300 hover:bg-slate-700/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Seats
          </Button>
        )}
      </div>
    </motion.div>
  );
}
