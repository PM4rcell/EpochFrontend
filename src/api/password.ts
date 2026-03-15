import { apiFetch } from "./fetch";

export async function SendResetPasswordEmail(email: string) {
    const response = await apiFetch("/api/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ email: email }),
    });
    console.log('SendResetPasswordEmail response:', response);
    return response;
}


export async function ResetPassword({ token, email, password, password_confirmation }: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const body = {
    token,
    email,
    password,
    password_confirmation
  };
  console.log('ResetPassword body:', body);
  return apiFetch("/api/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body),
  });
}
