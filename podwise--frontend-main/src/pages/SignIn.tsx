import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

export const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, signIn } = useAuth();
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await signIn(email, password);
    if (user) {
      login(user);
      navigate("/index");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back — please enter your credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Email</span>
                <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-slate-300">Password</span>
                <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">
                  <Lock className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              {error && (
                <div className="rounded-lg border border-rose-700/50 bg-rose-900/30 px-3 py-2 text-sm text-rose-200">
                  {String(error)}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-400">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
