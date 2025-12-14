import { Routes, Route, useParams, Navigate } from "react-router-dom";
import { useEra, type Era } from "../context/EraContext.tsx";
import LandingPage from "../features/landing-page/LandingPage.tsx";
import { EraPage } from "../features/era-page/EraPage.tsx";
import { ScreeningsPage } from "../features/screening/ScreeningsPage.tsx";

// Wrapper, ami a URL paraméter alapján állítja be az erát
function EraRouteWrapper() {
  const { eraId } = useParams<{ eraId: string }>();
  const { era, setEra } = useEra();

  const validEras: Era[] = ["90s", "2000s", "modern"];

  // Ha a param valid és nem egyezik a contexttel, állítsuk be szinkron módon
  if (eraId && validEras.includes(eraId as Era) && era !== eraId) {
    setEra(eraId as Era);
  }

  // Ha érvénytelen URL, navigáljunk vissza a landingre
  if (!eraId || !validEras.includes(eraId as Era)) {
    return <Navigate to="/" replace />;
  }

  return <EraPage />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Főoldal */}
      <Route path="/" element={<LandingPage />} />

      {/* Era oldalak */}
      <Route path="/:eraId" element={<EraRouteWrapper />} />

    {/* Screenings oldal (csak akkor működik, ha van kiválasztott era) */}
      <Route path="/screenings" element={<ScreeningsPage />} />

      {/* Ha később lesz más oldal, ide jöhet */}
      {/* <Route path="/profile" element={<ProfilePage />} /> */}
    </Routes>
  );
}
