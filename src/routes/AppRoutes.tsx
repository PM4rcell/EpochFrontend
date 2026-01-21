import { Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing-page/LandingPage.tsx";
import { EraPage } from "../features/era-page/EraPage.tsx";
import { ScreeningsPage } from "../features/screening/ScreeningsPage.tsx";
import { NewsPage } from "../features/news/NewsPage";
import { MovieInfoPage } from "../features/movie/MovieInfoPage.tsx";
import { SearchResultsPage } from "../features/search/SearchResultsPage.tsx";
import { ArticleDetailPage } from "../features/news/ArticleDetailPage.tsx";

export function AppRoutes() {
  return (
    <Routes>
      {/* Főoldal */}
      <Route path="/" element={<LandingPage />} />

      {/* Era oldalak */}
      <Route path="/:eraId" element={<EraPage />} />

    {/* Screenings oldal (csak akkor működik, ha van kiválasztott era) */}
      <Route path="/screenings" element={<ScreeningsPage />} />

      {/* News page */}
      <Route path="/news" element={<NewsPage />} />

      {/* Movie info page */}
      <Route path="/movies/:movieId" element={<MovieInfoPage />} />

      {/* Search Result page */}
      <Route path="/search" element={<SearchResultsPage />} />

      <Route path="/article/:articleId" element={<ArticleDetailPage />} />
    </Routes>
  );
}
