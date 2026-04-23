"use client";

import Link from "next/link";
import {
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Footer } from "@/components/footer";
import Hero from "@/components/Hero";
import OffersSection from "@/components/OffersSection";

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
];

const STATS = [
  { value: "10,000+", label: "Verified Influencers" },
  { value: "500+", label: "Brand Partners" },
  { value: "₹50Cr+", label: "Campaigns Executed" },
  { value: "98%", label: "Satisfaction Rate" },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Verified Creators",
    desc: "Every influencer is manually reviewed and approved by our team before appearing on the platform.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Real Analytics",
    desc: "See actual engagement rates, follower counts, and campaign performance data, not estimates.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Zap,
    title: "Instant Matching",
    desc: "Our smart algorithm matches your brand with the most relevant creators in seconds.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Globe,
    title: "Pan-India Reach",
    desc: "Access creators from metros to Tier-2 cities. Regional, Hindi, English — every language.",
    color: "bg-violet-50 text-violet-600",
  },
];

export default function HomePage() {
  return (
    <div>
     <Hero />
      {/* Niche Bubbles */}
      <section className="py-16 px-4 bg-white border-y border-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold text-orange-600 tracking-widest uppercase mb-6">
            Browse by Category
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {NICHES.map((niche) => (
              <Link
                key={niche}
                href={`/marketplace?niche=${niche.toLowerCase()}`}
                className="px-5 py-2.5 rounded-full bg-cream border border-stone-200 text-stone-700 font-medium hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all text-sm"
              >
                {niche}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <OffersSection />

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-orange-600 tracking-widest uppercase mb-3">
              Why InfluenceHub
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-ink">
              Built for the Indian market
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-3xl p-7 border border-stone-100 card-hover"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center mb-5`}
                >
                  <f.icon size={22} />
                </div>
                <h3 className="font-bold text-ink text-lg mb-2">{f.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-ink rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill="#f97316"
                    className="text-orange-500"
                  />
                ))}
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to grow your brand?
              </h2>
              <p className="text-stone-400 text-lg mb-8 max-w-xl mx-auto">
                Join 500+ brands already collaborating with India's top creators
                on InfluenceHub.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/register?role=brand"
                  className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-orange-500 transition-all"
                >
                  Start for Free
                </Link>
                <Link
                  href="/marketplace"
                  className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all"
                >
                  Explore Creators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
