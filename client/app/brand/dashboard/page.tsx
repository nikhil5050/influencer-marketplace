// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/lib/auth-context";
// import { brandApi } from "@/lib/api";
// import { Navbar } from "@/components/navbar";
// import { Briefcase, Plus, ArrowRight, Loader2, Search } from "lucide-react";
// import { getStatusColor, timeAgo, formatPrice } from "@/lib/utils";
// import { cn } from "@/lib/utils";

// interface Campaign {
//   id: string;
//   title: string;
//   brief: string;
//   budget: number;
//   status: string;
//   createdAt: string;
//   influencer?: { id: string; name: string };
// }

// export default function BrandDashboard() {
//   const { user, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreate, setShowCreate] = useState(false);
//   const [form, setForm] = useState({ title: "", brief: "", budget: "" });
//   const [creating, setCreating] = useState(false);

//   useEffect(() => {
//     if (!authLoading && (!user || user.role !== "BRAND")) {
//       router.push("/login");
//       return;
//     }
//     if (user?.role === "BRAND") {
//       brandApi
//         .campaigns()
//         .then((res) => setCampaigns(res.data.campaigns))
//         .finally(() => setLoading(false));
//     }
//   }, [user, authLoading, router]);

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setCreating(true);
//     try {
//       await brandApi.createCampaign({
//         title: form.title,
//         brief: form.brief,
//         budget: parseInt(form.budget) || 0,
//       });
//       const res = await brandApi.campaigns();
//       setCampaigns(res.data.campaigns);
//       setShowCreate(false);
//       setForm({ title: "", brief: "", budget: "" });
//     } finally {
//       setCreating(false);
//     }
//   };

//   if (authLoading || !user) return null;

//   return (
//     <div className="min-h-screen bg-cream">
//       <Navbar />
//       <div className="max-w-6xl mx-auto px-4 py-10">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-ink">Brand Dashboard</h1>
//             <p className="text-stone-500 mt-1">Welcome back, {user.name}</p>
//           </div>
//           <div className="flex gap-3">
//             <Link
//               href="/marketplace"
//               className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-2xl font-medium text-sm hover:border-orange-300 transition-all"
//             >
//               <Search size={15} /> Find Creators
//             </Link>
//             <button
//               onClick={() => setShowCreate(true)}
//               className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-2xl font-medium text-sm hover:bg-orange-700 transition-all"
//             >
//               <Plus size={15} /> New Campaign
//             </button>
//           </div>
//         </div>

//         {/* Stats row */}
//         <div className="grid grid-cols-3 gap-5 mb-8">
//           {[
//             {
//               label: "Total Campaigns",
//               value: campaigns.length,
//               icon: Briefcase,
//             },
//             {
//               label: "Active",
//               value: campaigns.filter((c) => c.status === "active").length,
//               icon: ArrowRight,
//             },
//             {
//               label: "Total Budget",
//               value: `₹${campaigns.reduce((a, c) => a + (c.budget || 0), 0).toLocaleString()}`,
//               icon: Briefcase,
//             },
//           ].map((s) => (
//             <div
//               key={s.label}
//               className="bg-white rounded-3xl border border-stone-100 p-6"
//             >
//               <div className="text-3xl font-bold text-ink mb-1">{s.value}</div>
//               <div className="text-sm text-stone-500">{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* Create modal */}
//         {showCreate && (
//           <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
//               <h2 className="text-xl font-bold text-ink mb-6">
//                 Create Campaign
//               </h2>
//               <form onSubmit={handleCreate} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-1.5">
//                     Campaign Title *
//                   </label>
//                   <input
//                     value={form.title}
//                     onChange={(e) =>
//                       setForm({ ...form, title: e.target.value })
//                     }
//                     required
//                     placeholder="e.g. Summer Collection Launch"
//                     className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-1.5">
//                     Campaign Brief
//                   </label>
//                   <textarea
//                     value={form.brief}
//                     onChange={(e) =>
//                       setForm({ ...form, brief: e.target.value })
//                     }
//                     rows={3}
//                     placeholder="Describe what you're looking for..."
//                     className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-1.5">
//                     Budget (₹)
//                   </label>
//                   <input
//                     type="number"
//                     value={form.budget}
//                     onChange={(e) =>
//                       setForm({ ...form, budget: e.target.value })
//                     }
//                     placeholder="e.g. 50000"
//                     className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
//                   />
//                 </div>
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setShowCreate(false)}
//                     className="flex-1 py-3 rounded-2xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={creating}
//                     className="flex-1 py-3 rounded-2xl bg-orange-600 text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
//                   >
//                     {creating ? (
//                       <Loader2 size={16} className="animate-spin" />
//                     ) : null}
//                     Create
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Campaigns list */}
//         <div className="bg-white rounded-3xl border border-stone-100">
//           <div className="p-6 border-b border-stone-100 flex items-center justify-between">
//             <h2 className="font-bold text-ink text-lg">My Campaigns</h2>
//             <span className="text-sm text-stone-400">
//               {campaigns.length} total
//             </span>
//           </div>
//           {loading ? (
//             <div className="p-12 flex justify-center">
//               <Loader2 size={24} className="animate-spin text-orange-500" />
//             </div>
//           ) : campaigns.length === 0 ? (
//             <div className="p-16 text-center">
//               <Briefcase size={40} className="text-stone-200 mx-auto mb-4" />
//               <p className="text-stone-500 mb-4">
//                 No campaigns yet. Create your first one!
//               </p>
//               <button
//                 onClick={() => setShowCreate(true)}
//                 className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-medium text-sm"
//               >
//                 <Plus size={15} /> Create Campaign
//               </button>
//             </div>
//           ) : (
//             <div className="divide-y divide-stone-50">
//               {campaigns.map((c) => (
//                 <div
//                   key={c.id}
//                   className="flex items-center gap-4 px-6 py-5 hover:bg-stone-50/50 transition-colors"
//                 >
//                   <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
//                     <Briefcase size={16} className="text-orange-600" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-semibold text-ink">{c.title}</p>
//                     {c.brief && (
//                       <p className="text-xs text-stone-500 truncate mt-0.5">
//                         {c.brief}
//                       </p>
//                     )}
//                     {c.influencer && (
//                       <p className="text-xs text-orange-600 mt-0.5">
//                         Creator: {c.influencer.name}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-3">
//                     {c.budget > 0 && (
//                       <span className="text-sm font-semibold text-ink">
//                         {formatPrice(c.budget)}
//                       </span>
//                     )}
//                     <span
//                       className={cn(
//                         "text-xs font-semibold px-2.5 py-1 rounded-full border",
//                         getStatusColor(c.status),
//                       )}
//                     >
//                       {c.status}
//                     </span>
//                     <span className="text-xs text-stone-400">
//                       {timeAgo(c.createdAt)}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { brandApi, requestApi } from "@/lib/api";

import {
  Briefcase,
  Plus,
  Search,
  Loader2,
  Bell,
  BellDot,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Building2,
  MapPin,
  IndianRupee,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { getStatusColor, timeAgo, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CampaignRequest {
  id: string;
  campaignTitle: string;
  businessName: string;
  businessType: string;
  location: string;
  budget: number;
  status: "pending" | "accepted" | "rejected" | "completed";
  deliverables: string[];
  startDate: string;
  endDate: string;
  message: string;
  influencerName: string;
  influencerNote?: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    label: "Awaiting Response",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  accepted: {
    icon: CheckCircle2,
    label: "Accepted 🎉",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  rejected: {
    icon: XCircle,
    label: "Declined",
    color: "text-red-600 bg-red-50 border-red-200",
  },
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    color: "text-violet-600 bg-violet-50 border-violet-200",
  },
};

export default function BrandDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [showNotifs, setShowNotifs] = useState(false);
  const [selected, setSelected] = useState<CampaignRequest | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [reqRes, notifRes] = await Promise.all([
        requestApi.brandRequests(),
        requestApi.notifications(),
      ]);
      setRequests(reqRes.data.requests);
      setNotifications(notifRes.data.notifications);
      setUnread(notifRes.data.unread);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "BRAND")) {
      router.push("/login");
      return;
    }
    if (user?.role === "BRAND") fetchData();
  }, [user, authLoading, router, fetchData]);

  const markAllRead = async () => {
    await requestApi.markAllRead();
    setUnread(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = requests.filter(
    (r) => activeTab === "all" || r.status === activeTab,
  );

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-cream">
      
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ink">Brand Dashboard</h1>
            <p className="text-stone-500 mt-1">Welcome back, {user.name} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifs(!showNotifs);
                  if (unread > 0) markAllRead();
                }}
                className="relative w-11 h-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center hover:border-orange-300 transition-all"
              >
                {unread > 0 ? (
                  <BellDot size={20} className="text-orange-600" />
                ) : (
                  <Bell size={20} className="text-stone-500" />
                )}
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-stone-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                    <h3 className="font-bold text-stone-900 text-sm">
                      Notifications
                    </h3>
                    <button
                      onClick={markAllRead}
                      className="text-xs text-orange-600 font-medium hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-8 text-center text-stone-400 text-sm">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            "px-5 py-4 border-b border-stone-50 last:border-0",
                            !n.read && "bg-orange-50/50",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                                n.read ? "bg-stone-200" : "bg-orange-500",
                              )}
                            />
                            <div>
                              <p className="text-sm font-semibold text-stone-900">
                                {n.title}
                              </p>
                              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                                {n.message}
                              </p>
                              <p className="text-[10px] text-stone-400 mt-1">
                                {timeAgo(n.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={fetchData}
              className="w-11 h-11 rounded-2xl bg-white border border-stone-200 flex items-center justify-center hover:border-orange-300 transition-all"
              title="Refresh"
            >
              <RefreshCw size={17} className="text-stone-500" />
            </button>

            <Link
              href="/marketplace"
              className="flex items-center gap-2 bg-white border border-stone-200 text-stone-700 px-4 py-2.5 rounded-2xl font-medium text-sm hover:border-orange-300 transition-all"
            >
              <Search size={15} /> Find Creators
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Requests",
              value: stats.total,
              color: "text-stone-800",
              bg: "bg-white",
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "text-amber-700",
              bg: "bg-amber-50",
            },
            {
              label: "Accepted",
              value: stats.accepted,
              color: "text-emerald-700",
              bg: "bg-emerald-50",
            },
            {
              label: "Declined",
              value: stats.rejected,
              color: "text-red-700",
              bg: "bg-red-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} rounded-3xl border border-stone-100 p-5`}
            >
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-stone-500 mt-1 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["all", "pending", "accepted", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all",
                activeTab === tab
                  ? "bg-orange-600 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-orange-300",
              )}
            >
              {tab} {tab !== "all" && `(${stats[tab]})`}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* List */}
          <div className="space-y-3">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-white rounded-3xl border border-stone-100 shimmer"
                />
              ))
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-stone-200 p-16 text-center">
                <Briefcase size={36} className="text-stone-200 mx-auto mb-4" />
                <p className="text-stone-400 mb-4">
                  {activeTab === "all"
                    ? "No campaign requests yet. Browse creators and send your first request!"
                    : `No ${activeTab} requests.`}
                </p>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm hover:bg-orange-700 transition-all"
                >
                  <Search size={15} /> Browse Creators
                </Link>
              </div>
            ) : (
              filtered.map((req) => {
                const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelected(req)}
                    className={cn(
                      "w-full text-left bg-white rounded-3xl border p-5 transition-all hover:shadow-md",
                      selected?.id === req.id
                        ? "border-orange-400 shadow-md"
                        : "border-stone-100",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-stone-900 text-sm">
                            {req.campaignTitle}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1",
                              cfg.color,
                            )}
                          >
                            <StatusIcon size={10} /> {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mb-2">
                          To: <strong>{req.influencerName}</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-stone-400">
                          <span className="flex items-center gap-1">
                            <Building2 size={10} /> {req.businessName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={10} /> {req.startDate?.slice(0, 10)}{" "}
                            → {req.endDate?.slice(0, 10)}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee size={10} /> {formatPrice(req.budget)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-stone-400 whitespace-nowrap">
                          {timeAgo(req.createdAt)}
                        </span>
                        <ChevronRight size={14} className="text-stone-300" />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="bg-white rounded-3xl border border-stone-100 p-6 space-y-5 sticky top-8 self-start">
              {/* Status */}
              <div
                className={cn(
                  "rounded-2xl p-4 border flex items-center gap-3",
                  STATUS_CONFIG[selected.status]?.color,
                )}
              >
                {(() => {
                  const Ic = STATUS_CONFIG[selected.status]?.icon || Clock;
                  return <Ic size={20} />;
                })()}
                <div>
                  <p className="font-bold text-sm">
                    {STATUS_CONFIG[selected.status]?.label}
                  </p>
                  {selected.status === "pending" && (
                    <p className="text-xs opacity-70">
                      Waiting for creator to respond
                    </p>
                  )}
                  {selected.status === "accepted" && (
                    <p className="text-xs opacity-70">
                      🎉 Great! The creator accepted your request.
                    </p>
                  )}
                  {selected.status === "rejected" &&
                    selected.influencerNote && (
                      <p className="text-xs opacity-70">
                        Note: {selected.influencerNote}
                      </p>
                    )}
                </div>
              </div>

              <div>
                <h3 className="font-black text-stone-900 text-xl mb-1">
                  {selected.campaignTitle}
                </h3>
                <p className="text-sm text-stone-500">
                  Sent to <strong>{selected.influencerName}</strong> ·{" "}
                  {timeAgo(selected.createdAt)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  {
                    icon: <Building2 size={13} />,
                    label: "Business",
                    val: selected.businessName,
                  },
                  {
                    icon: <Briefcase size={13} />,
                    label: "Industry",
                    val: selected.businessType,
                  },
                  {
                    icon: <MapPin size={13} />,
                    label: "Location",
                    val: selected.location,
                  },
                  {
                    icon: <IndianRupee size={13} />,
                    label: "Budget",
                    val: `₹${selected.budget?.toLocaleString()}`,
                  },
                  {
                    icon: <Calendar size={13} />,
                    label: "Start",
                    val: selected.startDate?.slice(0, 10),
                  },
                  {
                    icon: <Calendar size={13} />,
                    label: "End",
                    val: selected.endDate?.slice(0, 10),
                  },
                ].map(({ icon, label, val }) => (
                  <div
                    key={label}
                    className="bg-stone-50 rounded-2xl p-3 flex items-start gap-2"
                  >
                    <div className="text-orange-500 mt-0.5">{icon}</div>
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wide">
                        {label}
                      </p>
                      <p className="font-semibold text-stone-800 text-xs leading-tight">
                        {val}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Deliverables
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.deliverables?.map((d) => (
                    <span
                      key={d}
                      className="text-xs bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full font-semibold"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Your Brief
                </p>
                <div className="bg-stone-50 rounded-2xl p-4 text-sm text-stone-700 leading-relaxed border border-stone-100">
                  {selected.message}
                </div>
              </div>

              {selected.influencerNote && selected.status !== "pending" && (
                <div>
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                    Creator&apos;s Note
                  </p>
                  <div
                    className={cn(
                      "rounded-2xl p-4 text-sm leading-relaxed border",
                      STATUS_CONFIG[selected.status]?.color,
                    )}
                  >
                    {selected.influencerNote}
                  </div>
                </div>
              )}

              <Link
                href="/marketplace"
                className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-orange-700 transition-all"
              >
                <Search size={15} /> Find More Creators
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-stone-200 p-12 text-center hidden lg:flex flex-col items-center justify-center">
              <Briefcase size={32} className="text-stone-200 mb-3" />
              <p className="text-stone-400 text-sm">
                Select a request to see details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
