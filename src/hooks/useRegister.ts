import { useCallback, useState } from "react";
import { registerUser } from "../api/register";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const register = useCallback(async (form: RegisterForm) => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      };

      const res = await registerUser(body);
      setLoading(false);
      return res;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return { register, loading, error } as const;
}
