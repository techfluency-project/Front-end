import { FormEvent } from "react";

export const signin = async (
  event: FormEvent<HTMLFormElement>,
  user: string,
  pass: string
): Promise<{ success: true; data: any } | { success: false; error: string }> => {
  event.preventDefault();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!user || !pass) {
    return { success: false, error: "Missing username or password" };
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/sign-in`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Sign-in failed" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};
