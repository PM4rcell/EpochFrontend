
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch, setAuthToken } from "../api/fetch";
import { fetchMe } from "../api/user";

const TOKEN_COOKIE = "epoch_token";
const USER_COOKIE = "epoch_user";

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
      return Cookies.get(TOKEN_COOKIE) || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<any | null>(() => {
    try {
      const raw = Cookies.get(USER_COOKIE);
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
    // Clear client state and cookies explicitly.
    try {
      setAuthToken(null);
    } catch {}
    try {
      Cookies.remove(TOKEN_COOKIE);
      Cookies.remove(USER_COOKIE);
    } catch {}
    setTokenState(null);
    setUser(null);
  }, []);

  // Persist token changes to cookies for session restoration.
  useEffect(() => {
    try {
      if (token) Cookies.set(TOKEN_COOKIE, token, { expires: 7 }); // expires in 7 days
      else Cookies.remove(TOKEN_COOKIE);
    } catch {
      // ignore cookie errors
    }
  }, [token]);

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
