import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useEra } from "../../context/EraContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  theme?: "90s" | "2000s" | "modern";
}

const themeConfig = {
  "90s": {
    accentColor: "amber-500",
    glowColor: "amber-500/20",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    buttonBorder: "border-amber-500/30",
    buttonHover: "hover:border-amber-500/60 hover:bg-amber-500/10",
    textAccent: "text-amber-500",
    pageGlow: "shadow-[0_0_15px_rgba(251,191,36,0.25)]",
  },
  "2000s": {
    accentColor: "blue-400",
    glowColor: "blue-400/20",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]",
    buttonBorder: "border-blue-400/30",
    buttonHover: "hover:border-blue-400/60 hover:bg-blue-400/10",
    textAccent: "text-blue-400",
    pageGlow: "shadow-[0_0_15px_rgba(96,165,250,0.25)]",
  },
  "modern": {
    accentColor: "slate-300",
    glowColor: "slate-300/20",
    hoverGlow: "hover:shadow-[0_0_20px_rgba(203,213,225,0.2)]",
    buttonBorder: "border-slate-600/30",
    buttonHover: "hover:border-slate-400/60 hover:bg-slate-700/30",
    textAccent: "text-slate-300",
    pageGlow: "shadow-[0_0_15px_rgba(203,213,225,0.15)]",
  },
};

export function Pagination({ currentPage, totalPages, onPageChange, theme }: PaginationProps) {
  const eraCtx = useEra();
  const resolvedTheme = (theme ?? (eraCtx?.era as "90s" | "2000s" | "modern") ?? "modern") as "90s" | "2000s" | "modern";
  const config = themeConfig[resolvedTheme] ?? themeConfig["modern"];
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center gap-4 py-8"
    >
      {/* Previous Button */}
      <motion.div
        whileHover={!isFirstPage ? { scale: 1.05 } : {}}
        whileTap={!isFirstPage ? { scale: 0.95 } : {}}
      >
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          variant="ghost"
          size="icon"
          className={`
            bg-black/40 backdrop-blur-sm border ${config.buttonBorder}
            ${!isFirstPage ? config.buttonHover : "opacity-50 cursor-not-allowed"}
            ${!isFirstPage ? config.hoverGlow : ""}
            transition-all duration-300
          `}
        >
          <ChevronLeft className={`w-5 h-5 ${isFirstPage ? "text-slate-600" : config.textAccent}`} />
        </Button>
      </motion.div>

      {/* Current Page Indicator */}
      <motion.div
        className={`
          px-6 py-2 rounded-lg 
          bg-black/60 backdrop-blur-md border ${config.buttonBorder}
          ${config.pageGlow}
          transition-all duration-300
        `}
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-slate-400 mr-2">Page</span>
        <span className={`${config.textAccent}`}>
          {currentPage}
        </span>
        <span className="text-slate-600 mx-2">/</span>
        <span className="text-slate-500">{totalPages}</span>
      </motion.div>

      {/* Next Button */}
      <motion.div
        whileHover={!isLastPage ? { scale: 1.05 } : {}}
        whileTap={!isLastPage ? { scale: 0.95 } : {}}
      >
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          variant="ghost"
          size="icon"
          className={`
            bg-black/40 backdrop-blur-sm border ${config.buttonBorder}
            ${!isLastPage ? config.buttonHover : "opacity-50 cursor-not-allowed"}
            ${!isLastPage ? config.hoverGlow : ""}
            transition-all duration-300
          `}
        >
          <ChevronRight className={`w-5 h-5 ${isLastPage ? "text-slate-600" : config.textAccent}`} />
        </Button>
      </motion.div>
    </motion.div>
  );
}
