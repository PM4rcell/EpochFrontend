import { useCallback, useState } from "react";
import { loginUser } from "../api/login";
import { useToken } from "../context/TokenContext";
import { useEra } from "../context/EraContext";
import { fetchMe } from "../api/user";

interface LoginForm {
  email: string;
  password: string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { setToken, setUser } = useToken();
  const { setEra } = useEra();

  const login = useCallback(async (form: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      const loginUserData = (res as any)?.user ?? (res as any)?.data?.user ?? null;
      let me = loginUserData;

      if (!me) {
        me = await fetchMe();
      }

      if (!me) {
        throw new Error("Login succeeded but user data could not be loaded.");
      }

      setUser(me);
      setToken("session");
      try {
        setEra(null);
      } catch (e) {
        // ignore if era can't be cleared for any reason
      }
      setLoading(false);
      return res;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [setEra, setToken, setUser]);

  return { login, loading, error } as const;
}
