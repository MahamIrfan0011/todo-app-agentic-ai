"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Login Disabled</h1>
        <p className="text-center text-gray-700">Login functionality is currently disabled as per your request.</p>
        <p className="text-center text-gray-600">
          You can proceed to the <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">Task List</Link>.
        </p>
      </div>
    </div>
  );
}
