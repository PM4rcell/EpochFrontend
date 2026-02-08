import { motion } from "motion/react";

interface SpinnerProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  size?: "sm" | "md" | "lg";
}

const themeConfig = {
  "90s": {
    primary: "border-amber-500",
    secondary: "border-amber-500/30",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.4)]",
    accent: "bg-amber-500",
  },
  "2000s": {
    primary: "border-blue-400",
    secondary: "border-blue-400/30",
    glow: "shadow-[0_0_30px_rgba(96,165,250,0.4)]",
    accent: "bg-blue-400",
  },
  modern: {
    primary: "border-slate-300",
    secondary: "border-slate-600/30",
    glow: "shadow-[0_0_30px_rgba(203,213,225,0.3)]",
    accent: "bg-slate-300",
  },
};

const sizeConfig = {
  sm: {
    outer: "w-8 h-8",
    border: "border-2",
    inner: "w-4 h-4",
  },
  md: {
    outer: "w-12 h-12",
    border: "border-[3px]",
    inner: "w-6 h-6",
  },
  lg: {
    outer: "w-16 h-16",
    border: "border-4",
    inner: "w-8 h-8",
  },
};

export function Spinner({ theme = "modern", size = "md" }: SpinnerProps) {
  // Guard against unknown/unsupported theme keys (for example "default")
  // by falling back to the `modern` theme. This prevents runtime errors
  // when other components pass a broader set of theme identifiers.
  const colors = themeConfig[theme as keyof typeof themeConfig] ?? themeConfig.modern;
  const sizing = sizeConfig[size];

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rotating ring */}
      <motion.div
        className={`
          ${sizing.outer} ${sizing.border} ${colors.primary}
          rounded-full border-t-transparent ${colors.glow}
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Middle counter-rotating ring */}
      <motion.div
        className={`
          absolute ${sizing.outer} ${sizing.border} ${colors.secondary}
          rounded-full border-b-transparent
        `}
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner pulsing dot */}
      <motion.div
        className={`absolute ${sizing.inner} ${colors.accent} rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Loading overlay component for full-screen loading states
export function LoadingOverlay({ theme = "modern" }: { theme?: "90s" | "2000s" | "modern" | "default" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner theme={theme} size="lg" />
        <motion.p
          className="text-slate-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}
