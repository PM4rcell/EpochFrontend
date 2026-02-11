import { useState } from "react";
import { motion } from "motion/react";
import { Navbar } from "../../components/layout/Navbar";
import { ProfileHeader } from "./ProfileHeader";
import useHeader from "../../hooks/useHeader";
import { ProfileTabs } from "./ProfleTabs";
import { OverviewContent } from "./OverViewContent";

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
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");
  const { header } = useHeader();

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
              <div className="py-20 text-center">
                <h2 className="text-slate-400 mb-2">Tickets</h2>
                <p className="text-slate-500">Your ticket history will appear here</p>
              </div>
            )}
            {activeTab === "watchlist" && (
              <div className="py-20 text-center">
                <h2 className="text-slate-400 mb-2">Watchlist</h2>
                <p className="text-slate-500">Your saved films will appear here</p>
              </div>
            )}
            {activeTab === "settings" && (
              <div className="py-20 text-center">
                <h2 className="text-slate-400 mb-2">Settings</h2>
                <p className="text-slate-500">Account settings will appear here</p>
              </div>
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