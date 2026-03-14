import { useState } from "react";
import { SendResetPasswordEmail } from "../api/password";

export function useSendResetEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendResetEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await SendResetPasswordEmail(email);
      console.log("Forgot password response:", response);
      setSuccess(true);
    } catch (err: any) {
      if (err?.status === 422) {
        setError("Email address not found");
      } else {
        setError(err?.message || "Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  };

  return { sendResetEmail, loading, error, success };
}
