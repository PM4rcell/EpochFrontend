import { motion } from "motion/react";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";
import { useEra } from "../../context/EraContext";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    tag: string;
    date: string;
    readTime: string;
  };
  theme?: "90s" | "2000s" | "modern" | "default";
  onClick?: () => void;
}

export function ArticleCard({ article, theme, onClick }: ArticleCardProps) {
  const { era } = useEra();
  const appliedTheme = theme ?? (era ?? "default");

  const getThemeColors = () => {
    switch (appliedTheme) {
      case "90s":
        return {
          border: "border-slate-800/50",
          hoverBorder: "group-hover:border-amber-500/30",
          hoverGlow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
          badge: "border-amber-500/50 text-amber-400 bg-amber-500/10",
        };
      case "2000s":
        return {
          border: "border-slate-800/50",
          hoverBorder: "group-hover:border-blue-400/30",
          hoverGlow: "group-hover:shadow-[0_0_20px_rgba(96,165,250,0.15)]",
          badge: "border-blue-400/50 text-blue-300 bg-blue-400/10",
        };
      case "modern":
        return {
          border: "border-slate-800/50",
          hoverBorder: "group-hover:border-slate-400/30",
          hoverGlow: "group-hover:shadow-[0_0_20px_rgba(226,232,240,0.15)]",
          badge: "border-slate-400/50 text-slate-300 bg-slate-400/10",
        };
      default:
        return {
          border: "border-slate-800/50",
          hoverBorder: "group-hover:border-amber-500/30",
          hoverGlow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
          badge: "border-amber-500/50 text-amber-400 bg-amber-500/10",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl overflow-hidden bg-linear-to-br from-slate-900/60 to-black/60 backdrop-blur-sm border ${colors.border} ${colors.hoverBorder} ${colors.hoverGlow} transition-all duration-300`}
    >
      {/* Image */}
      <div className="relative aspect-4/3 overflow-hidden">
        <ImageWithFallback
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        
        {/* Tag badge */}
        <div className="absolute top-4 left-4">
          <Badge
            variant="outline"
            className={`${colors.badge} backdrop-blur-sm`}
          >
            {article.tag}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-white mb-3 group-hover:text-slate-200 transition-colors duration-250">
          {article.title}
        </h3>
        <p className="text-slate-400 mb-4 line-clamp-2">{article.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{article.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{article.readTime}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
