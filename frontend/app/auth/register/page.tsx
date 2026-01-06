"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Handle registration logic here
    console.log("Registration attempt with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-slate-50">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-slate-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-300">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="mt-1 block w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-slate-50"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-lg shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-teal-400 hover:text-teal-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
