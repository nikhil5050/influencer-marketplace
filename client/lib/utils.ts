import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFollowers(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

export function formatPrice(num: number): string {
  return "₹" + num.toLocaleString("en-IN");
}

export function getNicheEmoji(niche: string): string {
  const emojis: Record<string, string> = {
    Fashion: "👗",
    Tech: "💻",
    Food: "🍔",
    Travel: "✈️",
    Fitness: "🏋️",
    Beauty: "💄",
    Finance: "💰",
    Gaming: "🎮",
    Lifestyle: "🌟",
    Education: "📚",
    Comedy: "😂",
    Music: "🎵",
    Photography: "📷",
    Parenting: "👶",
    Sports: "⚽"
  };
  return emojis[niche] || "✨";
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "pending":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}
