import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useParams } from "react-router-dom";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";
import { ArticleCard } from "./ArticleCard";

interface ArticleDetailPageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
  onBack?: () => void;
  onArticleClick?: (articleId: string) => void;
}

const articleData: Record<string, any> = {
  "featured-1": {
    title: "Behind the Scenes: The Making of Modern Cinema",
    tag: "Announcements",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop",
    date: "Dec 4, 2024",
    readTime: "8 min",
    author: "Sarah Mitchell",
  },
  "1": {
    title: "Epoch Introduces New Premium Seating Experience",
    tag: "Announcements",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop",
    date: "Dec 3, 2024",
    readTime: "3 min",
    author: "Alex Carter",
  },
};

const relatedArticles = [
  {
    id: "related-1",
    title: "The Future of Cinema Technology",
    excerpt: "Exploring the cutting-edge innovations shaping tomorrow's movie experience.",
    image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800&h=600&fit=crop",
    tag: "Behind the Scenes",
    date: "Nov 28, 2024",
    readTime: "6 min",
  },
  {
    id: "related-2",
    title: "A Guide to Our Enhanced Sound Systems",
    excerpt: "Discover how our Dolby Atmos installation delivers unparalleled audio immersion.",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=600&fit=crop",
    tag: "Announcements",
    date: "Nov 26, 2024",
    readTime: "4 min",
  },
  {
    id: "related-3",
    title: "Member Exclusive: Early Access Benefits",
    excerpt: "Learn about the perks that come with your Silver and Gold tier memberships.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop",
    tag: "Announcements",
    date: "Nov 24, 2024",
    readTime: "5 min",
  },
];

export function ArticleDetailPage({
  theme,
  onBack,
  onArticleClick,
}: ArticleDetailPageProps) {
  const { articleId } = useParams<{ articleId: string }>();
  if (!articleId) {
    return <div>Article not found</div>;
  }
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const article = articleData[articleId] || articleData["featured-1"];
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          badge: "border-amber-500/50 text-amber-400 bg-amber-500/10",
          buttonHover: "hover:text-amber-400",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          badge: "border-blue-400/50 text-blue-300 bg-blue-400/10",
          buttonHover: "hover:text-blue-300",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          badge: "border-slate-400/50 text-slate-300 bg-slate-400/10",
          buttonHover: "hover:text-slate-200",
        };
      default:
        return {
          accent: "text-amber-500",
          badge: "border-amber-500/50 text-amber-400 bg-amber-500/10",
          buttonHover: "hover:text-amber-400",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-linear-to-b from-black via-slate-900 to-black -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.08),transparent_50%)]" />
      </div>

      {/* Navbar */}
      <Navbar activePage="news"/>

      {/* Sticky Mobile Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: showStickyHeader ? 0 : -100 }}
        transition={{ duration: 0.25 }}
        className="lg:hidden fixed top-18.25 left-0 right-0 z-30 bg-black/95 backdrop-blur-md border-b border-slate-800/50 px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h4 className="text-slate-300 truncate flex-1">{article.title}</h4>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-20">
        <article className="container mx-auto px-4 sm:px-6 max-w-4xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={onBack}
              className={`text-slate-400 ${colors.buttonHover} transition-colors duration-250 -ml-2`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative aspect-2/1 rounded-2xl overflow-hidden mb-8 border border-slate-800/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
          >
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="mb-8"
          >
            <Badge
              variant="outline"
              className={`${colors.badge} backdrop-blur-sm mb-4`}
            >
              {article.tag}
            </Badge>
            <h1 className="text-white mb-6">{article.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} read</span>
              </div>
            </div>
          </motion.div>

          {/* Article Body */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="prose prose-invert prose-slate max-w-none mb-16"
          >
            <p className="text-slate-300">
              We're thrilled to unveil the most significant upgrade to the Epoch cinema experience in our history. After months of careful planning and installation, we're introducing a revolutionary new seating system that redefines comfort and immersion.
            </p>

            <h2 className={`${colors.accent} mt-8 mb-4`}>Premium Comfort</h2>
            <p className="text-slate-300">
              Our new luxury recliners feature full power recline, heated seats, and individual USB charging ports at every seat. Each chair has been ergonomically designed to provide optimal viewing angles while maintaining the intimacy and ambiance that makes Epoch special.
            </p>

            <h2 className={`${colors.accent} mt-8 mb-4`}>Enhanced Audio Experience</h2>
            <p className="text-slate-300">
              Alongside our seating upgrade, we've installed state-of-the-art Dolby Atmos sound systems across all theaters. This immersive audio technology places you at the center of the action with multi-dimensional sound that flows around you with breathtaking realism.
            </p>

            <div className="my-8 rounded-2xl overflow-hidden border border-slate-800/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&h=600&fit=crop"
                alt="Theater interior"
                className="w-full"
              />
            </div>

            <h2 className={`${colors.accent} mt-8 mb-4`}>Available Now</h2>
            <p className="text-slate-300">
              These improvements are live across all our theaters starting today. We invite you to experience the new Epoch standard – book your tickets now and discover cinema comfort reimagined.
            </p>
          </motion.div>

          {/* Related Articles */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="border-t border-slate-800/50 pt-12 pb-16"
          >
            <h2 className="text-slate-300 mb-6">More Like This</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                >
                  <ArticleCard
                    article={related}
                    onClick={() => onArticleClick?.(related.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        </article>
      </div>
    </div>
  );
}