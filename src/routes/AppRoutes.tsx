import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "../features/landing-page/LandingPage.tsx";
import { EraPage } from "../features/era-page/EraPage.tsx";
import { ScreeningsPage } from "../features/screening/ScreeningsPage.tsx";
import { NewsPage } from "../features/news/NewsPage";
import { MovieInfoPage } from "../features/movie/MovieInfoPage.tsx";
import { SearchResultsPage } from "../features/search/SearchResultsPage.tsx";
import { ArticleDetailPage } from "../features/news/ArticleDetailPage.tsx";
import { ProfilePage } from "../features/profile/ProfilePage.tsx";
import { SeatsPage } from "../features/booking/SeatsPage.tsx";
import { LoginPage } from "../features/auth/LoginPage.tsx";
import { RegisterPage } from "../features/auth/RegisterPage.tsx";
import { PaymentPage } from "../features/booking/PaymentPage.tsx";
import { TicketPage } from "../features/booking/TicketPage.tsx";
import CheckoutGuard from "../features/booking/CheckoutGuard";

export function AppRoutes() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => navigate(page);

  return (
    <Routes>
      {/* Főoldal */}
      <Route path="/" element={<LandingPage />} />

      {/* Era oldalak */}
      <Route path="/:eraId" element={<EraPage />} />

    {/* Screenings oldal (csak akkor működik, ha van kiválasztott era) */}
      <Route path="/screenings" element={<ScreeningsPage />} />

      {/* News Page */}
      <Route path="/news" element={<NewsPage />} />

      {/* Movie info page */}
      <Route path="/movies/:movieId" element={<MovieInfoPage />} />

      {/* Search Result page */}
      <Route path="/search" element={<SearchResultsPage />} />

      {/* Article Detail page  */}
      <Route path="/article/:articleId" element={<ArticleDetailPage />} />

      {/* Profile page */}
      <Route path="/profile" element={<ProfilePage/>}/>
      
      {/* Seats Page, azaz a booking oldal első lépése
       (1. Choose your place -> 2. Payment -> 3. Done) */}
      <Route path="/booking" element={<SeatsPage/>}/>
      <Route path="/booking/:screeningId" element={<SeatsPage/>} />

      {/*Payment page */}
      <Route path="/payment" element={<PaymentPage />} />

      {/* Payment page with booking ID */}
      <Route path="/payment/:bookingId" element={<PaymentPage />} />

      <Route path="/checkout/:bookingId" element={<CheckoutGuard/>} />
      
      {/*Login page */}
      <Route path="/login" element={<LoginPage onNavigate={handleNavigate} />}/>

      {/*Register Page */}
      <Route path="/register" element={<RegisterPage onNavigate={handleNavigate} />}/>
    </Routes>
  );
}
