import { motion } from "motion/react";
import { Search, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { SearchBar } from "../../features/search/SearchBar";
import { useEra } from "../../context/EraContext";
import { useToken } from "../../context/TokenContext";
import { useNavigate, useLocation } from "react-router-dom";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasSelectedEra = !!era;      // true, ha van kiválasztott era
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Use React Router's location so navigation updates are reflected in
  // rendering immediately (more reliable than reading window.location).
  const location = useLocation();
  const isLanding = location.pathname === "/";

  // Determine which theme to use for styling.
  // Prefer the era from context when present (this ensures clearing the era
  // in context immediately updates the Navbar even if a parent passed the
  // same era down as a `theme` prop). If no era is selected, fall back to
  // the explicit `theme` prop (or "default").
  // Choose appliedTheme according to context and location:
  // - If an era is selected in context, always use it.
  // - Otherwise, if we're on the landing page prefer "default" so era-specific
  //   styling does not persist while navigating away from an era page.
  // - If no era and not on landing, fall back to the explicit `theme` prop.
  const appliedTheme = era ?? (isLanding ? "default" : (theme === "default" ? "default" : theme));

  const colors = (() => {
    // use the computed `appliedTheme` for color decisions so the
    // Navbar reflects the current era from context by default
    switch (appliedTheme) {
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

  // Read token and user from context. Prefer explicit `user` (fetched from `/api/me`).
  const { token, user, logout } = useToken();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const getUsernameFromToken = (t?: string | null) => {
    try {
      if (!t) return null;
      const parts = t.split(".");
      if (parts.length < 2) return null;
      // base64url -> base64
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      // handle UTF-8 payloads
      const payload = JSON.parse(decodeURIComponent(json));
      return payload.username || payload.name || payload.user_name || null;
    } catch {
      return null;
    }
  };
  const usernameFromToken = getUsernameFromToken(token);
  const username = user?.data?.username || usernameFromToken || null;
  // Debug: log token and decoded payload to help diagnose missing username display
  // (use safe accessors)
  // eslint-disable-next-line no-console
  console.debug("[Navbar debug] token:", token, "user:", user, "username:", username);

  // NAV ITEMS
  const navItems = [
    { label: "Home", path: hasSelectedEra ? `/${era}` : "/" }, // Home a context alapján
    { label: "Explore", path: "/search"},
    { label: "Schedule", path: "/screenings", requiresEra: true },
    { label: "News", path: "/news" },
  ];

  // Only show items that require an era when an era is selected in context.
  // Additionally hide era-dependent items if we're on the landing page.
  let visibleNavItems = navItems.filter(item => !item.requiresEra || hasSelectedEra);
  if (isLanding) {
    visibleNavItems = visibleNavItems.filter(item => !item.requiresEra);
  }

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
            // Navigate first, then clear era in context. Clearing after
            // navigation avoids races where other page effects re-set the era.
            navigate("/", { replace: true });
            setEra(null);
          }}
          className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400/50 rounded"
        >
          <span className="tracking-[0.2em] bg-linear-to-r from-amber-600 via-amber-400 to-slate-400 bg-clip-text text-transparent">
            EPOCH
          </span>
        </motion.button>

        {/* Debug: show current era from context for testing (moved to right side) */}

        {/* NAV ITEMS (desktop) */}
        <motion.div className="hidden md:flex flex-1 justify-center items-center gap-8">
          {visibleNavItems.map(item => {
            // Determine active state from URL so the nav reflects the
            // current route (works whether an era is selected or not).
            const isActive = (() => {
              try {
                // For the root path we must match exactly ("/" matches everything
                // when using startsWith). For other paths allow exact match or
                // nested routes (e.g. "/news" and "/news/123").
                if (item.path === "/") {
                  return location.pathname === "/";
                }
                return location.pathname === item.path || location.pathname.startsWith(item.path + "/");
              } catch (e) {
                return false;
              }
            })();
            // Show 'Home' when an era is selected; show 'Eras' when none is selected.
            const displayLabel = item.label === "Home" ? (hasSelectedEra ? "Home" : "Eras") : item.label;

            return (
              <motion.button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-2 py-1 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50 ${isActive ? colors.active : `text-slate-400 ${colors.hover} ${colors.glow}`
                  }`}
              >
                {displayLabel}
                {isActive && (
                  <motion.div
                    layoutId={`activeTab-${appliedTheme}`}
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r ${colors.underline}`}
                    transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Mobile: hamburger menu */}
        <div className="md:hidden flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className={`p-2 rounded ${colors.hover} ${colors.glow} text-slate-300`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Search + Profile */}
        <div className="flex items-center gap-3">
          {/* Debug: show current era from context for testing */}
          <div className="flex items-center text-sm text-slate-300 mr-4">
            <span className="opacity-60 mr-2">Era:</span>
            <span className="font-medium">{era ?? "none"}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearchButtonClick}
            className={`relative text-slate-300 ${colors.hover} ${colors.glow} transition-all duration-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-400/50`}
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {token ? (
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick("/profile")}
                className={`relative ${activePage === "profile" ? colors.active : "text-slate-300"} ${colors.hover} ${colors.glow} transition-all duration-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-400/50 flex items-center cursor-pointer`}
              >
                <User className="w-5 h-5" />
                {username && (
                  <span className="ml-2 text-sm text-slate-300 hidden sm:inline truncate max-w-30">{username}</span>
                )}
              </motion.div>

              {username && (
                <motion.button
                  type="button"
                  onClick={async (e) => {
                    // Prevent parent navigation when clicking logout
                    e.stopPropagation();
                    e.preventDefault();
                    if (logoutLoading) return;
                    setLogoutLoading(true);
                    try {
                      await logout();
                      navigate("/");
                    } catch (err) {
                      // minimal feedback
                      // eslint-disable-next-line no-console
                      console.warn("Logout failed", err);
                      // eslint-disable-next-line no-alert
                      alert("Logout failed");
                    } finally {
                      setLogoutLoading(false);
                    }
                  }}
                  whileHover={logoutLoading ? undefined : { scale: 1.04 }}
                  whileTap={logoutLoading ? undefined : { scale: 0.98 }}
                  disabled={logoutLoading}
                  className={`ml-2 px-3 py-1 rounded-md text-xs text-slate-200 bg-white/5 border border-white/6 transition-colors duration-150 hidden sm:inline ${logoutLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-white/10"}`}
                >
                  {logoutLoading ? <span className="flex items-center gap-2"><Spinner size="sm" theme={appliedTheme as any} /> <span>Signing out</span></span> : "Sign out"}
                </motion.button>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick("/login")}
              className={`relative text-slate-300 ${colors.hover} ${colors.glow} transition-all duration-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-400/50`}
            >
              <User className="w-5 h-5" />
            </motion.button>
          )}
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
              // Pass the computed theme (context-aware) into child components
              theme={appliedTheme}
              onMovieClick={(movieId) => { onMovieClick?.(movieId); setShowSearchBar(false); }}
              onSearchSubmit={(query) => {
                if (onSearchSubmit) {
                  onSearchSubmit(query);
                } else {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                }
                setShowSearchBar(false);
              }}
              placeholder="Search movies..."
              showDropdown={true}
            />
          </div>
        </motion.div>
      )}
      {/* Mobile menu drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="md:hidden fixed top-16 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10"
        >
          <div className="px-6 py-4">
            <div className="flex flex-col gap-3">
              {visibleNavItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { handleNavClick(item.path); setMobileOpen(false); }}
                  className="w-full text-left py-3 px-4 rounded hover:bg-white/5 text-slate-200"
                >
                  {item.label === "Home" ? (hasSelectedEra ? "Home" : "Eras") : item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
