"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  // SAFE redirect check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If token + role → redirect
    if (token && role) {
      router.push("/dashboard");
    }

    // Release page rendering
    setCheckingAuth(false);
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);

        if (data?.user?.role) {
          localStorage.setItem("role", data.user.role);
        } else {
          localStorage.removeItem("role"); // ✨ avoid redirect loop
        }

        router.push("/dashboard");
      } else {
        setError("No token received");
      }
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500 text-xl">
        Checking login...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Trustify
        </h1>

        <form onSubmit={handleLogin} className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Id
            </label>
            <input
              type="email"
              placeholder="Enter your Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-xl border border-gray-300"
            />
          </div>

          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-xl"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
