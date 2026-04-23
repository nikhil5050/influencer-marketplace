import Link from "next/link";
import {
  Users,
  TrendingUp,
  Instagram,
  Youtube,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { formatFollowers, formatPrice, getNicheEmoji } from "@/lib/utils";

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

export function InfluencerCard({ inf }: { inf: Influencer }) {
  const avatarUrl =
    inf.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(inf.name)}&background=fed7aa&color=c2410c&bold=true&size=128`;

  return (
    <Link href={`/influencer/${inf.id}`}>
      <div className="group relative bg-white rounded-[2.5rem] border border-stone-100 p-3 pb-6 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(251,146,60,0.2)] hover:-translate-y-2 cursor-pointer">
        {/* Upper Image Section */}
        <div className="relative h-40 w-full overflow-hidden rounded-[2rem] bg-orange-50">
          {inf.coverPhoto ? (
            <img
              src={inf.coverPhoto}
              alt="cover"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : inf.mediaUrls && inf.mediaUrls[0] ? (
            <img
              src={inf.mediaUrls[0]}
              alt="cover"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50" />
          )}

          {/* Glassmorphism Niche Badges */}
          <div className="absolute top-3 left-3 flex gap-1">
            {inf.niche.slice(0, 1).map((n) => (
              <span
                key={n}
                className="bg-white/80 backdrop-blur-md text-stone-800 text-[10px] font-bold px-3 py-1 rounded-full border border-white/50 shadow-sm"
              >
                {getNicheEmoji(n)} {n.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Floating Price Tag */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-orange-600 text-white px-3 py-1.5 rounded-2xl shadow-lg flex flex-col items-end">
              <span className="text-[9px] opacity-80 font-medium leading-none">
                Starting from
              </span>
              <span className="text-sm font-bold leading-none mt-1">
                {formatPrice(inf.prices?.post || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-3 pt-12 relative">
          {/* Centered Overlapping Avatar */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <div className="relative p-1 bg-white rounded-3xl shadow-xl transition-transform duration-500 group-hover:rotate-3">
              <img
                src={avatarUrl}
                alt={inf.name}
                className="w-20 h-20 rounded-[1.25rem] object-cover"
              />
              <div
                className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"
                title="Available"
              />
            </div>
          </div>

          {/* Name & Bio */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-black text-stone-900 group-hover:text-orange-600 transition-colors flex items-center justify-center gap-1">
              {inf.name}
              <ArrowUpRight
                size={18}
                className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
              />
            </h3>
            {inf.location && (
              <div className="flex items-center justify-center gap-1 text-stone-400 text-xs mt-1">
                <MapPin size={12} className="text-orange-400" /> {inf.location}
              </div>
            )}
          </div>

          {/* Stats Grid - Structural Change */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="bg-stone-50 rounded-2xl p-3 text-center border border-transparent group-hover:border-orange-100 group-hover:bg-orange-50/30 transition-all">
              <div className="flex items-center justify-center gap-1.5 text-stone-900 font-black text-lg">
                <Users size={16} className="text-orange-500" />
                {formatFollowers(inf.followers)}
              </div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mt-0.5">
                Followers
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3 text-center border border-transparent group-hover:border-orange-100 group-hover:bg-orange-50/30 transition-all">
              <div className="flex items-center justify-center gap-1.5 text-stone-900 font-black text-lg">
                <TrendingUp size={16} className="text-orange-500" />
                {inf.engagementRate}%
              </div>
              <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mt-0.5">
                Engagement
              </p>
            </div>
          </div>

          {/* Footer: Socials & Bio */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-stone-500 text-[13px] line-clamp-1 italic italic">
              "{inf.bio}"
            </p>
            <div className="flex gap-1.5 shrink-0">
              {inf.socialLinks?.instagram && (
                <div className="p-2 rounded-xl bg-gradient-to-tr from-orange-50 to-amber-50 border border-orange-100">
                  <Instagram size={14} className="text-orange-600" />
                </div>
              )}
              {inf.socialLinks?.youtube && (
                <div className="p-2 rounded-xl bg-gradient-to-tr from-orange-50 to-amber-50 border border-orange-100">
                  <Youtube size={14} className="text-orange-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
