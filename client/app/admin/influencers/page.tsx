"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { Check, X, Eye, Loader2, ChevronDown } from "lucide-react";
import {
  formatFollowers,
  formatPrice,
  getNicheEmoji,
  getStatusColor,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Influencer {
  id: string;
  name: string;
  bio: string;
  niche: string[];
  followers: number;
  engagementRate: number;
  location?: string;
  prices: { post: number; story: number; reel: number };
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  userEmail?: string;
  createdAt: string;
  socialLinks?: { instagram?: string; youtube?: string };
}

export default function AdminInfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("pending");
  const [selected, setSelected] = useState<Influencer | null>(null);
  const [notes, setNotes] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchInfluencers = async (status = activeStatus) => {
    setLoading(true);
    try {
      const res = await adminApi.pendingInfluencers(status);
      setInfluencers(res.data.influencers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, [activeStatus]);

  const handleApprove = async (id: string) => {
    setActionLoading(id + "-approve");
    try {
      await adminApi.approve(id, notes);
      setSelected(null);
      fetchInfluencers();
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + "-reject");
    try {
      await adminApi.reject(id, notes);
      setSelected(null);
      fetchInfluencers();
    } finally {
      setActionLoading("");
    }
  };

  const tabs = ["pending", "approved", "rejected"];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">Influencer Approvals</h1>
        <p className="text-stone-500 mt-1">
          Review and manage creator registrations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveStatus(tab);
              setSelected(null);
            }}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all",
              activeStatus === tab
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-white text-stone-600 border border-stone-200 hover:border-orange-300",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-3">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-2xl border border-stone-100 shimmer"
              />
            ))
          ) : influencers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-stone-500">No {activeStatus} influencers</p>
            </div>
          ) : (
            influencers.map((inf) => (
              <button
                key={inf.id}
                onClick={() => {
                  setSelected(inf);
                  setNotes("");
                }}
                className={cn(
                  "w-full text-left bg-white rounded-2xl border p-5 transition-all hover:shadow-md",
                  selected?.id === inf.id
                    ? "border-orange-400 shadow-md"
                    : "border-stone-100",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-ink">{inf.name}</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium",
                          getStatusColor(inf.status),
                        )}
                      >
                        {inf.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mb-2">
                      {inf.userEmail}
                    </p>
                    <div className="flex gap-3 text-xs text-stone-500">
                      <span>{formatFollowers(inf.followers)} followers</span>
                      <span>{inf.engagementRate}% eng.</span>
                      <span>from {formatPrice(inf.prices?.post || 0)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {inf.niche.slice(0, 3).map((n) => (
                        <span
                          key={n}
                          className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full"
                        >
                          {getNicheEmoji(n)} {n}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Eye
                    size={16}
                    className="text-stone-300 flex-shrink-0 mt-1"
                  />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="bg-white rounded-3xl border border-stone-100 p-6 space-y-5 sticky top-8 self-start">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-ink text-xl">{selected.name}</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-stone-400 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Email
              </p>
              <p className="text-sm text-stone-700">{selected.userEmail}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Bio
              </p>
              <p className="text-sm text-stone-700 leading-relaxed">
                {selected.bio || "No bio provided"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-stone-50 rounded-2xl p-3 text-center">
                <div className="font-bold text-ink">
                  {formatFollowers(selected.followers)}
                </div>
                <div className="text-xs text-stone-500">Followers</div>
              </div>
              <div className="bg-stone-50 rounded-2xl p-3 text-center">
                <div className="font-bold text-ink">
                  {selected.engagementRate}%
                </div>
                <div className="text-xs text-stone-500">Engagement</div>
              </div>
              <div className="bg-stone-50 rounded-2xl p-3 text-center">
                <div className="font-bold text-ink">
                  {formatPrice(selected.prices?.post || 0)}
                </div>
                <div className="text-xs text-stone-500">Per Post</div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Niches
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selected.niche.map((n) => (
                  <span
                    key={n}
                    className="text-sm bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-full"
                  >
                    {getNicheEmoji(n)} {n}
                  </span>
                ))}
              </div>
            </div>

            {selected.socialLinks && (
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Social Links
                </p>
                <div className="space-y-1 text-sm">
                  {selected.socialLinks.instagram && (
                    <p className="text-stone-600">
                      📸 @{selected.socialLinks.instagram}
                    </p>
                  )}
                  {selected.socialLinks.youtube && (
                    <p className="text-stone-600">
                      📺 {selected.socialLinks.youtube}
                    </p>
                  )}
                </div>
              </div>
            )}

            {selected.status === "pending" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Admin Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Add notes for the creator..."
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selected.id)}
                    disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-emerald-700 transition-all disabled:opacity-60"
                  >
                    {actionLoading === selected.id + "-approve" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selected.id)}
                    disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-red-700 transition-all disabled:opacity-60"
                  >
                    {actionLoading === selected.id + "-reject" ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                    Reject
                  </button>
                </div>
              </>
            )}

            {selected.status !== "pending" && (
              <div
                className={cn(
                  "rounded-2xl p-4 border text-sm",
                  getStatusColor(selected.status),
                )}
              >
                <p className="font-semibold capitalize mb-1">
                  {selected.status}
                </p>
                {selected.adminNotes && (
                  <p className="opacity-80">{selected.adminNotes}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-stone-200 p-12 text-center flex flex-col items-center justify-center">
            <Eye size={32} className="text-stone-300 mb-3" />
            <p className="text-stone-400 text-sm">
              Select a creator to review their profile
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
