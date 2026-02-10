import { motion } from "motion/react";

type SeatStatus = "available" | "selected" | "unavailable";

interface SeatProps {
  row: string;
  number: number;
  status: SeatStatus;
  onClick?: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function Seat({ row, number, status, onClick, theme = "default" }: SeatProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          selected: "from-amber-600 to-amber-500",
          selectedBorder: "border-amber-500",
          selectedGlow: "0 0 16px rgba(245, 158, 11, 0.6), 0 0 32px rgba(245, 158, 11, 0.3)",
          hoverGlow: "0 0 12px rgba(245, 158, 11, 0.4)",
        };
      case "2000s":
        return {
          selected: "from-blue-500 to-blue-600",
          selectedBorder: "border-blue-400",
          selectedGlow: "0 0 16px rgba(59, 130, 246, 0.6), 0 0 32px rgba(59, 130, 246, 0.3)",
          hoverGlow: "0 0 12px rgba(59, 130, 246, 0.4)",
        };
      case "modern":
        return {
          selected: "from-slate-300 to-slate-400",
          selectedBorder: "border-slate-200",
          selectedGlow: "0 0 16px rgba(203, 213, 225, 0.6), 0 0 32px rgba(203, 213, 225, 0.3)",
          hoverGlow: "0 0 12px rgba(203, 213, 225, 0.4)",
        };
      default:
        return {
          selected: "from-amber-600 to-amber-500",
          selectedBorder: "border-amber-500",
          selectedGlow: "0 0 16px rgba(245, 158, 11, 0.6), 0 0 32px rgba(245, 158, 11, 0.3)",
          hoverGlow: "0 0 12px rgba(245, 158, 11, 0.4)",
        };
    }
  };

  const colors = getThemeColors();
  const isClickable = status !== "unavailable";

  return (
    <motion.button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      className="relative group focus:outline-none"
      whileHover={isClickable ? { scale: 1.12, y: -2 } : {}}
      whileTap={isClickable ? { scale: 0.92 } : {}}
      transition={{
        duration: 0.25,
        ease: [0.65, 0, 0.35, 1],
      }}
      aria-label={`Seat ${row}${number}, ${status}`}
      role="checkbox"
      aria-checked={status === "selected"}
      tabIndex={isClickable ? 0 : -1}
    >
      {/* Seat base */}
      <div className="relative w-11 h-11">
        {/* Available seat */}
        {status === "available" && (
          <>
            <motion.div
              className="absolute inset-0 rounded-lg bg-slate-900 border border-slate-700 transition-all duration-300"
              style={{
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
              whileHover={{
                borderColor: "rgb(100, 116, 139)",
                boxShadow: colors.hoverGlow,
              }}
            />
            {/* Shine effect */}
            <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent rounded-lg pointer-events-none" />
            {/* Seat texture */}
            <div
              className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)",
              }}
            />
          </>
        )}

        {/* Selected seat */}
        {status === "selected" && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
              className={`absolute inset-0 rounded-lg bg-linear-to-br ${colors.selected} border-2 ${colors.selectedBorder}`}
              style={{
                boxShadow: colors.selectedGlow,
              }}
            />
            {/* Glossy shine */}
            <div className="absolute inset-0 bg-linear-to-br from-white/30 via-white/10 to-transparent rounded-lg pointer-events-none" />
            {/* Pulse effect */}
            <motion.div
              className={`absolute inset-0 rounded-lg bg-linear-to-br ${colors.selected}`}
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ filter: "blur(8px)" }}
            />
            {/* Checkmark icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.svg
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black drop-shadow-lg"
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            </div>
          </>
        )}

        {/* Unavailable seat */}
        {status === "unavailable" && (
          <>
            <div className="absolute inset-0 rounded-lg bg-slate-800 border border-slate-700/50 opacity-50">
              {/* Cross-hatch pattern */}
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(148, 163, 184, 0.15) 3px, rgba(148, 163, 184, 0.15) 6px)",
                }}
              />
            </div>
            {/* X mark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-600"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          </>
        )}

        {/* Seat number label - only shown on hover for available/selected */}
        {isClickable && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-light tracking-wide pointer-events-none whitespace-nowrap"
          >
            {row}{number}
          </motion.div>
        )}

        {/* Focus ring */}
        {isClickable && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-slate-400/0 group-focus:ring-slate-400/50 transition-all duration-200 pointer-events-none" />
        )}
      </div>
    </motion.button>
  );
}
