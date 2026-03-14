import { useState } from "react";
import { ResetPassword } from "../api/password";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetPassword = async (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await ResetPassword(data);
      console.log('Reset password response:', response);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error, success };
}
