import { motion } from "motion/react";
import { Search, User } from "lucide-react";
import { useState } from "react";
import { SearchBar } from "../search/SearchBar";
import { useEra } from "../../context/EraContext";
import { useNavigate } from "react-router-dom";

type PageType = "home" | "screenings" | "movies" | "news" | "profile" | "era";

interface NavbarProps {
  theme?: "90s" | "2000s" | "modern" | "default";
  activePage?: PageType;
  onSearchClick?: () => void;
  onMovieClick?: (movieId: string) => void;
  onSearchSubmit?: (query: string) => void;
}

export function Navbar({
  theme = "default",
  activePage = "home",
  onSearchClick,
  onMovieClick,
  onSearchSubmit,
}: NavbarProps) {
  const { era, setEra } = useEra(); // csak egyszer
  const navigate = useNavigate();
  const hasSelectedEra = !!era;      // true, ha van kiválasztott era
  const [showSearchBar, setShowSearchBar] = useState(false);

  const colors = (() => {
    switch (theme) {
      case "90s":
        return { accent: "text-amber-500", hover: "hover:text-amber-400", glow: "hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]", active: "text-amber-500", underline: "from-amber-600 to-amber-400" };
      case "2000s":
        return { accent: "text-blue-400", hover: "hover:text-blue-300", glow: "hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]", active: "text-blue-400", underline: "from-blue-500 to-blue-400" };
      case "modern":
        return { accent: "text-slate-300", hover: "hover:text-white", glow: "hover:drop-shadow-[0_0_8px_rgba(226,232,240,0.5)]", active: "text-slate-300", underline: "from-slate-400 to-slate-300" };
      default:
        return { accent: "text-amber-500", hover: "hover:text-amber-400", glow: "hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]", active: "text-amber-500", underline: "from-amber-600 to-amber-400" };
    }
  })();

  // NAV ITEMS
  const navItems = [
    { label: "Home", path: hasSelectedEra ? `/${era}` : "/" }, // Home a context alapján
    { label: "Schedule", path: "/screenings", requiresEra: true },
    { label: "News", path: "/news" },
  ];

  const visibleNavItems = navItems.filter(item => !item.requiresEra || hasSelectedEra);

  // NAVIGATION HANDLER
  const handleNavClick = (path: string) => {
    navigate(path);
  };

  const handleSearchButtonClick = () => {
    if (onSearchClick) onSearchClick();
    else setShowSearchBar(!showSearchBar);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEra(null);       // context törlése
            navigate("/");       // vissza landing page-re
          }}
          className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400/50 rounded"
        >
          <span className="tracking-[0.2em] bg-linear-to-r from-amber-600 via-amber-400 to-slate-400 bg-clip-text text-transparent">
            EPOCH
          </span>
        </motion.button>

        {/* NAV ITEMS */}
        <motion.div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
          {visibleNavItems.map(item => {
            const isActive = activePage === item.label.toLowerCase();
            return (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-2 py-1 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50 ${isActive ? colors.active : `text-slate-400 ${colors.hover} ${colors.glow}`
                  }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId={`activeTab-${theme}`}
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r ${colors.underline}`}
                    transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Search + Profile */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearchButtonClick}
            className={`relative text-slate-300 ${colors.hover} ${colors.glow} transition-all duration-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-400/50`}
          >
            <Search className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavClick("/profile")}
            className={`relative ${activePage === "profile" ? colors.active : "text-slate-300"} ${colors.hover} ${colors.glow} transition-all duration-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-400/50`}
          >
            <User className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* SEARCH BAR */}
      {showSearchBar && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
          className="border-t border-white/10 overflow-visible"
        >
          <div className="container mx-auto px-6 py-4">
            <SearchBar
              theme={theme}
              onMovieClick={(movieId) => { onMovieClick?.(movieId); setShowSearchBar(false); }}
              onSearchSubmit={(query) => { onSearchSubmit?.(query); setShowSearchBar(false); }}
              placeholder="Search movies..."
              showDropdown={true}
            />
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
