import { motion } from "motion/react";
import { Seat } from "./Seat";

interface SeatData {
  id?: number;
  row: string;
  number: number;
  status: "available" | "selected" | "unavailable";
}

interface SeatMapProps {
  seats: SeatData[];
  onSeatClick: (row: string, number: number) => void;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function SeatMap({ seats, onSeatClick, theme = "default" }: SeatMapProps) {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, SeatData[]>);

  const rows = Object.keys(seatsByRow).sort();

  // Get theme colors
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          primary: "from-amber-600 to-amber-500",
          glow: "rgba(245, 158, 11, 0.3)",
          screen: "from-amber-500/20 via-amber-600/10 to-transparent",
          accent: "border-amber-500/50",
          rowText: "text-amber-400",
        };
      case "2000s":
        return {
          primary: "from-blue-500 to-blue-600",
          glow: "rgba(59, 130, 246, 0.3)",
          screen: "from-blue-500/20 via-blue-600/10 to-transparent",
          accent: "border-blue-500/50",
          rowText: "text-blue-300",
        };
      case "modern":
        return {
          primary: "from-slate-300 to-slate-400",
          glow: "rgba(203, 213, 225, 0.3)",
          screen: "from-slate-400/20 via-slate-500/10 to-transparent",
          accent: "border-slate-400/50",
          rowText: "text-slate-300",
        };
      default:
        return {
          primary: "from-amber-600 to-amber-500",
          glow: "rgba(245, 158, 11, 0.3)",
          screen: "from-amber-500/20 via-amber-600/10 to-transparent",
          accent: "border-amber-500/50",
          rowText: "text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Cinema Screen */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
        className="mb-12 relative"
      >
        {/* Screen label */}
        <div className="text-center mb-3">
          <span className="text-xs tracking-[0.3em] text-slate-500 uppercase font-light">
            Screen
          </span>
        </div>

        {/* Screen with perspective effect */}
        <div className="relative h-2 mx-8 mb-2">
          <div
            className={`absolute inset-0 bg-linear-to-b ${colors.screen} rounded-t-lg backdrop-blur-sm`}
            style={{
              transform: "perspective(400px) rotateX(45deg)",
              transformOrigin: "top center",
              boxShadow: `0 4px 24px ${colors.glow}`,
            }}
          />
        </div>

        {/* Curved screen base */}
        <div
          className={`h-1.5 bg-linear-to-r ${colors.primary} rounded-full opacity-90`}
          style={{
            boxShadow: `0 0 20px ${colors.glow}, 0 0 40px ${colors.glow}`,
            clipPath: "ellipse(50% 100% at 50% 0%)",
          }}
        />

        {/* Ambient glow under screen */}
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 w-full h-32 opacity-20 blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center top, ${colors.glow}, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* Seat Grid Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="relative"
        style={{
          perspective: "1200px",
        }}
      >
        {/* Theater rows with subtle perspective */}
        <div
          className="space-y-3"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {rows.map((row, rowIndex) => {
            // Calculate scale for perspective effect (front rows slightly smaller)
            const scale = 1 + rowIndex * 0.015;
            const opacity = 0.85 + rowIndex * 0.02;

            return (
              <motion.div
                key={row}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.15 + rowIndex * 0.03,
                  ease: [0.65, 0, 0.35, 1],
                }}
                className="flex items-center justify-center gap-3"
                style={{
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                {/* Left row label */}
                  <motion.div
                  className="w-8 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    className={`text-sm font-light tracking-wider ${colors.rowText} border rounded px-2 py-0.5 bg-black/30 backdrop-blur-sm`}
                  >
                    {row}
                  </span>
                </motion.div>

                {/* Seats */}
                <div className="flex gap-2 items-center">
                  {seatsByRow[row].map((seat, index) => {
                    // Add aisle spacing after seat 4 and 8
                    const showAisle = index === 3 || index === 7;

                    return (
                      <div key={seat.id ?? `${seat.row}-${seat.number}`} className="flex items-center gap-2">
                        <Seat
                          row={seat.row}
                          number={seat.number}
                          status={seat.status}
                          onClick={() => onSeatClick(seat.row, seat.number)}
                          theme={theme}
                        />
                        {showAisle && (
                          <div className="w-6 h-10 flex items-center justify-center">
                            <div className="w-px h-6 bg-linear-to-b from-transparent via-slate-700/50 to-transparent" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Right row label */}
                <motion.div
                  className="w-8 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    className={`text-sm font-light tracking-wider ${colors.rowText} border rounded px-2 py-0.5 bg-black/30 backdrop-blur-sm`}
                  >
                    {row}
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Legend - Redesigned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.4 }}
        className="mt-16 pt-8 border-t border-slate-800/50"
      >
        <div className="flex flex-wrap items-center justify-center gap-8">
          {/* Available */}
          <motion.div
            className="flex items-center gap-3 group cursor-default"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 transition-all duration-300 group-hover:border-slate-600 group-hover:shadow-lg" />
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent rounded-lg pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-300 font-light">Available</span>
              <span className="text-xs text-slate-500">Ready to select</span>
            </div>
          </motion.div>

          {/* Selected */}
          <motion.div
            className="flex items-center gap-3 group cursor-default"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-lg bg-linear-to-br ${colors.primary} border ${colors.accent} transition-all duration-300`}
                style={{
                  boxShadow: `0 0 20px ${colors.glow}`,
                }}
              />
              <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent rounded-lg pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-300 font-light">Selected</span>
              <span className="text-xs text-slate-500">Your choice</span>
            </div>
          </motion.div>

          {/* Unavailable */}
          <motion.div
            className="flex items-center gap-3 group cursor-default"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 opacity-60 transition-all duration-300">
                <div
                  className="absolute inset-0 rounded-lg"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(148, 163, 184, 0.1) 3px, rgba(148, 163, 184, 0.1) 6px)",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-300 font-light">Unavailable</span>
              <span className="text-xs text-slate-500">Already taken</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
