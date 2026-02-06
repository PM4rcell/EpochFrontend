import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface TimePillProps {
  time: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isSoldOut?: boolean;
  onClick?: () => void;
  screeningId?: string | number | null;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function TimePill({
  time,
  isActive = false,
  isDisabled = false,
  isSoldOut = false,
  onClick,
  screeningId = null,
  theme = "default",
}: TimePillProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          active: "bg-amber-600 text-black",
          hover: "hover:bg-amber-600/20 hover:border-amber-500",
          glow: "shadow-[0_0_12px_rgba(245,158,11,0.4)]",
        };
      case "2000s":
        return {
          active: "bg-blue-500 text-black",
          hover: "hover:bg-blue-500/20 hover:border-blue-400",
          glow: "shadow-[0_0_12px_rgba(96,165,250,0.4)]",
        };
      case "modern":
        return {
          active: "bg-slate-300 text-black",
          hover: "hover:bg-slate-300/20 hover:border-slate-400",
          glow: "shadow-[0_0_12px_rgba(226,232,240,0.4)]",
        };
      default:
        return {
          active: "bg-amber-600 text-black",
          hover: "hover:bg-amber-600/20 hover:border-amber-500",
          glow: "shadow-[0_0_12px_rgba(245,158,11,0.4)]",
        };
    }
  };

  const colors = getThemeColors();
  const disabled = isDisabled || isSoldOut;

  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    try {
      onClick?.();
    } catch {}
    if (screeningId) {
      navigate(`/booking/${screeningId}`);
    }
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={handleClick}
      className={`
        relative min-w-22 h-10 px-4 rounded-lg
        border transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-slate-400/50
        ${
          isActive
            ? `${colors.active} ${colors.glow} border-transparent`
            : disabled
            ? "bg-black/20 border-slate-700/30 text-slate-600 cursor-not-allowed"
            : `bg-black/40 border-slate-700/50 text-slate-300 ${colors.hover}`
        }
      `}
      disabled={disabled}
    >
      {/* Sold out hatch overlay */}
      {isSoldOut && (
        <div
          className="absolute inset-0 rounded-lg opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 4px, currentColor 4px, currentColor 5px)",
          }}
        />
      )}
      
      <span className="relative z-10">{time}</span>
      
      {/* Inner glow on active */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-lg bg-linear-to-b from-white/10 to-transparent pointer-events-none"
        />
      )}
    </motion.button>
  );
}
