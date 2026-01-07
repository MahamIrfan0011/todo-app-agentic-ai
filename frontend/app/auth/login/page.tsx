"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.token);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-slate-50">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-slate-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="new-password"
              key="email-input"
            />          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
              Password
            </label>
            <input
              type="text"
              onFocus={(e) => e.target.type = 'password'}
              id="password"
              className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-slate-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              key="password-input"
            />          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-lg shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-slate-400">
          Don't have an account?{" "}
          <Link href="/auth/register" className="font-medium text-teal-400 hover:text-teal-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}