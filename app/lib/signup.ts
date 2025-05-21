import { FormEvent } from "react";

export const signup = async (
  event: FormEvent<HTMLFormElement>,
  user: string,
  mail: string,
  pass: string,
  pass2: string,
  validatePassword: (pass: string, pass2: string) => string[]
): Promise<{ success: true; data: any } | { success: false; error: string }> => {
  event.preventDefault();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const validationErrors = validatePassword(pass, pass2);
  if (validationErrors.length > 0) {
    return { success: false, error: validationErrors.join(", ") };
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/sign-up`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user,
        email: mail,
        password: pass,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Sign-up failed" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
