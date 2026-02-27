import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Navbar } from "../../components/layout/Navbar";
import { useEra } from "../../context/EraContext";
import { Badge } from "../../components/ui/badge";
import { Spinner } from "../../components/ui/spinner";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useArticle } from "../../hooks/useArticle";
import { useNews } from "../../hooks/useArticles";
import type { Article } from "../../hooks/useArticles";
import { ImageWithFallback } from "../../components/ImageWithFallback/ImageWithFallback";
import { ArticleCard } from "./ArticleCard";

interface ArticleDetailPageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
  onBack?: () => void;
  onArticleClick?: (articleId: string) => void;
}


export function ArticleDetailPage({
  onBack,
  onArticleClick,
}: ArticleDetailPageProps) {
  const { articleId } = useParams<{ articleId: string }>();
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const { article, loading, error } = useArticle(articleId);
  const { articles: allArticles } = useNews();
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  const { era } = useEra();
  const appliedTheme = (era ?? "90s") as "90s" | "2000s" | "modern";
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getThemeColors = () => {
    return {
      accent: "text-[var(--theme-accent)]",
      badge: "border-[color:var(--theme-border)] text-[var(--theme-accent)] bg-[color:var(--theme-glow)]",
      buttonHover: "hover:text-[var(--theme-accent)]",
    };
  };

  const colors = getThemeColors();
  const [randomArticles, setRandomArticles] = useState<Article[]>([]);

  // Set random articles only once when articles are loaded
  useEffect(() => {
    if (allArticles && allArticles.length > 0) {
      const otherArticles = allArticles.filter(a => String(a.id) !== String(articleId));
      const shuffled = [...otherArticles].sort(() => 0.5 - Math.random());
      setRandomArticles(shuffled.slice(0, 3));
    }
  }, [allArticles, articleId]);
  if (loading) {
    return (
      <div data-theme={appliedTheme} className="min-h-screen bg-black text-white">
        <Navbar activePage="news" />

        <div className="pt-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="flex flex-col items-center justify-center mb-6">
              <Spinner theme={appliedTheme} size="sm" />
              <p className="text-slate-400 mt-3">Loading article...</p>
            </div>
          </div>
          <article className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                </div>
              </div>
            </div>

            <div className="relative aspect-2/1 rounded-2xl overflow-hidden mb-8">
              <Skeleton className="w-full h-full" />
            </div>

            <div className="mb-8">
              <div className="mb-4">
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-10 w-3/4 mb-4" />

              <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="prose prose-invert prose-slate max-w-none mb-16">
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <Skeleton className="h-64 w-full mb-6" />
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-4/5 mb-3" />
            </div>

            <div className="border-t border-slate-800/50 pt-12 pb-16">
              <div className="mb-6">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (error) {
    // Treat AbortError as a transient cancellation (don't surface as error UI)
    if ((error as any)?.name === "AbortError") {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div>Loading article...</div>
        </div>
      );
    }

    console.error("Article load error:", error);
    const extra = (error as any)?.data ? ` - ${JSON.stringify((error as any).data)}` : "";
    return (
      <div data-theme={appliedTheme} className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>
          Error loading article: {(error as Error).message}{extra}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div data-theme={appliedTheme} className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Article not found</div>
      </div>
    );
  }


  return (
    <div data-theme={appliedTheme} className="min-h-screen bg-black text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-linear-to-b from-black via-slate-900 to-black -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,var(--theme-glow),transparent_50%)]" />
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
          <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
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
              onClick={handleBack}
              className={`text-slate-400 ${colors.buttonHover} transition-colors duration-250 -ml-2`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
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
              src={article.poster?.url || undefined}
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
            <Badge variant="outline" className={`${colors.badge} backdrop-blur-sm mb-4`}>{article.tag}</Badge>
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
            <div dangerouslySetInnerHTML={{ __html: article.body }} className="text-slate-300" />
          </motion.div>

          {/* Related Articles */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
            className="border-t border-slate-800/50 pt-12 pb-16"
          >
            <h2 className="text-slate-300 mb-6">More Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {randomArticles.map((randomArticle) => (
                <ArticleCard
                  key={randomArticle.id}
                  article={randomArticle}
                  onClick={() => onArticleClick ? onArticleClick(randomArticle.id) : navigate(`/article/${randomArticle.id}`)}
                />
              ))}
            </div>
          </motion.section>
        </article>
      </div>
    </div>
  );
}