// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { influencerApi } from "@/lib/api";
// import { Navbar } from "@/components/navbar";
// import { formatFollowers, formatPrice, getNicheEmoji } from "@/lib/utils";
// import {
//   Users,
//   TrendingUp,
//   MapPin,
//   Instagram,
//   Youtube,
//   ArrowLeft,
//   ExternalLink,
//   Loader2,
//   MessageSquare,
//   Globe,
//   Award,
//   Zap,
// } from "lucide-react";
// import { useAuth } from "@/lib/auth-context";

// export default function InfluencerDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const { user } = useAuth();
//   const [influencer, setInfluencer] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   useEffect(() => {
//     influencerApi
//       .getById(id)
//       .then((res) => setInfluencer(res.data))
//       .catch(() => setNotFound(true))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading)
//     return (
//       <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
//         <Loader2 size={40} className="animate-spin text-orange-500" />
//       </div>
//     );

//   if (notFound || !influencer) {
//     return (
//       <div className="min-h-screen bg-[#FDFCFB]">
//         <Navbar />
//         <div className="max-w-2xl mx-auto px-4 py-24 text-center">
//           <div className="text-7xl mb-6">🏜️</div>
//           <h2 className="text-3xl font-black text-stone-900 mb-2">
//             Creator Missing
//           </h2>
//           <p className="text-stone-500 mb-8">
//             This oasis seems to have dried up or doesn't exist.
//           </p>
//           <Link
//             href="/marketplace"
//             className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
//           >
//             <ArrowLeft size={18} /> Back to Marketplace
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const avatarUrl =
//     influencer.avatar ||
//     `https://ui-avatars.com/api/?name=${encodeURIComponent(influencer.name)}&background=fed7aa&color=c2410c&bold=true&size=300`;

//   return (
//     <div className="min-h-screen bg-[#FDFCFB] pb-20">
//       <Navbar />

//       {/* --- HERO SECTION --- */}
//       <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
//         {influencer.mediaUrls?.[0] ? (
//           <img
//             src={influencer.mediaUrls[0]}
//             alt="cover"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100" />
//         )}
//         <div className="absolute inset-0 bg-black/20" />
//         <button
//           onClick={() => router.back()}
//           className="absolute top-8 left-8 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-stone-800 hover:bg-white transition-all shadow-xl"
//         >
//           <ArrowLeft size={16} /> Back
//         </button>
//       </div>

//       {/* --- CONTENT CONTAINER --- */}
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="relative -mt-32 z-10 grid lg:grid-cols-12 gap-8">
//           {/* LEFT COLUMN: Profile Info & Portfolio */}
//           <div className="lg:col-span-8 space-y-8">
//             {/* Header Card */}
//             <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 md:p-12 shadow-sm">
//               <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-10">
//                 <div className="relative p-1.5 bg-white rounded-[2.5rem] shadow-2xl -mt-20 md:-mt-32">
//                   <img
//                     src={avatarUrl}
//                     alt={influencer.name}
//                     className="w-40 h-40 md:w-52 md:h-52 rounded-[2.2rem] object-cover"
//                   />
//                   <div className="absolute bottom-4 right-4 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg" />
//                 </div>

//                 <div className="flex-1">
//                   <div className="flex flex-wrap items-center gap-3 mb-2">
//                     <h1 className="text-4xl font-black text-stone-900">
//                       {influencer.name}
//                     </h1>
//                     <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
//                       <Award size={12} /> Verified Creator
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-4 text-stone-400 font-medium text-sm">
//                     <span className="flex items-center gap-1">
//                       <MapPin size={14} className="text-orange-500" />{" "}
//                       {influencer.location || "Global"}
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Globe size={14} className="text-orange-500" /> English,
//                       Hindi, Marathi
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-2 mb-8">
//                 {influencer.niche.map((n: string) => (
//                   <span
//                     key={n}
//                     className="bg-stone-50 text-stone-700 border border-stone-100 px-4 py-2 rounded-2xl font-bold text-sm"
//                   >
//                     {getNicheEmoji(n)} {n}
//                   </span>
//                 ))}
//               </div>

//               <div className="prose prose-stone max-w-none">
//                 <p className="text-stone-600 text-lg leading-relaxed italic">
//                   "{influencer.bio}"
//                 </p>
//               </div>

//               {/* Stats Bar */}
//               <div className="grid grid-cols-3 gap-4 mt-12">
//                 {[
//                   {
//                     label: "Reach",
//                     val: formatFollowers(influencer.followers),
//                     icon: <Users size={18} />,
//                   },
//                   {
//                     label: "Engagement",
//                     val: `${influencer.engagementRate}%`,
//                     icon: <TrendingUp size={18} />,
//                   },
//                   {
//                     label: "Active Since",
//                     val: "2023",
//                     icon: <Zap size={18} />,
//                   },
//                 ].map((s, idx) => (
//                   <div
//                     key={idx}
//                     className="bg-stone-50 rounded-3xl p-5 border border-stone-100/50"
//                   >
//                     <div className="text-orange-500 mb-2">{s.icon}</div>
//                     <div className="text-xl font-black text-stone-900">
//                       {s.val}
//                     </div>
//                     <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
//                       {s.label}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Portfolio Masonry */}
//             {influencer.mediaUrls && influencer.mediaUrls.length > 0 && (
//               <div className="space-y-6">
//                 <h3 className="text-2xl font-black text-stone-900 px-4">
//                   Content Portfolio
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {influencer.mediaUrls.map((url: string, i: number) => (
//                     <div
//                       key={i}
//                       className={`overflow-hidden rounded-[2rem] group cursor-pointer ${i === 0 ? "col-span-2 row-span-2" : ""}`}
//                     >
//                       <img
//                         src={url}
//                         alt="work"
//                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* RIGHT COLUMN: Action & Sidebar */}
//           <div className="lg:col-span-4 space-y-6">
//             {/* Pricing Rate Card */}
//             <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white shadow-2xl sticky top-8">
//               <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
//                 <span className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs italic">
//                   Rate
//                 </span>
//                 Service Packages
//               </h3>

//               <div className="space-y-4 mb-8">
//                 {[
//                   {
//                     label: "Standard Feed Post",
//                     price: influencer.prices?.post,
//                   },
//                   {
//                     label: "Story (24h) + Link",
//                     price: influencer.prices?.story,
//                   },
//                   {
//                     label: "Short Video / Reel",
//                     price: influencer.prices?.reel,
//                   },
//                 ].map((p, idx) => (
//                   <div
//                     key={idx}
//                     className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10"
//                   >
//                     <span className="text-sm text-stone-400">{p.label}</span>
//                     <span className="font-black text-orange-400">
//                       {formatPrice(p.price || 0)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {user?.role === "BRAND" ? (
//                 <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black transition-all shadow-[0_10px_20px_-5px_rgba(234,88,12,0.5)] flex items-center justify-center gap-2 group">
//                   <MessageSquare size={20} /> START CAMPAIGN
//                 </button>
//               ) : !user ? (
//                 <Link
//                   href="/login"
//                   className="w-full bg-white text-stone-900 py-5 rounded-2xl font-black text-center block hover:bg-stone-100 transition-all"
//                 >
//                   Sign in to Unlock Rates
//                 </Link>
//               ) : (
//                 <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center text-xs text-stone-500">
//                   Switch to Brand account to collaborate
//                 </div>
//               )}

//               {/* Social Link Chips */}
//               <div className="mt-10 pt-8 border-t border-white/10">
//                 <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">
//                   Direct Channels
//                 </p>
//                 <div className="grid grid-cols-2 gap-3">
//                   {influencer.socialLinks?.instagram && (
//                     <a
//                       href="#"
//                       className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
//                     >
//                       <Instagram size={16} className="text-pink-400" />
//                       <span className="text-xs font-bold truncate">
//                         Instagram
//                       </span>
//                     </a>
//                   )}
//                   {influencer.socialLinks?.youtube && (
//                     <a
//                       href="#"
//                       className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
//                     >
//                       <Youtube size={16} className="text-red-400" />
//                       <span className="text-xs font-bold truncate">
//                         YouTube
//                       </span>
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { influencerApi, requestApi } from "@/lib/api";

import { formatFollowers, formatPrice, getNicheEmoji } from "@/lib/utils";
import {
  Users,
  TrendingUp,
  MapPin,
  Instagram,
  Youtube,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Globe,
  Award,
  Zap,
  X,
  CheckCircle2,
  Calendar,
  Building2,
  IndianRupee,
  FileText,
  ChevronRight,
  Briefcase,
  Clock,
  AlertCircle,
  Phone,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// ─── Types ────────────────────────────────────────────────────
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

const DELIVERABLES = [
  "Instagram Post",
  "Instagram Story",
  "Instagram Reel",
  "YouTube Video",
  "YouTube Shorts",
  "Blog Post",
  "Twitter/X Thread",
];
const BUSINESS_TYPES = [
  "FMCG / Consumer Goods",
  "Fashion & Apparel",
  "Food & Beverage",
  "Technology / SaaS",
  "Health & Wellness",
  "Finance / FinTech",
  "Education / EdTech",
  "Travel & Hospitality",
  "Real Estate",
  "Automobile",
  "E-commerce",
  "Entertainment",
  "Other",
];
const STEPS = ["Business Info", "Campaign Details", "Dates & Budget", "Review"];

export default function InfluencerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Form fields — Step 0
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Step 1
  const [campaignTitle, setCampaignTitle] = useState("");
  const [message, setMessage] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  // Step 2
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    influencerApi
      .getById(id)
      .then((res) => setInfluencer(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleDeliverable = (d: string) =>
    setDeliverables((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );

  const openModal = () => {
    setShowModal(true);
    setStep(0);
    setSubmitted(false);
    setSubmitError("");
  };
  const closeModal = () => {
    setShowModal(false);
    setStep(0);
    setSubmitted(false);
    setSubmitError("");
  };

  const canNext = () => {
    if (step === 0) return !!(businessName && businessType && location && phoneNumber);
    if (step === 1)
      return !!(campaignTitle && message && deliverables.length > 0);
    if (step === 2) return !!startDate;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await requestApi.create({
        influencerId: id,
        campaignTitle,
        businessName,
        businessType,
        location,
        website,
        phoneNumber,
        deliverables,
        message,
        budget: suggestedPrice,
        startDate,
        endDate: startDate,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { error?: string; conflict?: boolean } };
      };
      if (e.response?.data?.conflict) {
        setSubmitError(
          "⚠️ This influencer is already booked for overlapping dates. Please choose different dates.",
        );
      } else {
        setSubmitError(
          e.response?.data?.error ||
            "Failed to send request. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Suggested price from deliverables
  const suggestedPrice = deliverables.reduce((sum, d) => {
    if (d.includes("Post")) return sum + (influencer?.prices?.post || 0);
    if (d.includes("Story")) return sum + (influencer?.prices?.story || 0);
    if (d.includes("Reel") || d.includes("Short"))
      return sum + (influencer?.prices?.reel || 0);
    return sum + (influencer?.prices?.post || 0);
  }, 0);

  // ── Loading / Not Found ──────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-orange-500" />
      </div>
    );
  if (notFound || !influencer)
    return (
      <div className="min-h-screen bg-[#FDFCFB]">
       
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="text-7xl mb-6">🏜️</div>
          <h2 className="text-3xl font-black text-stone-900 mb-2">
            Creator Missing
          </h2>
          <p className="text-stone-500 mb-8">
            This profile doesn&apos;t exist or isn&apos;t approved yet.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold"
          >
            <ArrowLeft size={18} /> Back to Marketplace
          </Link>
        </div>
      </div>
    );

  const avatarUrl =
    influencer.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(influencer.name)}&background=fed7aa&color=c2410c&bold=true&size=300`;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20">
      

      {/* Hero */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        {influencer.coverPhoto ? (
          <img
            src={influencer.coverPhoto}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : influencer.mediaUrls?.[0] ? (
          <img
            src={influencer.mediaUrls[0]}
            alt="cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-orange-100 via-amber-50 to-orange-100" />
        )}
        <div className="absolute inset-0 bg-black/20" />
        <button
          onClick={() => router.back()}
          className="absolute top-8 left-8 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-stone-800 hover:bg-white transition-all shadow-xl"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative -mt-32 z-10 grid lg:grid-cols-12 gap-8">
          {/* LEFT: Profile */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-10">
                <div className="relative p-1.5 bg-white rounded-[2.5rem] shadow-2xl -mt-20 md:-mt-32">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt={influencer.name}
                    className="w-40 h-40 md:w-52 md:h-52 rounded-[2.2rem] object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black text-stone-900">
                      {influencer.name}
                    </h1>
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                      <Award size={12} /> Verified Creator
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-stone-400 font-medium text-sm flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-orange-500" />{" "}
                      {influencer.location || "India"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe size={14} className="text-orange-500" /> English,
                      Hindi
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {influencer.niche.map((n) => (
                  <span
                    key={n}
                    className="bg-stone-50 text-stone-700 border border-stone-100 px-4 py-2 rounded-2xl font-bold text-sm"
                  >
                    {getNicheEmoji(n)} {n}
                  </span>
                ))}
              </div>
              <p className="text-stone-600 text-lg leading-relaxed italic">
                &ldquo;{influencer.bio}&rdquo;
              </p>
              <div className="grid grid-cols-3 gap-4 mt-12">
                {[
                  {
                    label: "Reach",
                    val: formatFollowers(influencer.followers),
                    icon: <Users size={18} />,
                  },
                  {
                    label: "Engagement",
                    val: `${influencer.engagementRate}%`,
                    icon: <TrendingUp size={18} />,
                  },
                  {
                    label: "Creator Since",
                    val: "2023",
                    icon: <Zap size={18} />,
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-stone-50 rounded-3xl p-5 border border-stone-100/50"
                  >
                    <div className="text-orange-500 mb-2">{s.icon}</div>
                    <div className="text-xl font-black text-stone-900">
                      {s.val}
                    </div>
                    <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio */}
            {influencer.mediaUrls && influencer.mediaUrls.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-stone-900 px-4">
                  Content Portfolio
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {influencer.mediaUrls.map((media: any, i: number) => {
                    const mediaStr = String(typeof media === "string" ? media : media?.url || "").toLowerCase();
                    const isVideo =
                      mediaStr.includes("video/") ||
                      mediaStr.includes("quicktime") ||
                      mediaStr.includes(".mp4") ||
                      mediaStr.includes(".webm") ||
                      mediaStr.includes(".mov") ||
                      mediaStr.includes(".avi");
                    const mediaUrl = typeof media === "string" ? media : media?.url || media;
                    
                    if (!mediaUrl) return null;
                    
                    return (
                      <div
                        key={i}
                        className={`overflow-hidden rounded-[2rem] group relative bg-stone-200 ${i === 0 ? "col-span-2 row-span-2" : "aspect-square"}`}
                      >
                        {isVideo ? (
                          <>
                            <video
                              src={mediaUrl}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              controls
                              controlsList="nodownload"
                              preload="metadata"
                              style={{ display: "block", width: "100%", height: "100%" }}
                              onError={(e) => {
                                console.error("Video playback error:", e);
                              }}
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                          </>
                        ) : (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={mediaUrl}
                              alt="portfolio-work"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              onError={(e) => {
                                console.error("Image load error:", e);
                                (e.target as HTMLImageElement).style.opacity = "0";
                              }}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Pricing sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white shadow-2xl sticky top-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs">
                  ₹
                </span>
                Service Packages
              </h3>
              <div className="space-y-4 mb-8">
                {[
                  {
                    label: "Standard Feed Post",
                    price: influencer.prices?.post,
                  },
                  {
                    label: "Story (24h) + Link",
                    price: influencer.prices?.story,
                  },
                  {
                    label: "Short Video / Reel",
                    price: influencer.prices?.reel,
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <span className="text-sm text-stone-400">{p.label}</span>
                    <span className="font-black text-orange-400">
                      {formatPrice(p.price || 0)}
                    </span>
                  </div>
                ))}
              </div>

              {user?.role === "BRAND" ? (
                <button
                  onClick={openModal}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-2xl font-black transition-all shadow-[0_10px_20px_-5px_rgba(234,88,12,0.5)] flex items-center justify-center gap-2"
                >
                  <MessageSquare size={20} /> START CAMPAIGN
                </button>
              ) : !user ? (
                <Link
                  href="/login"
                  className="w-full bg-white text-stone-900 py-5 rounded-2xl font-black text-center block hover:bg-stone-100 transition-all"
                >
                  Sign in to Collaborate
                </Link>
              ) : (
                <div className="p-4 rounded-2xl bg-white/5 text-center text-xs text-stone-500">
                  Switch to a Brand account to collaborate
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">
                  Direct Channels
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {influencer.socialLinks?.instagram && (
                    <a
                      href="#"
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Instagram size={16} className="text-pink-400" />
                      <span className="text-xs font-bold">Instagram</span>
                    </a>
                  )}
                  {influencer.socialLinks?.youtube && (
                    <a
                      href="#"
                      className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Youtube size={16} className="text-red-400" />
                      <span className="text-xs font-bold">YouTube</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CAMPAIGN REQUEST MODAL
      ══════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-stone-100 flex-shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-2xl object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-black text-stone-900">
                      Collaborate with {influencer.name}
                    </h2>
                    <p className="text-xs text-stone-400">
                      {submitted
                        ? "Request submitted!"
                        : `Step ${step + 1} of ${STEPS.length} — ${STEPS[step]}`}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center hover:bg-stone-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Progress bar */}
            {!submitted && (
              <div className="flex flex-shrink-0">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 transition-all duration-500 ${i <= step ? "bg-orange-500" : "bg-stone-100"}`}
                  />
                ))}
              </div>
            )}

            {/* Step labels */}
            {!submitted && (
              <div className="flex px-8 pt-4 pb-1 flex-shrink-0">
                {STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`flex-1 text-center text-[10px] font-bold uppercase tracking-wide transition-colors ${i <= step ? "text-orange-600" : "text-stone-300"}`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {/* SUCCESS */}
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} className="text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-stone-900 mb-3">
                    Request Sent! 🎉
                  </h3>
                  <p className="text-stone-500 max-w-sm leading-relaxed mb-2">
                    Your collaboration request has been sent to{" "}
                    <strong>{influencer.name}</strong>. They&apos;ll respond
                    within <strong>48 hours</strong>.
                  </p>
                  <div className="bg-stone-50 rounded-2xl p-5 text-left w-full max-w-sm mt-4 mb-8 space-y-2 border border-stone-100">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                      What happens next
                    </p>
                    {[
                      "📧 Email confirmation sent to your inbox",
                      "🔔 Notification added to your Brand Dashboard",
                      `📲 ${influencer.name} has been notified`,
                      "📅 Dates blocked on Admin calendar pending confirmation",
                    ].map((t, i) => (
                      <p key={i} className="text-sm text-stone-700">
                        {t}
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 rounded-2xl bg-stone-100 text-stone-700 font-semibold text-sm hover:bg-stone-200 transition-colors"
                    >
                      Close
                    </button>
                    <Link
                      href="/brand/dashboard"
                      onClick={closeModal}
                      className="px-6 py-3 rounded-2xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                      <Briefcase size={15} /> View Dashboard
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* STEP 0: Business Info */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div className="bg-orange-50 rounded-2xl p-4 flex items-start gap-3 text-sm text-orange-700 border border-orange-100">
                        <Building2 size={18} className="flex-shrink-0 mt-0.5" />
                        Tell the creator about your brand so they know who
                        they&apos;re working with.
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5">
                          Business / Brand Name *
                        </label>
                        <input
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Mamaearth, boAt Audio, Nykaa"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5">
                          Business Type / Industry *
                        </label>
                        <select
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm bg-white"
                        >
                          <option value="">Select industry...</option>
                          {BUSINESS_TYPES.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5">
                          Business Location / City *
                        </label>
                        <input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Mumbai, Bengaluru, Pan India"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5">
                          Business Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5">
                          Website / Social Page{" "}
                          <span className="text-stone-400 font-normal">
                            (optional)
                          </span>
                        </label>
                        <input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 1: Campaign Details */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5">
                          Campaign Title *
                        </label>
                        <input
                          value={campaignTitle}
                          onChange={(e) => setCampaignTitle(e.target.value)}
                          placeholder="e.g. Diwali Collection Launch, App Download Drive"
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">
                          Deliverables Required *
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {DELIVERABLES.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => toggleDeliverable(d)}
                              className={`text-sm px-4 py-2 rounded-xl border font-semibold transition-all
                                ${deliverables.includes(d) ? "bg-orange-600 text-white border-orange-600" : "bg-stone-50 text-stone-600 border-stone-200 hover:border-orange-300"}`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                        {deliverables.length > 0 && (
                          <p className="text-xs text-orange-600 mt-2 font-medium">
                            ✓ Selected: {deliverables.join(", ")}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5">
                          Campaign Brief / Message *
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={4}
                          maxLength={500}
                          placeholder="Describe your product, what you want the creator to do, key messages, tone, hashtags, do's and don'ts..."
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
                        />
                        <p className="text-xs text-stone-400 mt-1 text-right">
                          {message.length}/500
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Campaign Date */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3 text-sm text-amber-700 border border-amber-100">
                        <Calendar size={18} className="flex-shrink-0 mt-0.5" />
                        Pick your campaign date. We'll check if the
                        creator is available on this date.
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-1.5">
                          Campaign Date *
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                        />
                      </div>
                      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 text-sm text-stone-600 flex justify-between items-center">
                        <span className="font-bold flex items-center gap-2"><IndianRupee size={15}/> Total Campaign Budget:</span>
                        <span className="font-black text-orange-600 text-lg">{formatPrice(suggestedPrice > 0 ? suggestedPrice : 1000)}</span>
                      </div>
                      <p className="text-xs text-stone-400 text-right mt-1">* Computed dynamically based on your selected deliverables.</p>
                    </div>
                  )}

                  {/* STEP 3: Review */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100 space-y-5">
                        <h3 className="font-black text-stone-900 text-lg">
                          Review Your Request
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {[
                            {
                              icon: <Building2 size={14} />,
                              label: "Business",
                              val: businessName,
                            },
                            {
                              icon: <Briefcase size={14} />,
                              label: "Industry",
                              val: businessType,
                            },
                            {
                              icon: <MapPin size={14} />,
                              label: "Location",
                              val: location,
                            },
                            {
                              icon: <FileText size={14} />,
                              label: "Campaign",
                              val: campaignTitle,
                            },
                            {
                              icon: <Calendar size={14} />,
                              label: "Date",
                              val: startDate,
                            },
                            {
                              icon: <IndianRupee size={14} />,
                              label: "Budget",
                              val: formatPrice(suggestedPrice > 0 ? suggestedPrice : 1000),
                            },
                            {
                              icon: <Phone size={14} />,
                              label: "Phone",
                              val: phoneNumber,
                            },
                          ].map(({ icon, label, val }) => (
                            <div key={label} className="flex items-start gap-2">
                              <div className="text-orange-500 mt-0.5 flex-shrink-0">
                                {icon}
                              </div>
                              <div>
                                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                  {label}
                                </p>
                                <p className="font-semibold text-stone-800 text-sm">
                                  {val}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-2">
                            Deliverables
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {deliverables.map((d) => (
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
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                            Brief
                          </p>
                          <p className="text-sm text-stone-600 leading-relaxed bg-white rounded-xl p-3 border border-stone-100">
                            {message}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 border border-blue-100 flex items-start gap-2">
                        <Clock size={16} className="flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>{influencer.name}</strong> will be notified
                          immediately. You&apos;ll see status updates on your{" "}
                          <strong>Brand Dashboard</strong> and receive an email
                          confirmation. The Admin can see this booking request.
                        </span>
                      </div>

                      {submitError && (
                        <div className="bg-red-50 rounded-2xl p-4 text-sm text-red-700 border border-red-200 flex items-start gap-2">
                          <AlertCircle
                            size={16}
                            className="flex-shrink-0 mt-0.5"
                          />
                          {submitError}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal footer */}
            {!submitted && (
              <div className="px-8 py-5 border-t border-stone-100 flex justify-between items-center bg-white flex-shrink-0">
                <button
                  onClick={() => (step > 0 ? setStep(step - 1) : closeModal())}
                  className="px-5 py-2.5 rounded-2xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  {step === 0 ? "Cancel" : "← Back"}
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    onClick={() => canNext() && setStep(step + 1)}
                    disabled={!canNext()}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-2xl bg-orange-600 text-white text-sm font-bold disabled:opacity-40 hover:bg-orange-700 transition-colors"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-2xl bg-orange-600 text-white text-sm font-black disabled:opacity-60 hover:bg-orange-700 transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        <MessageSquare size={16} /> Send Request
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
