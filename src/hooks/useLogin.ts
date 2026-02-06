import { useCallback, useState } from "react";
import { loginUser } from "../api/login";
import { useToken } from "../context/TokenContext";

interface LoginForm {
  email: string;
  password: string;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const { setToken } = useToken();

  const login = useCallback(async (form: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email: form.email, password: form.password });
      // Common token shapes: { token } or { access_token }
      const token = (res && (res.token || (res as any).access_token)) || (res && (res.data && res.data.token));
      if (token) setToken(token);
      setLoading(false);
      return res;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, [setToken]);

  return { login, loading, error } as const;
}
