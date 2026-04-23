import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Add Authorization header to every request if token exists
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),
  pendingInfluencers: (status: string = "pending") =>
    api.get("/admin/influencers/pending", { params: { status } }),
  approve: (id: string, notes?: string) =>
    api.post(`/admin/influencers/${id}/approve`, { notes }),
  reject: (id: string, notes?: string) =>
    api.post(`/admin/influencers/${id}/reject`, { notes }),
  listUsers: () => api.get("/admin/users"),
  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
  activityLogs: () => api.get("/admin/activity-logs"),
  campaignRequests: () => api.get("/requests/admin/all"),
  bookings: () => api.get("/requests/admin/bookings"),
};

export const brandApi = {
  profile: () => api.get("/brands/profile"),
  updateProfile: (data: any) => api.put("/brands/profile", data),
  influencers: (search?: string) =>
    api.get("/brands/influencers", { params: { search } }),
  campaigns: () => api.get("/brands/campaigns"),
  createCampaign: (data: any) => api.post("/brands/campaigns", data),
  getCampaign: (id: string) => api.get(`/brands/campaigns/${id}`),
  updateCampaign: (id: string, data: any) =>
    api.put(`/brands/campaigns/${id}`, data),
};

export const influencerApi = {
  profile: () => api.get("/influencers/my-profile"),
  updateProfile: (data: any) => api.put("/influencers/profile", data),
  publicList: (params?: any) => api.get("/influencers/", { params }),
  getById: (id: string) => api.get(`/influencers/${id}`),
  publicDetail: (id: string) => api.get(`/influencers/${id}`),
  uploadMedia: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/influencers/media/upload", formData);
  },
  deleteMedia: (mediaUrl: string) =>
    api.post("/influencers/media/delete", { mediaUrl }),
};

export const requestApi = {
  create: (data: any) => api.post("/requests/", data),
  brandRequests: () => api.get("/requests/brand"),
  influencerRequests: () => api.get("/requests/influencer"),
  respond: (id: string, data: any) => api.post(`/requests/${id}/respond`, data),
  notifications: () => api.get("/requests/notifications"),
  markAllRead: () => api.post("/requests/notifications/read-all"),
};
