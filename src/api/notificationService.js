import axiosInstance from './axiosInstance';

const NOTIFICATION_BASE = '/notification/notifications';

export const notificationService = {
  getNotifications: async (tenantId) => {
    const response = await axiosInstance.get(`${NOTIFICATION_BASE}/tenant/${tenantId}`);
    return response.data;
  },

  getUnreadNotifications: async (tenantId) => {
    const response = await axiosInstance.get(`${NOTIFICATION_BASE}/tenant/${tenantId}/unread`);
    return response.data;
  },

  getUnreadCount: async (tenantId) => {
    const response = await axiosInstance.get(`${NOTIFICATION_BASE}/tenant/${tenantId}/unread-count`);
    return response.data.count;
  },

  markAsRead: async (notificationId) => {
    await axiosInstance.put(`${NOTIFICATION_BASE}/${notificationId}/read`);
  },

  markAllAsRead: async (tenantId) => {
    await axiosInstance.put(`${NOTIFICATION_BASE}/tenant/${tenantId}/read-all`);
  }
};
