"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { Activity, Loader2 } from "lucide-react";

interface Log {
  id: string;
  action: string;
  details: Record<string, string>;
  createdAt: string;
  userId: string;
}

const ACTION_STYLES: Record<string, { label: string; color: string }> = {
  USER_REGISTERED: { label: "Registered", color: "bg-blue-50 text-blue-600" },
  USER_LOGIN: { label: "Login", color: "bg-stone-50 text-stone-500" },
  INFLUENCER_APPROVED: {
    label: "Approved",
    color: "bg-emerald-50 text-emerald-600",
  },
  INFLUENCER_REJECTED: { label: "Rejected", color: "bg-red-50 text-red-600" },
  CAMPAIGN_CREATED: {
    label: "Campaign",
    color: "bg-violet-50 text-violet-600",
  },
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    adminApi
      .activityLogs()
      .then((res) => {
        setLogs(res.data.logs);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Activity Logs</h1>
          <p className="text-stone-500 mt-1">{total} total events tracked</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-4 py-2.5">
          <Activity size={16} className="text-stone-400" />
          <span className="font-bold text-ink">{total}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 size={24} className="animate-spin text-orange-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            No activity logs yet.
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {logs.map((log) => {
              const style = ACTION_STYLES[log.action] || {
                label: log.action,
                color: "bg-stone-50 text-stone-600",
              };
              return (
                <div
                  key={log.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50/50 transition-colors"
                >
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${style.color}`}
                  >
                    {style.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-700 truncate">
                      {log.details?.email || log.details?.title || log.action}
                    </p>
                    {log.details?.role && (
                      <p className="text-xs text-stone-400">
                        Role: {log.details.role}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-stone-400 whitespace-nowrap">
                    {timeAgo(log.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
