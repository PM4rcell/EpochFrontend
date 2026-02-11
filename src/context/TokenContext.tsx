import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { setAuthToken } from "../api/fetch";
import { fetchMe } from "../api/user";

// Key used to persist token to localStorage (optional).
const STORAGE_KEY = "epoch_token";

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
  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<any | null>(() => {
    try {
      const raw = localStorage.getItem("epoch_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Update module-level fetch token whenever it changes.
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // When token changes, attempt to fetch the current user's profile
  // from the API. This handles cases where the token is not a JWT
  // (e.g. Laravel "1|..." tokens) so we can still display a username.
  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      if (!token) {
        if (mounted) setUser(null);
        return;
      }
      try {
        // Ensure the fetch module has the auth token set (setAuthToken ran in previous effect).
        const me = await fetchMe();
        if (mounted) setUser(me || null);
      } catch (err) {
        if (mounted) setUser(null);
      }
    }
    fetchUser();
    return () => {
      mounted = false;
    };
  }, [token]);

  // Logout helper: attempt server logout, then always clear client state.
  const logout = useCallback(async () => {
    try {
      await apiFetch("/api/logout", { method: "POST" });
    } catch (err) {
      // Minimal handling: warn but continue clearing client state so user isn't stuck.
      // eslint-disable-next-line no-console
      console.warn("Logout request failed", err);
    }
    // Clear client state and storage explicitly.
    try {
      setAuthToken(null);
    } catch {}
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("epoch_user");
    } catch {}
    setTokenState(null);
    setUser(null);
  }, []);

  // Persist token changes to localStorage for session restoration.
  useEffect(() => {
    try {
      if (token) localStorage.setItem(STORAGE_KEY, token);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, [token]);

  // Persist user to localStorage for quick restoration.
  useEffect(() => {
    try {
      if (user) localStorage.setItem("epoch_user", JSON.stringify(user));
      else localStorage.removeItem("epoch_user");
    } catch {
      // ignore storage errors
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
