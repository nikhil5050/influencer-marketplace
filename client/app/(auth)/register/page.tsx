"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import Cookies from "js-cookie";
import {
  Sparkles,
  Loader2,
  Building2,
  User,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const NICHES = [
  "Fashion",
  "Tech",
  "Food",
  "Travel",
  "Fitness",
  "Beauty",
  "Finance",
  "Gaming",
  "Lifestyle",
  "Education",
  "Comedy",
  "Music",
  "Photography",
  "Parenting",
  "Sports",
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role")?.toUpperCase() || "BRAND";

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"BRAND" | "INFLUENCER" | "ADMIN">(
    defaultRole as "BRAND" | "INFLUENCER",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Influencer extra fields
  const [bio, setBio] = useState("");
  const [niche, setNiche] = useState<string[]>([]);
  const [followers, setFollowers] = useState("");
  const [engagementRate, setEngagementRate] = useState("");
  const [location, setLocation] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [pricePost, setPricePost] = useState("");
  const [priceStory, setPriceStory] = useState("");
  const [priceReel, setPriceReel] = useState("");

  // Brand extra fields
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");

  const toggleNiche = (n: string) =>
    setNiche((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: Record<string, unknown> = { name, email, password, role };

      if (role === "INFLUENCER") {
        payload.influencerProfile = {
          bio,
          niche,
          followers: parseInt(followers) || 0,
          engagementRate: parseFloat(engagementRate) || 0,
          location,
          socialLinks: { instagram, youtube },
          prices: {
            post: parseInt(pricePost) || 0,
            story: parseInt(priceStory) || 0,
            reel: parseInt(priceReel) || 0,
          },
        };
      }

      if (role === "BRAND") {
        payload.brandProfile = { companyName: companyName || name, industry };
      }

      const res = await authApi.register(payload);
      Cookies.set("auth_token", res.data.token, { expires: 1 });

      const roleRedirect =
        role === "ADMIN"
          ? "/admin"
          : role === "BRAND"
            ? "/brand/dashboard"
            : "/influencer/dashboard";
      window.location.href = roleRedirect;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(
        axiosErr.response?.data?.error ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "BRAND",
      icon: Building2,
      title: "Brand / Business",
      desc: "I want to collaborate with influencers",
    },
    {
      value: "INFLUENCER",
      icon: User,
      title: "Content Creator",
      desc: "I want to partner with brands",
    },
    {
      value: "ADMIN",
      icon: ShieldCheck,
      title: "Admin",
      desc: "Platform administrator",
    },
  ];

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-2xl text-ink mb-4"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            Influence<span className="text-orange-600">Hub</span>
          </Link>
          <h1 className="text-3xl font-bold text-ink">Create your account</h1>
          <p className="text-stone-500 mt-2">
            Already have one?{" "}
            <Link
              href="/login"
              className="text-orange-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step >= s ? "bg-orange-600 text-white" : "bg-stone-100 text-stone-400"}`}
                >
                  {s}
                </div>
                {s < 2 && (
                  <div
                    className={`h-0.5 flex-1 ${step > s ? "bg-orange-600" : "bg-stone-100"}`}
                  />
                )}
              </div>
            ))}
            <div className="text-sm text-stone-500 whitespace-nowrap">
              {step === 1 ? "Account type" : "Your details"}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-stone-600 mb-4">
                I am joining as...
              </p>
              {roles.map(({ value, icon: Icon, title, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value as typeof role)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all
                    ${role === value ? "border-orange-500 bg-orange-50" : "border-stone-200 hover:border-stone-300"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === value ? "bg-orange-100" : "bg-stone-100"}`}
                  >
                    <Icon
                      size={18}
                      className={
                        role === value ? "text-orange-600" : "text-stone-500"
                      }
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-ink text-sm">
                      {title}
                    </div>
                    <div className="text-stone-500 text-xs">{desc}</div>
                  </div>
                  {role === value && (
                    <div className="ml-auto w-5 h-5 rounded-full bg-orange-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
              <button
                onClick={() => setStep(2)}
                className="w-full bg-orange-600 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all mt-2"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-stone-500 text-sm hover:text-ink mb-2"
              >
                <ChevronLeft size={16} /> Back
              </button>

              {/* Common fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Priya Sharma"
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="priya@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  />
                </div>
              </div>

              {/* Brand extra */}
              {role === "BRAND" && (
                <div className="space-y-4 border-t border-stone-100 pt-4">
                  <p className="text-sm font-semibold text-stone-600">
                    Brand Details
                  </p>
                  <input
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company / Brand Name"
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  />
                  <input
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Industry (e.g. FMCG, SaaS, Fashion)"
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                  />
                </div>
              )}

              {/* Influencer extra */}
              {role === "INFLUENCER" && (
                <div className="space-y-4 border-t border-stone-100 pt-4">
                  <p className="text-sm font-semibold text-stone-600">
                    Creator Profile
                  </p>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    placeholder="Tell brands about yourself..."
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
                  />
                  <div>
                    <p className="text-xs font-semibold text-stone-600 mb-2">
                      Niches (select all that apply)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {NICHES.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => toggleNiche(n)}
                          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all
                            ${niche.includes(n) ? "bg-orange-600 text-white border-orange-600" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-orange-300"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={followers}
                      onChange={(e) => setFollowers(e.target.value)}
                      type="number"
                      placeholder="Total followers"
                      className="px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                    <input
                      value={engagementRate}
                      onChange={(e) => setEngagementRate(e.target.value)}
                      type="number"
                      step="0.1"
                      placeholder="Engagement rate %"
                      className="px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City (e.g. Mumbai)"
                      className="px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                    <input
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Instagram handle"
                      className="px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                    <input
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="YouTube channel"
                      className="px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                    <input
                      value={pricePost}
                      onChange={(e) => setPricePost(e.target.value)}
                      type="number"
                      placeholder="Price per post (₹)"
                      className="px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                    <input
                      value={priceStory}
                      onChange={(e) => setPriceStory(e.target.value)}
                      type="number"
                      placeholder="Price per story (₹)"
                      className="px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                    <input
                      value={priceReel}
                      onChange={(e) => setPriceReel(e.target.value)}
                      type="number"
                      placeholder="Price per reel (₹)"
                      className="px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-700">
                    ⏳ Your profile will be reviewed by our admin team within
                    24–48 hours before appearing on the marketplace.
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-orange-600" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
