import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";
import { useEra } from "../../context/EraContext";

interface NewsHeroProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onArticleClick?: (articleId: string) => void;
}

export function NewsHero({ theme, onArticleClick }: NewsHeroProps) {
  const { era } = useEra();
  const appliedTheme = theme ?? (era ?? "default");

  const getThemeColors = () => {
    switch (appliedTheme) {
      case "90s":
        return {
          accent: "text-amber-400",
          badge: "border-amber-500/50 text-amber-400 bg-amber-500/10",
          buttonBg: "bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20",
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          badge: "border-blue-400/50 text-blue-300 bg-blue-400/10",
          buttonBg: "bg-blue-400/10 border-blue-400/50 text-blue-300 hover:bg-blue-400/20",
          glow: "shadow-[0_0_30px_rgba(96,165,250,0.15)]",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          badge: "border-slate-400/50 text-slate-300 bg-slate-400/10",
          buttonBg: "bg-slate-400/10 border-slate-400/50 text-slate-300 hover:bg-slate-400/20",
          glow: "shadow-[0_0_30px_rgba(226,232,240,0.15)]",
        };
      default:
        return {
          accent: "text-amber-400",
          badge: "border-amber-500/50 text-amber-400 bg-amber-500/10",
          buttonBg: "bg-amber-500/10 border-amber-500/50 text-amber-400 hover:bg-amber-500/20",
          glow: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
        };
    }
  };

  const colors = getThemeColors();

  const featuredArticle = {
    id: "featured-1",
    title: "Behind the Scenes: The Making of Modern Cinema",
    tag: "Announcements",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-12"
    >
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Heading & intro */}
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <h1 className={`${colors.accent} mb-4`}>News & Events</h1>
            <p className="text-slate-400 mb-6">
              Stay updated with the latest announcements, upcoming events, behind-the-scenes stories, and reviews from the world of Epoch cinema.
            </p>
          </motion.div>
        </div>

        {/* Right: Featured Article Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          whileHover={{ scale: 1.02, y: -4 }}
          onClick={() => onArticleClick?.(featuredArticle.id)}
          className={`relative overflow-hidden rounded-2xl cursor-pointer group ${colors.glow} transition-all duration-300`}
        >
          {/* Image */}
          <div className="relative aspect-2/1 overflow-hidden">
            <ImageWithFallback
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <Badge
              variant="outline"
              className={`${colors.badge} backdrop-blur-sm w-fit mb-3`}
            >
              {featuredArticle.tag}
            </Badge>
            <h3 className="text-white mb-4">{featuredArticle.title}</h3>
            <Button
              variant="outline"
              className={`${colors.buttonBg} backdrop-blur-sm transition-all duration-250 w-fit`}
            >
              Read Article
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
