"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import {
  Users,
  CheckSquare,
  Clock,
  XCircle,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  totalInfluencers: number;
  pendingInfluencers: number;
  approvedInfluencers: number;
  rejectedInfluencers: number;
  totalBrands: number;
  totalCampaigns: number;
}

interface Log {
  id: string;
  action: string;
  details: Record<string, string>;
  createdAt: string;
  userId: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .dashboard()
      .then((res) => {
        setStats(res.data.stats);
        setLogs(res.data.recentActivity);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: Users,
          color: "bg-blue-50 text-blue-600",
        },
        {
          label: "Approved Creators",
          value: stats.approvedInfluencers,
          icon: CheckSquare,
          color: "bg-emerald-50 text-emerald-600",
        },
        {
          label: "Pending Review",
          value: stats.pendingInfluencers,
          icon: Clock,
          color: "bg-amber-50 text-amber-600",
        },
        {
          label: "Rejected",
          value: stats.rejectedInfluencers,
          icon: XCircle,
          color: "bg-red-50 text-red-600",
        },
        {
          label: "Brand Partners",
          value: stats.totalBrands,
          icon: TrendingUp,
          color: "bg-violet-50 text-violet-600",
        },
        {
          label: "Campaigns",
          value: stats.totalCampaigns,
          icon: Briefcase,
          color: "bg-orange-50 text-orange-600",
        },
      ]
    : [];

  const actionLabels: Record<string, string> = {
    USER_REGISTERED: "New user registered",
    USER_LOGIN: "User logged in",
    INFLUENCER_APPROVED: "Influencer approved",
    INFLUENCER_REJECTED: "Influencer rejected",
    CAMPAIGN_CREATED: "Campaign created",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
        <p className="text-stone-500 mt-1">
          Platform overview and recent activity
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white rounded-3xl border border-stone-100 shimmer"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-3xl border border-stone-100 p-6 flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center`}
                >
                  <s.icon size={22} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-ink">{s.value}</div>
                  <div className="text-sm text-stone-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity feed */}
          <div className="bg-white rounded-3xl border border-stone-100 p-6">
            <h2 className="font-bold text-ink text-lg mb-5">Recent Activity</h2>
            {logs.length === 0 ? (
              <p className="text-stone-400 text-sm">No activity yet.</p>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 py-3 border-b border-stone-50 last:border-0"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                      <TrendingUp size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {actionLabels[log.action] || log.action}
                      </p>
                      {log.details?.email && (
                        <p className="text-xs text-stone-400">
                          {log.details.email}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-stone-400 whitespace-nowrap">
                      {timeAgo(log.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
