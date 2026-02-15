import { useCallback, useEffect, useState } from "react";
import { updateMe } from "../api/user";

type Settings = {
  username?: string | null;
  email?: string | null;
  avatar?: string | null;
};

type EditableSettings = {
  username?: string | null;
  email?: string | null;
  avatar?: string | File | null;
};

export function readStoredUser(): Settings {
  try {
    if (typeof window === "undefined") return {};
    const raw = localStorage.getItem("epoch_user");
    if (!raw) return {};
    const me = JSON.parse(raw);
    return {
      username: me?.data?.username ?? me?.username ?? null,
      email: me?.data?.email ?? me?.email ?? null,
      avatar: me?.data?.avatar_url ?? me?.data?.avatar ?? me?.avatar ?? null,
    };
  } catch {
    return {};
  }
}

export default function useSettings() {
  const [settings, setSettings] = useState<EditableSettings>(() => readStoredUser());
  const [dirty, setDirty] = useState<Set<keyof EditableSettings>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<any>(null);

  const refresh = useCallback(() => setSettings(readStoredUser()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setField = useCallback(<K extends keyof EditableSettings>(key: K, value: EditableSettings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setDirty((d) => {
      const next = new Set(d);
      next.add(key);
      return next;
    });
  }, []);

  // saveChanges: send only dirty fields to the backend. Uses updateMe which
  // will send FormData when a File is included.
  const saveChanges = useCallback(async () => {
    if (dirty.size === 0) return { ok: true };
    setSaving(true);
    setError(null);
    try {
      const payload: any = {};
      if (dirty.has("username") && typeof settings.username !== "undefined") payload.username = settings.username ?? undefined;
      if (dirty.has("email") && typeof settings.email !== "undefined") payload.email = settings.email ?? undefined;
      if (dirty.has("avatar")) {
        if (settings.avatar instanceof File) payload.poster = settings.avatar;
        else if (typeof settings.avatar === "string") payload.avatar = settings.avatar;
      }

      const res = await updateMe(payload);

      // Persist to localStorage in the same shape readStoredUser expects.
      try {
        const raw = localStorage.getItem("epoch_user");
        const me = raw ? JSON.parse(raw) : {};
        me.data = me.data ?? {};
        if (typeof payload.username !== "undefined") me.data.username = payload.username;
        if (typeof payload.email !== "undefined") me.data.email = payload.email;
        // If server returned avatar URL, prefer that
        const avatarUrl = res?.data?.avatar_url ?? res?.avatar_url ?? res?.avatar;
        if (avatarUrl) me.data.avatar_url = avatarUrl;
        else if (typeof settings.avatar === "string") me.data.avatar_url = settings.avatar;
        localStorage.setItem("epoch_user", JSON.stringify(me));
      } catch {}

      setDirty(new Set());
      setSaving(false);
      refresh();
      return { ok: true };
    } catch (err) {
      setError(err);
      setSaving(false);
      return { ok: false, error: err };
    }
  }, [dirty, settings, refresh]);

  const save = useCallback((next: Settings) => {
    try {
      const raw = localStorage.getItem("epoch_user");
      const me = raw ? JSON.parse(raw) : {};
      // Ensure `data` exists
      me.data = me.data ?? {};
      if (typeof next.username !== "undefined") me.data.username = next.username;
      if (typeof next.email !== "undefined") me.data.email = next.email;
      if (typeof next.avatar !== "undefined") me.data.avatar_url = next.avatar;
      localStorage.setItem("epoch_user", JSON.stringify(me));
      setSettings(readStoredUser());
      return true;
    } catch {
      return false;
    }
  }, []);

  return { settings, setField, dirty, isDirty: dirty.size > 0, saveChanges, saving, error, save, refresh } as const;
}
