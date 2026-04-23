"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { getStatusColor, timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Users, Loader2, Trash2, AlertCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    adminApi
      .listUsers()
      .then((res) => {
        setUsers(res.data.users);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (deleteConfirm !== userId) {
      setDeleteConfirm(userId);
      return;
    }

    setDeleting(userId);
    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setDeleteConfirm(null);
      alert(`User "${userName}" deleted successfully`);
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const roleColors: Record<string, string> = {
    ADMIN: "bg-violet-50 text-violet-700 border-violet-200",
    BRAND: "bg-blue-50 text-blue-700 border-blue-200",
    INFLUENCER: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Users</h1>
          <p className="text-stone-500 mt-1">
            {total} total accounts on the platform
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-4 py-2.5">
          <Users size={16} className="text-stone-400" />
          <span className="font-bold text-ink">{total}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 size={24} className="animate-spin text-orange-500" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="text-center px-6 py-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-ink text-sm">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full border",
                        roleColors[user.role] ||
                          "bg-stone-50 text-stone-600 border-stone-200",
                      )}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-400">
                    {timeAgo(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {deleteConfirm === user.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          disabled={deleting === user.id}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === user.id ? "Deleting..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 text-xs font-bold rounded-lg transition-colors mx-auto"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
