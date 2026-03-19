
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch } from "../api/fetch";
import { fetchMe } from "../api/user";

const USER_COOKIE = "epoch_user_profile";

interface TokenContextValue {
  token: string | null;
  setToken: (t: string | null) => void;
  user: any | null;
  setUser: (u: any | null) => void;
  logout: () => Promise<void>;
}

const TokenContext = createContext<TokenContextValue | undefined>(undefined);

/**
 * TokenProvider
 * - Manages auth token state for the app.
 * - Persists token to localStorage (optional) and calls `setAuthToken`
 *   so `apiFetch` automatically includes the header.
 *
 * Usage:
 *   <TokenProvider>
 *     <App />
 *   </TokenProvider>
 *
 * In components:
 *   const { token, setToken } = useToken();
 */
export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  const [user, setUser] = useState<any | null>(() => {
    try {
      const raw = Cookies.get(USER_COOKIE);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const hasCachedUser = Boolean(user);

  useEffect(() => {
    if (!hasCachedUser) {
      setTokenState(null);
      return;
    }

    let mounted = true;
    async function fetchUser() {
      try {
        const me = await fetchMe();
        if (!mounted) return;
        setUser(me || null);
        setTokenState(me ? "session" : null);
      } catch (err) {
        if (!mounted) return;
        setUser(null);
        setTokenState(null);
      }
    }
    fetchUser();
    return () => {
      mounted = false;
    };
  }, [hasCachedUser]);

  // Logout helper: attempt server logout, then always clear client state.
  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch (err) {
      // Minimal handling: warn but continue clearing client state so user isn't stuck.
      // eslint-disable-next-line no-console
      console.warn("Logout request failed", err);
    }
    // Clear client state and cookies explicitly.
    try {
      Cookies.remove(USER_COOKIE);
    } catch {}
    setTokenState(null);
    setUser(null);
  }, []);

  // Persist user to cookies for quick restoration.
  useEffect(() => {
    try {
      if (user) Cookies.set(USER_COOKIE, JSON.stringify(user), { expires: 7 });
      else Cookies.remove(USER_COOKIE);
    } catch {
      // ignore cookie errors
    }
  }, [user]);

  const setToken = (t: string | null) => setTokenState(t);

  return (
    <TokenContext.Provider value={{ token, setToken, user, setUser, logout }}>{children}</TokenContext.Provider>
  );
}

export function useToken() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useToken must be used within a TokenProvider");
  return ctx;
}
