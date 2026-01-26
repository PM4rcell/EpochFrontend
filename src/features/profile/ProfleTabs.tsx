import { useEffect, useState } from "react";
import { motion } from "motion/react";
import type { ProfileTab } from "./ProfilePage";

interface ProfileTabsProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ theme = "default", activeTab, onTabChange }: ProfileTabsProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          active: "text-amber-400",
          inactive: "text-slate-500",
          hover: "hover:text-amber-500/80",
          underline: "bg-gradient-to-r from-amber-600 to-amber-400",
          glow: "hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]",
          focusRing: "focus-visible:ring-amber-500/50",
        };
      case "2000s":
        return {
          active: "text-blue-400",
          inactive: "text-slate-500",
          hover: "hover:text-blue-400/80",
          underline: "bg-gradient-to-r from-blue-500 to-blue-400",
          glow: "hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.4)]",
          focusRing: "focus-visible:ring-blue-400/50",
        };
      case "modern":
        return {
          active: "text-slate-300",
          inactive: "text-slate-500",
          hover: "hover:text-slate-400",
          underline: "bg-gradient-to-r from-slate-400 to-slate-300",
          glow: "hover:drop-shadow-[0_0_6px_rgba(226,232,240,0.4)]",
          focusRing: "focus-visible:ring-slate-400/50",
        };
      default:
        return {
          active: "text-amber-400",
          inactive: "text-slate-500",
          hover: "hover:text-amber-500/80",
          underline: "bg-gradient-to-r from-amber-600 to-amber-400",
          glow: "hover:drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]",
          focusRing: "focus-visible:ring-amber-500/50",
        };
    }
  };

  const colors = getThemeColors();

  const tabs: Array<{ id: ProfileTab; label: string }> = [
    { id: "overview", label: "Overview" },
    { id: "tickets", label: "Tickets" },
    { id: "collections", label: "Collections" },
    { id: "watchlist", label: "Watchlist" },
    { id: "payments", label: "Payments" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`${
        isSticky
          ? "fixed top-18.25 left-0 right-0 z-40 bg-black/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          : "relative"
      } transition-all duration-250 border-b border-slate-800/50`}
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar -mb-px py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-3 sm:px-4 py-3 sm:py-3.5 whitespace-nowrap transition-all duration-250 focus:outline-none focus-visible:ring-2 ${
                  colors.focusRing
                } rounded-t ${
                  isActive
                    ? colors.active
                    : `${colors.inactive} ${colors.hover} ${colors.glow}`
                }`}
              >
                <span className="text-sm sm:text-base">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId={`activeTab-profile-${theme}`}
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${colors.underline}`}
                    transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
