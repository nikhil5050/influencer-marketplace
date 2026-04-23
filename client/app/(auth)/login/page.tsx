"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      // Redirect based on role (auth context handles token, page reloads to get user)
      window.location.href = "/";
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-ink p-12 text-white">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          Influence<span className="text-orange-500">Hub</span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Welcome back to
            <br />
            <span className="text-orange-500">India's creator economy</span>
          </h2>
          <p className="text-stone-400 text-lg">
            Sign in to manage your campaigns, discover creators, and grow your
            brand.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { v: "10K+", l: "Creators" },
            { v: "500+", l: "Brands" },
            { v: "₹50Cr+", l: "Executed" },
            { v: "98%", l: "Satisfaction" },
          ].map((s) => (
            <div key={s.l} className="bg-white/5 rounded-2xl p-4">
              <div className="text-2xl font-bold text-orange-400">{s.v}</div>
              <div className="text-stone-400 text-sm">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-ink"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              Influence<span className="text-orange-600">Hub</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-ink mb-2">Sign in</h1>
          <p className="text-stone-500 mb-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-orange-600 font-medium hover:underline"
            >
              Register free
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-white text-ink placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-stone-700">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs text-orange-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-stone-200 bg-white text-ink placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3.5 rounded-2xl font-semibold text-base hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
            <p className="text-xs font-semibold text-orange-700 mb-2">
              Demo Credentials
            </p>
            <div className="space-y-1 text-xs text-stone-600 font-mono">
              <div>Admin: admin@influencehub.in / admin123</div>
              <div>Brand: brand@demo.in / demo123</div>
              <div>Creator: creator@demo.in / demo123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
