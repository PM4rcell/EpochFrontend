import { useCallback, useEffect, useState } from "react";

type HeaderState = {
  title?: string;
  subtitle?: string;
  avatar?: string | null;
  userId?: string | number | null;
};

// useHeader: reads the persisted `epoch_user` from localStorage and
// exposes header state plus helpers. It does NOT perform network fetches.
export default function useHeader(initial?: HeaderState) {
  const readFromStorage = useCallback((): HeaderState => {
    try {
      if (typeof window === "undefined") return initial || {};
      const raw = localStorage.getItem("epoch_user");
      if (!raw) return initial || {};
      const me = JSON.parse(raw);
      const title = me?.data?.username || "Profile";
      const subtitle = me?.data?.email || undefined;
      const avatar = me?.data?.avatar_url || null;
      const userId = me?.data?.id ?? null;
      return { title, subtitle, avatar, userId };
    } catch {
      return initial || {};
    }
  }, [initial]);

  const [header, setHeader] = useState<HeaderState>(readFromStorage);

  const refreshHeader = useCallback(() => {
    setHeader(readFromStorage());
  }, [readFromStorage]);

  useEffect(() => {
    refreshHeader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearHeader = useCallback(() => {
    setHeader({});
    try {
      if (typeof window !== "undefined") localStorage.removeItem("epoch_user");
      if (typeof document !== "undefined") document.title = "Epoch";
    } catch {}
  }, []);

  return { header, setHeader, refreshHeader, clearHeader } as const;
}
