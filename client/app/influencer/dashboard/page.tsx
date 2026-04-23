"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { influencerApi, requestApi } from "@/lib/api";
import {
  formatFollowers,
  formatPrice,
  getNicheEmoji,
  getStatusColor,
} from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Edit2,
  Save,
  X,
  MessageSquare,
  Calendar,
  DollarSign,
  Upload,
  PlayCircle,
  Image as ImageIcon,
  Trash2,
  Phone,
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
];

interface Profile {
  id: string;
  name: string;
  bio: string;
  niche: string[];
  followers: number;
  engagementRate: number;
  location: string;
  prices: { post: number; story: number; reel: number };
  socialLinks: { instagram?: string; youtube?: string };
  status: string;
  adminNotes?: string;
  avatar?: string;
  coverPhoto?: string;
  mediaUrls?: string[];
}

export default function InfluencerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "requests">("profile");
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string>("");
  const [uploadingCoverPhoto, setUploadingCoverPhoto] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "INFLUENCER")) {
      router.push("/login");
      return;
    }
    if (user?.role === "INFLUENCER") {
      Promise.all([
        influencerApi.profile(),
        requestApi.influencerRequests()
      ])
        .then(([profileRes, reqsRes]) => {
          setProfile(profileRes.data);
          setForm(profileRes.data);
          setMediaList(profileRes.data.mediaUrls || []);
          setCoverPhoto(profileRes.data.coverPhoto || "");
          setRequests(reqsRes.data.requests);
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: any = {};
      
      // Only include defined/non-empty values
      if (form.bio !== undefined) updateData.bio = form.bio;
      if (form.niche !== undefined) updateData.niche = form.niche;
      if (form.followers !== undefined) updateData.followers = form.followers;
      if (form.engagementRate !== undefined) updateData.engagementRate = form.engagementRate;
      if (form.location !== undefined) updateData.location = form.location;
      if (form.prices !== undefined) updateData.prices = form.prices;
      if (form.socialLinks !== undefined) updateData.socialLinks = form.socialLinks;
      if (form.avatar !== undefined) updateData.avatar = form.avatar;
      if (coverPhoto) updateData.coverPhoto = coverPhoto;
      if (form.mediaUrls !== undefined) updateData.mediaUrls = form.mediaUrls;
      
      await influencerApi.updateProfile(updateData);
      const res = await influencerApi.profile();
      setProfile(res.data);
      setMediaList(res.data.mediaUrls || []);
      setCoverPhoto(res.data.coverPhoto || "");
      setForm(res.data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Save error:", err);
      alert(err?.response?.data?.error || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleNiche = (n: string) => {
    setForm((prev) => ({
      ...prev,
      niche: prev.niche?.includes(n)
        ? prev.niche.filter((x) => x !== n)
        : [...(prev.niche || []), n],
    }));
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file extension
    const validExtensions = ["png", "jpg", "jpeg", "gif", "webp", "mp4", "webm", "mov", "avi"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      alert(`Invalid file type. Please upload: ${validExtensions.join(", ").toUpperCase()}`);
      e.target.value = "";
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      e.target.value = ""; // Reset input
      return;
    }

    setUploadingMedia(true);
    try {
      const res = await influencerApi.uploadMedia(file);
      const newMedia = res.data.mediaUrl || res.data.url;
      if (!newMedia) {
        throw new Error("No media URL returned from server");
      }
      const updatedMediaList = [...mediaList, newMedia];
      setMediaList(updatedMediaList);
      setForm({
        ...form,
        mediaUrls: updatedMediaList,
      });
      alert("Media uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err?.response?.data?.error || "Failed to upload media");
    } finally {
      setUploadingMedia(false);
      e.target.value = ""; // Reset input for next upload
    }
  };

  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file extension
    const validImageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
    if (!fileExtension || !validImageExtensions.includes(fileExtension)) {
      alert(`Invalid file type. Please upload: ${validImageExtensions.join(", ").toUpperCase()}`);
      e.target.value = "";
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      e.target.value = ""; // Reset input
      return;
    }

    setUploadingCoverPhoto(true);
    try {
      const res = await influencerApi.uploadMedia(file);
      const coverPhotoUrl = res.data.mediaUrl || res.data.url;
      if (!coverPhotoUrl) {
        throw new Error("No media URL returned from server");
      }
      setCoverPhoto(coverPhotoUrl);
      alert("Cover photo uploaded successfully!");
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err?.response?.data?.error || "Failed to upload cover photo");
    } finally {
      setUploadingCoverPhoto(false);
      e.target.value = ""; // Reset input for next upload
    }
  };

  const handleDeleteMedia = (index: number) => {
    const updatedMedia = mediaList.filter((_, i) => i !== index);
    setMediaList(updatedMedia);
    setForm({
      ...form,
      mediaUrls: updatedMedia,
    });
  };

  const handleRespond = async (id: string, action: "accept" | "reject") => {
    try {
      await requestApi.respond(id, { action });
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: action === "accept" ? "accepted" : "rejected" } : r))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to respond to request.");
    }
  };

  const statusInfo = {
    pending: {
      icon: Clock,
      label: "Under Review",
      desc: "Your profile is being reviewed by our team (24–48 hrs)",
      color: "amber",
    },
    approved: {
      icon: CheckCircle2,
      label: "Approved ✓",
      desc: "You're live on the marketplace!",
      color: "emerald",
    },
    rejected: {
      icon: XCircle,
      label: "Not Approved",
      desc: "Please update your profile and contact support",
      color: "red",
    },
  };

  if (authLoading || !user) return null;

  const si = profile
    ? statusInfo[profile.status as keyof typeof statusInfo]
    : null;

  return (
    <div className="min-h-screen bg-cream">
      
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-ink">Creator Dashboard</h1>
            <p className="text-stone-500 mt-1">Welcome back, {user.name}</p>
          </div>
          {!editing && profile && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-white border border-stone-200 px-4 py-2.5 rounded-2xl text-sm font-medium hover:border-orange-300 transition-all"
            >
              <Edit2 size={15} /> Edit Profile
            </button>
          )}
          {editing && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  setForm(profile || {});
                }}
                className="flex items-center gap-2 bg-white border border-stone-200 px-4 py-2.5 rounded-2xl text-sm font-medium text-stone-600"
              >
                <X size={15} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2.5 rounded-2xl text-sm font-semibold disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}{" "}
                Save
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        {!editing && profile && (
          <div className="flex gap-4 mb-8 border-b border-stone-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 ${
                activeTab === "profile"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`pb-4 px-2 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
                activeTab === "requests"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              Campaign Requests
              {requests.filter(r => r.status === "pending").length > 0 && (
                <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  {requests.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-orange-500" />
          </div>
        ) : !profile ? (
          <div className="text-center py-20 text-stone-500">
            Profile not found.
          </div>
        ) : activeTab === "requests" ? (
          <div className="space-y-6">
            {requests.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare size={48} className="text-stone-200 mx-auto mb-4" />
                <p className="text-stone-500">No campaign requests yet.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-white rounded-[2rem] border border-stone-100 p-8 flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                        ${req.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          req.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-stone-100 text-stone-700'}`}
                      >
                        {req.status}
                      </span>
                      <span className="text-sm text-stone-400 font-medium">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-stone-900 mb-2">{req.campaignTitle}</h3>
                    <div className="flex items-center gap-2 text-stone-500 text-sm mb-6">
                      <span className="font-semibold text-stone-700">{req.businessName}</span>
                      <span>•</span>
                      <span>{req.businessType}</span>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-4 text-sm text-stone-700 leading-relaxed mb-6 border border-stone-100/50">
                      "{req.message}"
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><DollarSign size={16} /></div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Budget</p>
                          <p className="font-bold text-stone-900">{formatPrice(req.budget)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-xl"><Calendar size={16} /></div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Timeline</p>
                          <p className="font-bold text-stone-900 text-xs mt-0.5">
                            {req.startDate.slice(0, 10)} to {req.endDate.slice(0, 10)}
                          </p>
                        </div>
                      </div>
                      {req.phoneNumber && (
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Phone size={16} /></div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Phone</p>
                            <p className="font-bold text-stone-900 text-sm">{req.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {req.deliverables.map((d: string) => (
                        <span key={d} className="bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {req.status === 'pending' && (
                    <div className="md:w-64 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-8">
                      <button 
                        onClick={() => handleRespond(req.id, "accept")}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        Accept Campaign
                      </button>
                      <button 
                        onClick={() => handleRespond(req.id, "reject")}
                        className="w-full py-4 bg-white border-2 border-stone-100 hover:bg-red-50 hover:border-red-100 hover:text-red-600 text-stone-600 rounded-2xl font-bold transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status banner */}
            {si && (
              <div
                className={`rounded-3xl border p-5 flex items-center gap-4
                ${
                  profile.status === "approved"
                    ? "bg-emerald-50 border-emerald-200"
                    : profile.status === "rejected"
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                }`}
              >
                <si.icon
                  size={24}
                  className={
                    profile.status === "approved"
                      ? "text-emerald-600"
                      : profile.status === "rejected"
                        ? "text-red-600"
                        : "text-amber-600"
                  }
                />
                <div>
                  <p
                    className={`font-bold text-sm ${
                      profile.status === "approved"
                        ? "text-emerald-800"
                        : profile.status === "rejected"
                          ? "text-red-800"
                          : "text-amber-800"
                    }`}
                  >
                    {si.label}
                  </p>
                  <p
                    className={`text-xs ${
                      profile.status === "approved"
                        ? "text-emerald-600"
                        : profile.status === "rejected"
                          ? "text-red-600"
                          : "text-amber-600"
                    }`}
                  >
                    {si.desc}
                  </p>
                  {profile.adminNotes && (
                    <p className="text-xs mt-1 opacity-80">
                      Note: {profile.adminNotes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl border border-stone-100 p-5 text-center">
                <Users size={18} className="text-stone-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ink">
                  {formatFollowers(profile.followers)}
                </div>
                <div className="text-xs text-stone-500">Followers</div>
              </div>
              <div className="bg-white rounded-3xl border border-stone-100 p-5 text-center">
                <TrendingUp size={18} className="text-stone-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-ink">
                  {profile.engagementRate}%
                </div>
                <div className="text-xs text-stone-500">Engagement</div>
              </div>
              <div className="bg-white rounded-3xl border border-stone-100 p-5 text-center">
                <div className="text-2xl font-bold text-ink">
                  {formatPrice(profile.prices?.post || 0)}
                </div>
                <div className="text-xs text-stone-500">Per Post</div>
              </div>
            </div>

            {/* Profile info */}
            <div className="bg-white rounded-3xl border border-stone-100 p-7">
              <h2 className="font-bold text-ink mb-5">Profile Information</h2>

              {/* Bio */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Bio
                </label>
                {editing ? (
                  <textarea
                    value={form.bio || ""}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm resize-none"
                  />
                ) : (
                  <p className="text-stone-700 text-sm leading-relaxed">
                    {profile.bio || "No bio added yet."}
                  </p>
                )}
              </div>

              {/* Niches */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Niches
                </label>
                {editing ? (
                  <div className="flex flex-wrap gap-2">
                    {NICHES.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => toggleNiche(n)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all
                          ${form.niche?.includes(n) ? "bg-orange-600 text-white border-orange-600" : "bg-stone-50 text-stone-600 border-stone-200"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile.niche.map((n) => (
                      <span
                        key={n}
                        className="text-sm bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-full"
                      >
                        {getNicheEmoji(n)} {n}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  Pricing
                </label>
                {editing ? (
                  <div className="grid grid-cols-3 gap-3">
                    {["post", "story", "reel"].map((type) => (
                      <div key={type}>
                        <label className="block text-xs text-stone-500 mb-1 capitalize">
                          {type} (₹)
                        </label>
                        <input
                          type="number"
                          value={
                            (form.prices as Record<string, number>)?.[type] ||
                            ""
                          }
                          onChange={(e) =>
                            setForm({
                              ...form,
                              prices: {
                                ...form.prices!,
                                [type]: parseInt(e.target.value) || 0,
                              } as typeof form.prices,
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {["post", "story", "reel"].map((type) => (
                      <div
                        key={type}
                        className="bg-stone-50 rounded-2xl p-4 text-center"
                      >
                        <div className="font-bold text-ink">
                          {formatPrice(
                            (profile.prices as Record<string, number>)?.[
                              type
                            ] || 0,
                          )}
                        </div>
                        <div className="text-xs text-stone-500 capitalize">
                          Per {type}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location + Social */}
              {editing && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                      Location
                    </label>
                    <input
                      value={form.location || ""}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      placeholder="e.g. Mumbai"
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                      Instagram Handle
                    </label>
                    <input
                      value={form.socialLinks?.instagram || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          socialLinks: {
                            ...form.socialLinks,
                            instagram: e.target.value,
                          },
                        })
                      }
                      placeholder="@username"
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                    />
                  </div>
                  <div className="col-span-2 mt-4 space-y-4">
                    <div className="pt-4 border-t border-stone-100">
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                        Avatar Image URL
                      </label>
                      <input
                        value={form.avatar || ""}
                        onChange={(e) =>
                          setForm({ ...form, avatar: e.target.value })
                        }
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                        Cover Photo
                      </label>
                      {coverPhoto && (
                        <div className="relative mb-3 rounded-2xl overflow-hidden bg-stone-200 aspect-video">
                          <img
                            src={coverPhoto}
                            alt="cover"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setCoverPhoto("")}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      <label className="relative block border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-orange-50 transition-colors bg-orange-50/40">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.gif,.webp"
                          onChange={handleCoverPhotoUpload}
                          disabled={uploadingCoverPhoto}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          {uploadingCoverPhoto ? (
                            <Loader2 size={24} className="text-orange-500 animate-spin" />
                          ) : (
                            <>
                              <Upload size={24} className="text-orange-500" />
                              <div>
                                <p className="text-sm font-bold text-orange-700">
                                  Click to upload cover photo
                                </p>
                                <p className="text-xs text-stone-500 mt-1">
                                  PNG, JPG up to 50MB
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 mb-1.5">
                        Portfolio Media (Images & Reels)
                      </label>
                      <div className="space-y-4">
                        {/* Upload Area */}
                        <label className="relative block border-2 border-dashed border-orange-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-orange-50 transition-colors bg-orange-50/40">
                          <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleMediaUpload}
                            disabled={uploadingMedia}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center gap-2">
                            {uploadingMedia ? (
                              <Loader2 size={32} className="text-orange-500 animate-spin" />
                            ) : (
                              <>
                                <Upload size={32} className="text-orange-500" />
                                <div>
                                  <p className="text-sm font-bold text-orange-700">
                                    Click to upload or drag and drop
                                  </p>
                                  <p className="text-xs text-stone-500 mt-1">
                                    PNG, JPG, MP4, WebM up to 50MB
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </label>

                        {/* Media Preview Grid */}
                        {mediaList && mediaList.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-stone-500 uppercase">
                              Your Portfolio ({mediaList.length} items)
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {mediaList.map((media, idx) => {
                                const mediaStr = String(media).toLowerCase();
                                const isVideo =
                                  mediaStr.includes(".mp4") ||
                                  mediaStr.includes(".webm") ||
                                  mediaStr.includes(".mov") ||
                                  mediaStr.includes("video/");
                                return (
                                  <div
                                    key={idx}
                                    className="relative group overflow-hidden rounded-xl bg-stone-200 aspect-square"
                                  >
                                    {isVideo ? (
                                      <>
                                        <video
                                          src={media}
                                          className="w-full h-full object-cover"
                                          preload="metadata"
                                          style={{ display: "block", width: "100%", height: "100%" }}
                                          onError={(e) => {
                                            console.error("Video load error:", e);
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center pointer-events-none">
                                          <PlayCircle
                                            size={24}
                                            className="text-white"
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          src={media}
                                          alt="media"
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            console.error("Image load error:", e);
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center pointer-events-none">
                                          <ImageIcon
                                            size={24}
                                            className="text-white"
                                          />
                                        </div>
                                      </>
                                    )}
                                    <button
                                      onClick={() => handleDeleteMedia(idx)}
                                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
