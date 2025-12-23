import { motion } from "motion/react";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";

interface CastItemProps {
  name: string;
  character: string;
  image: string;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function CastItem({ name, character, image, theme = "default" }: CastItemProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          border: "border-amber-600/30",
          glow: "group-hover:shadow-[0_4px_16px_rgba(245,158,11,0.3)]",
          text: "group-hover:text-amber-400",
        };
      case "2000s":
        return {
          border: "border-blue-500/30",
          glow: "group-hover:shadow-[0_4px_16px_rgba(96,165,250,0.3)]",
          text: "group-hover:text-blue-300",
        };
      case "modern":
        return {
          border: "border-slate-400/30",
          glow: "group-hover:shadow-[0_4px_16px_rgba(226,232,240,0.3)]",
          text: "group-hover:text-white",
        };
      default:
        return {
          border: "border-amber-600/30",
          glow: "group-hover:shadow-[0_4px_16px_rgba(245,158,11,0.3)]",
          text: "group-hover:text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col items-center text-center"
    >
      <div className={`
        w-20 h-20 rounded-full overflow-hidden border-2 mb-3
        ${colors.border} ${colors.glow}
        transition-all duration-200
      `}>
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className={`text-slate-200 text-sm mb-1 transition-colors duration-200 ${colors.text}`}>
        {name}
      </h4>
      <p className="text-slate-500 text-xs">{character}</p>
    </motion.div>
  );
}
