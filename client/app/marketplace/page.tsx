"use client";

import { useEffect, useState } from "react";
import { influencerApi } from "@/lib/api";
import { InfluencerCard } from "@/components/influencer-card";
import { Footer } from "@/components/footer";
import { Loader2, Search, Filter } from "lucide-react";

interface Influencer {
  id: string;
  name: string;
  bio: string;
  niche: string[];
  followers: number;
  engagementRate: number;
  location?: string;
  prices: { post: number; story: number; reel: number };
  socialLinks?: { instagram?: string; youtube?: string };
  avatar?: string;
  mediaUrls?: string[];
  coverPhoto?: string;
}

const NICHES = [
  "Fashion",
  "Tech",
  "Food",
  "Travel",
  "Fitness",
  "Beauty",
  "Finance",
  "Gaming",
];

export default function MarketplacePage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("");

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const res = await influencerApi.publicList({ search, niche: nicheFilter });
      setInfluencers(res.data.influencers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Basic debounce for search
    const timer = setTimeout(() => {
      fetchInfluencers();
    }, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, nicheFilter]);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 mt-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">Creator Marketplace</h1>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover and collaborate with verified influencers across India. Filter by category, reach, and engagement.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center bg-white p-4 md:p-2 rounded-2xl md:rounded-full shadow-sm border border-stone-200">
          <div className="relative w-full md:w-96 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or bio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-stone-50 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="text-stone-400 ml-2" size={16} />
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest mr-2 hidden md:inline-block">Filters</span>
            {["All", ...NICHES].map((cat) => (
              <button
                key={cat}
                onClick={() => setNicheFilter(cat === "All" ? "" : cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border
                  ${
                    (nicheFilter === cat || (cat === "All" && !nicheFilter))
                      ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700 shadow-sm"
                      : "bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-700"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 size={40} className="animate-spin text-orange-500" />
            <p className="text-stone-500 font-medium">Finding the right creators...</p>
          </div>
        ) : influencers.length === 0 ? (
          <div className="text-center py-32 bg-white border border-stone-200 rounded-3xl shadow-sm">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-ink mb-2">No creators found</h3>
            <p className="text-stone-500">Try adjusting your filters or search term.</p>
            {(search || nicheFilter) && (
              <button
                onClick={() => {
                  setSearch("");
                  setNicheFilter("");
                }}
                className="mt-6 text-sm font-medium text-orange-600 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {influencers.map((inf) => (
              <InfluencerCard key={inf.id} inf={inf} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
