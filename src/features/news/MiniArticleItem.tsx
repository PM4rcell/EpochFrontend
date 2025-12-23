import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { useEra } from "../../context/EraContext";

interface MiniArticleItemProps {
  article: {
    id: string;
    title: string;
    readTime: string;
  };
  theme?: "90s" | "2000s" | "modern" | "default";
  onClick?: () => void;
}

export function MiniArticleItem({ article, theme, onClick }: MiniArticleItemProps) {
  const { era } = useEra();
  const appliedTheme = theme ?? (era ?? "default");

  const getThemeColors = () => {
    switch (appliedTheme) {
      case "90s":
        return {
          hover: "hover:text-amber-400",
        };
      case "2000s":
        return {
          hover: "hover:text-blue-300",
        };
      case "modern":
        return {
          hover: "hover:text-slate-200",
        };
      default:
        return {
          hover: "hover:text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.article
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <h4 className={`text-slate-300 ${colors.hover} transition-colors duration-250 mb-1.5`}>
        {article.title}
      </h4>
      <div className="flex items-center gap-1.5 text-slate-500">
        <Clock className="w-3.5 h-3.5" />
        <span className="text-sm">{article.readTime}</span>
      </div>
    </motion.article>
  );
}
