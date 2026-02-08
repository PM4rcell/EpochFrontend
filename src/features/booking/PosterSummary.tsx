import { motion } from "motion/react";
import { X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";

interface SelectedSeat {
  row: string;
  number: number;
  price: number;
}

interface PosterSummaryProps {
  posterUrl: string;
  movieTitle: string;
  selectedSeats: SelectedSeat[];
  onRemoveSeat: (row: string, number: number) => void;
  onCancel: () => void;
  onNext: () => void;
  canProceed?: boolean;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function PosterSummary({
  posterUrl,
  movieTitle,
  selectedSeats,
  onRemoveSeat,
  onCancel,
  onNext,
  canProceed = true,
  theme = "default",
}: PosterSummaryProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          button: "bg-amber-600 hover:bg-amber-500 text-black",
          glow: "hover:shadow-[0_8px_24px_rgba(245,158,11,0.5)]",
          accent: "text-amber-500",
        };
      case "2000s":
        return {
          button: "bg-blue-500 hover:bg-blue-400 text-black",
          glow: "hover:shadow-[0_8px_24px_rgba(96,165,250,0.5)]",
          accent: "text-blue-400",
        };
      case "modern":
        return {
          button: "bg-slate-300 hover:bg-slate-200 text-black",
          glow: "hover:shadow-[0_8px_24px_rgba(226,232,240,0.5)]",
          accent: "text-slate-300",
        };
      default:
        return {
          button: "bg-amber-600 hover:bg-amber-500 text-black",
          glow: "hover:shadow-[0_8px_24px_rgba(245,158,11,0.5)]",
          accent: "text-amber-500",
        };
    }
  };

  const colors = getThemeColors();
  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const hasSeats = selectedSeats.length > 0;

  return (
    <div className="bg-black/40 border border-slate-700/50 rounded-lg p-6 space-y-6 h-fit lg:sticky lg:top-28 overflow-hidden">
      {/* Poster */}
      <div className="aspect-2/3 rounded-lg overflow-hidden border border-slate-700/30">
        <ImageWithFallback
          src={posterUrl}
          alt={movieTitle}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Selected seats */}
      <div className="space-y-3">
        <h3 className="text-white text-sm">Selected Seats</h3>
        
        {!hasSeats ? (
          <p className="text-slate-500 text-sm py-4">No seats selected</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedSeats.map((seat) => (
              <motion.div
                key={`${seat.row}${seat.number}`}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between bg-slate-900/50 border border-slate-700/30 rounded px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Row {seat.row}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400 text-sm">Seat {seat.number}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-300 text-sm">${seat.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemoveSeat(seat.row, seat.number)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={`Remove seat ${seat.row}${seat.number}`}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <span className="text-slate-400">Total</span>
          <span className={`text-2xl ${colors.accent}`}>
            ${total.toFixed(2)}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onNext}
            disabled={!hasSeats || (typeof canProceed !== "undefined" && !canProceed)}
            className={`
              w-full ${colors.button} ${colors.glow}
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            Next
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full border-slate-700 text-slate-300 hover:bg-slate-700/20"
          >
            Cancel
          </Button>
          {!canProceed && (
            <p className="text-red-500 text-sm mt-2">Please log in to book a ticket</p>
          )}
        </div>
      </div>
    </div>
  );
}
