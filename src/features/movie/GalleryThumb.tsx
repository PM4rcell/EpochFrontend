import { motion } from "motion/react";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";

interface GalleryThumbProps {
  image: string;
  alt: string;
  onClick?: () => void;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function GalleryThumb({ image, alt, onClick, theme = "default" }: GalleryThumbProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          border: "border-amber-600/30",
          glow: "hover:shadow-[0_8px_24px_rgba(245,158,11,0.3)]",
          overlay: "hover:bg-amber-600/20",
        };
      case "2000s":
        return {
          border: "border-blue-500/30",
          glow: "hover:shadow-[0_8px_24px_rgba(96,165,250,0.3)]",
          overlay: "hover:bg-blue-500/20",
        };
      case "modern":
        return {
          border: "border-slate-400/30",
          glow: "hover:shadow-[0_8px_24px_rgba(226,232,240,0.3)]",
          overlay: "hover:bg-slate-300/20",
        };
      default:
        return {
          border: "border-amber-600/30",
          glow: "hover:shadow-[0_8px_24px_rgba(245,158,11,0.3)]",
          overlay: "hover:bg-amber-600/20",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        relative w-full aspect-video rounded-lg overflow-hidden border cursor-pointer
        ${colors.border} ${colors.glow}
        transition-all duration-200
      `}
    >
      <ImageWithFallback
        src={image}
        alt={alt}
        className="w-full h-full object-cover"
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className={`absolute inset-0 ${colors.overlay} transition-opacity duration-200`}
      />
    </motion.div>
  );
}
