import React from "react";
import { createContext, useContext, useState, } from "react";

/*
  Era type
  - Represents the canonical era keys used throughout the app.
  - `null` means "no era selected" (landing page, initial state).
  - Keep this union in sync with backend/route handling: "90s", "2000s", "modern".
*/
export type Era = "90s" | "2000s" | "modern" | null;

/*
  EraContextType
  - `era`: current selected era (or null)
  - `setEra`: updater used by components to change the selected era
    (e.g. when the user selects an era from the landing page).
  Notes:
  - `setEra` should be called with one of the Era string keys or `null` to clear selection.
  - Clearing the era (setEra(null)) is used to return the app to the landing state.
*/
interface EraContextType {
  era: Era;
  setEra: (era: Era) => void;
  // Timestamp (ms since epoch) when the era was last cleared via `setEra(null)`.
  // Components can use this to ignore a URL-driven re-set that happens
  // immediately after a user cleared the era (prevents the two-click UX).
  lastClearedAt: number | null;
}

/*
  Create the context. We store `null` as the default to make the missing-provider
  case explicit and easier to detect in `useEra()`.
*/
const EraContext = createContext<EraContextType | null>(null);

/*
  EraProvider
  - Wrap your application (or part of it) with this provider so descendants
    can read/write the current era via `useEra()`.
  - The provider holds a small piece of UI state (the selected era) shared
    across routes and components (Navbar visibility, theming, routing, etc.).
  - Keep the provider high in the tree (see `src/main.tsx`) so pages and layout
    components can access it.
*/
export function EraProvider({ children }: { children: React.ReactNode }) {
  const STORAGE_KEY = "epoch:era";

  // Initialize from localStorage synchronously to avoid a flash on refresh.
  const [era, setEraState] = useState<Era>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      if (raw === "90s" || raw === "2000s" || raw === "modern") return raw as Era;
    } catch (e) {
      // ignore storage read errors
    }
    return null;
  });

  // Wrapper around the internal setter that persists to localStorage.
  const [lastClearedAt, setLastClearedAt] = useState<number | null>(null);

  const setEra = (next: Era) => {
    setEraState(next);
    try {
      if (next === null) {
        localStorage.removeItem(STORAGE_KEY);
        // record when we cleared so other components can temporarily
        // ignore URL→context writes that happen immediately after.
        setLastClearedAt(Date.now());
      } else {
        localStorage.setItem(STORAGE_KEY, next);
        // clear the timestamp when a real era is selected
        setLastClearedAt(null);
      }
    } catch (e) {
      // ignore storage write errors
    }
  };

  return (
    <EraContext.Provider value={{ era, setEra, lastClearedAt }}>
      {children}
    </EraContext.Provider>
  );
}

/*
  useEra
  - Custom hook for consuming the EraContext.
  - Throws a helpful error when used outside of an `EraProvider` so mistakes
    are easier to diagnose during development.
  - Returns `{ era, setEra }`.
*/
export function useEra() {
  const context = useContext(EraContext);
  if (!context) {
    throw new Error("useEra must be used within an EraProvider");
  }
  return context;
}
