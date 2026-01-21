import { useState } from "react";
import { motion } from "motion/react";
import { Navbar } from "../../components/layout/Navbar";
import { NewsHero } from "./NewsHero.tsx";
import { CategoryFilters } from "./CategoryFilters";
import { ArticleGrid } from "./ArticleGrid.tsx";
import { useNews } from "../../hooks/useNews";
import { useArticleNavigationId } from "../../hooks/useArticleNavigationId";
import { NewsSidebar } from "./NewsSidebar";

interface NewsPageProps {
  onNavigate?: (page: any) => void;
  onArticleClick?: (articleId: string) => void;
  onMovieClick?: (movieId: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export type NewsCategory = "all" | "announcements" | "events" | "reviews" | "behind-the-scenes";

export function NewsPage({
  onArticleClick,
  onMovieClick,
  onSearchSubmit,
}: NewsPageProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("all");
  const { articles, loading, error } = useNews();
  const navigateToArticle = useArticleNavigationId();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-linear-to-b from-black via-slate-900 to-black -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(226,232,240,0.04),transparent_50%)]" />
      </div>

      {/* Navbar */}
      <Navbar activePage="news" onMovieClick={onMovieClick} onSearchSubmit={onSearchSubmit} />

      {/* Main content */}
      <div className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 sm:px-6 max-w-7xl"
        >
          {/* News Hero */}
          <NewsHero onArticleClick={onArticleClick ?? navigateToArticle} />

          {/* Category Filters */}
          <CategoryFilters
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Main Content Layout */}
          <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Article Grid - 9 columns on desktop */}
            <div className="lg:col-span-9">
              <ArticleGrid
                category={activeCategory}
                articles={articles}
                loading={loading}
                error={error}
                onArticleClick={onArticleClick ?? navigateToArticle}
              />
            </div>

            {/* Sidebar - 3 columns on desktop, below grid on mobile */}
            <div className="lg:col-span-3 mt-8 lg:mt-0">
              <NewsSidebar onArticleClick={onArticleClick ?? navigateToArticle} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ambient lighting effects */}
      <div className="fixed top-40 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-40 right-10 w-96 h-96 bg-slate-400/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}