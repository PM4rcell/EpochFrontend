import { createContext, useContext, useState } from "react";

export type Era = "90s" | "2000s" | "modern" | null;

interface EraContextType {
  era: Era;
  setEra: (era: Era) => void;
}

const EraContext = createContext<EraContextType | null>(null);

export function EraProvider({ children }: { children: React.ReactNode }) {
  const [era, setEra] = useState<Era>(null);

  return (
    <EraContext.Provider value={{ era, setEra }}>
      {children}
    </EraContext.Provider>
  );
}

export function useEra() {
  const context = useContext(EraContext);
  if (!context) {
    throw new Error("useEra must be used within an EraProvider");
  }
  return context;
}
