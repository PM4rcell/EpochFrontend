import { motion } from "motion/react";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";

interface SimilarCardProps {
  title: string;
  year: number;
  image: string;
  onClick?: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function SimilarCard({ title, year, image, onClick, theme = "default" }: SimilarCardProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          border: "border-amber-600/20",
          glow: "hover:shadow-[0_8px_24px_rgba(245,158,11,0.4)]",
          text: "group-hover:text-amber-400",
        };
      case "2000s":
        return {
          border: "border-blue-500/20",
          glow: "hover:shadow-[0_8px_24px_rgba(96,165,250,0.4)]",
          text: "group-hover:text-blue-300",
        };
      case "modern":
        return {
          border: "border-slate-400/20",
          glow: "hover:shadow-[0_8px_24px_rgba(226,232,240,0.4)]",
          text: "group-hover:text-white",
        };
      default:
        return {
          border: "border-amber-600/20",
          glow: "hover:shadow-[0_8px_24px_rgba(245,158,11,0.4)]",
          text: "group-hover:text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        group cursor-pointer rounded-lg overflow-hidden border bg-black/40
        ${colors.border} ${colors.glow}
        transition-all duration-200
      `}
    >
      <div className="aspect-2/3 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-3">
        <h4 className={`text-slate-200 text-sm mb-1 transition-colors duration-200 truncate ${colors.text}`}>
          {title}
        </h4>
        <p className="text-slate-500 text-xs">{year}</p>
      </div>
    </motion.div>
  );
}
