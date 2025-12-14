import { motion } from "motion/react";

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function FilterTabs({
  tabs,
  activeTab,
  onTabChange,
  theme = "default",
}: FilterTabsProps) {
  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          active: "bg-amber-600 text-black",
          inactive: "bg-transparent text-slate-400 border-slate-700/50",
          hover: "hover:text-amber-400 hover:border-amber-500/50",
        };
      case "2000s":
        return {
          active: "bg-blue-500 text-black",
          inactive: "bg-transparent text-slate-400 border-slate-700/50",
          hover: "hover:text-blue-300 hover:border-blue-400/50",
        };
      case "modern":
        return {
          active: "bg-slate-300 text-black",
          inactive: "bg-transparent text-slate-400 border-slate-700/50",
          hover: "hover:text-white hover:border-slate-400/50",
        };
      default:
        return {
          active: "bg-amber-600 text-black",
          inactive: "bg-transparent text-slate-400 border-slate-700/50",
          hover: "hover:text-amber-400 hover:border-amber-500/50",
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab)}
            className={`
              h-11 px-5 rounded-xl border whitespace-nowrap
              transition-all duration-250
              focus:outline-none focus:ring-2 focus:ring-slate-400/50
              ${
                isActive
                  ? colors.active
                  : `${colors.inactive} ${colors.hover}`
              }
            `}
          >
            {tab}
          </motion.button>
        );
      })}
    </div>
  );
}
