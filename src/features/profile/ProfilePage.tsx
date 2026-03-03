import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { BackButton } from "../../components/ui/back-button";
import { Navbar } from "../../components/layout/Navbar";
import { ProfileHeader } from "./ProfileHeader";
import useHeader from "../../hooks/useHeader";
import { ProfileTabs } from "./ProfleTabs";
import { OverviewContent } from "./OverViewContent";
import { SettingsContent } from "./SettingsContent";
import { TicketsContent } from "./TicketsContent";
import { WatchlistContent } from "./WatchlistContent";
import useTickets from "../../hooks/useTickets";
import useWatchlist from "../../hooks/useWatchlist";

interface ProfilePageProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  onNavigate?: (page: any) => void;
  onBack?: () => void;
  onMovieClick?: (movieId: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export type ProfileTab = "overview" | "tickets" | "watchlist" | "settings";

export function ProfilePage({
  theme = "default",
  onNavigate,
}: ProfilePageProps) {
  const location = useLocation();
  const initialTabFromState = (location.state as any)?.tab as ProfileTab | undefined;
  const searchParams = new URLSearchParams(location.search);
  const initialTabFromQuery = (searchParams.get("tab") as ProfileTab | null) || undefined;

  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTabFromState ?? initialTabFromQuery ?? "overview");
  const { header } = useHeader();

  // If navigation pushes a state with a tab after mount (e.g. via navigate), update activeTab.
  useEffect(() => {
    const tab = (location.state as any)?.tab as ProfileTab | undefined;
    if (tab && tab !== activeTab) setActiveTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);
  const { tickets } = useTickets();
  const { watchlistItems, refreshWatchlist } = useWatchlist();

  useEffect(() => {
    if (activeTab === "watchlist") refreshWatchlist();
  }, [activeTab, refreshWatchlist]);

  const handleOverviewNavigate = (page: string) => {
    if (page === "booking-tickets") {
      setActiveTab("tickets");
      window.setTimeout(() => {
        document.getElementById("profile-tickets-header")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 0);
      return;
    }

    onNavigate?.(page);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-linear-to-b from-black via-slate-900 to-black -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(226,232,240,0.04),transparent_50%)]" />
      </div>

      {/* Navbar */}
      <Navbar theme={theme} activePage="profile" />

      {/* Main content */}
      <div className="pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 sm:px-6 max-w-7xl"
        >
          {/* Profile Header */}
          <div className="mb-4 md:mb-6">
            <BackButton theme={theme} restoreEra={false} />
          </div>
          <ProfileHeader theme={theme} title={header.title} subtitle={header.subtitle} avatar={header.avatar} userId={header.userId} />

          {/* Sticky Tabs */}
          <ProfileTabs
            theme={theme}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          <div className="pb-16">
            {activeTab === "overview" && <OverviewContent theme={theme} onNavigate={handleOverviewNavigate} />}
            {activeTab === "tickets" && <TicketsContent tickets={tickets} theme={theme} />}
            {activeTab === "watchlist" && <WatchlistContent watchlistItems={watchlistItems} theme={theme} />}
            {activeTab === "settings" && (
              <section className="py-8">
                <SettingsContent theme={theme} />
              </section>
            )}
          </div>
        </motion.div>
      </div>

      {/* Ambient lighting effects */}
      <div className="fixed top-40 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-40 right-10 w-96 h-96 bg-slate-400/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
}