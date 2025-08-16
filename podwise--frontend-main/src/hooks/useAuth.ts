import React from "react";

const API = import.meta.env.VITE_API_BASE || "http://localhost:7001";

export const useAuth = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const parseJsonSafe = async (res: Response) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/auth/signin`, {
        method: "POST",
        credentials: "include", // keep session cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Signin failed");
      return data.user; // user from session
    } catch (err: any) {
      setError(err.message || "Signin failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data.error || "Signup failed");
      return data.user;
    } catch (err: any) {
      setError(err.message || "Signup failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Signout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { loading, error, clearError, signIn, signUp, signOut };
};
