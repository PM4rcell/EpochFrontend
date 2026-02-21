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
import { TicketCard } from "./TicketCard";
import useTickets from "../../hooks/useTickets";

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
            {activeTab === "overview" && <OverviewContent theme={theme} onNavigate={onNavigate} />}
            {activeTab === "tickets" && (
              <section className="py-8">

                {(!tickets || tickets.length === 0) ? (
                  <div className="py-20 text-center">
                    <p className="text-slate-500">You have no tickets yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tickets.map((t) => (
                      <TicketCard
                        key={t.id}
                        movieTitle={t.movieTitle}
                        posterUrl={t.posterUrl}
                        row={t.row}
                        seat={t.seat}
                        date={t.date}
                        time={t.time}
                        format={t.format}
                        venue={t.venue}
                        barcode={t.barcode}
                        ticketType={t.ticketType}
                        bookingStatus={t.bookingStatus}
                        theme={theme}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
            {activeTab === "watchlist" && (
              <div className="py-20 text-center">
                <h2 className="text-slate-400 mb-2">Watchlist</h2>
                <p className="text-slate-500">Your saved films will appear here</p>
              </div>
            )}
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