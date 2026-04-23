"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { adminApi } from "@/lib/api";
import { Calendar } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Booking {
  id: string;
  influencerName: string;
  brandName: string;
  businessName: string;
  campaignTitle: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  deliverables?: string[];
}

export default function AdminBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN") {
      adminApi
        .bookings()
        .then((res) => {
          setBookings(res.data.bookings);
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading]);

  if (authLoading || !user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">Confirmed Bookings</h1>
          <p className="text-stone-500 mt-1">Track active and scheduled campaigns across the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50/50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Creator</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Brand</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Campaign</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-stone-500 uppercase tracking-widest">Dates</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-stone-500 uppercase tracking-widest">Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">Loading...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <Calendar size={48} className="text-stone-200 mx-auto mb-4" />
                    <p className="text-stone-500">No confirmed bookings yet</p>
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-stone-900">{booking.influencerName}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-semibold text-stone-900">{booking.businessName}</div>
                      <div className="text-xs text-stone-500">{booking.brandName}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-stone-800">{booking.campaignTitle}</div>
                      <div className="text-xs text-stone-400 mt-1 flex gap-1 flex-wrap">
                        {(booking.deliverables || []).map(d => (
                          <span key={d} className="bg-stone-100 px-1.5 py-0.5 rounded text-[10px]">{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-sm text-stone-700 whitespace-nowrap bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium border border-orange-100">
                        <Calendar size={13} />
                        {booking.startDate?.slice(0, 10)} → {booking.endDate?.slice(0, 10)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-emerald-600">
                      {formatPrice(booking.budget)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
