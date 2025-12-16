import React, { createContext, useState, useEffect } from "react";
import { notificationService } from "../../api/notificationService";

const NotificationContext = createContext({
  notifications: [],
  setNotifications: () => {},
  unreadCount: 0
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    // const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const tenantId = localStorage.getItem('tenantId');
    
    if (!tenantId) {
      console.log("No tenantId found, skipping notification fetch");
      return;
    }
    
    try {
      console.log("Fetching notifications for tenant:", tenantId);
      const data = await notificationService.getNotifications(tenantId);
      const formatted = data.map(n => ({
        id: n.id,
        message: n.title,
        time: new Date(n.createdAt).toLocaleString(),
        isRead: n.read,
        details: n.message,
        type: n.notificationType
      }));
      setNotifications(formatted);
      console.log("Notifications fetched:", formatted.length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchUnreadCount = async () => {
    // const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const tenantId = localStorage.getItem('tenantId');
    
    if (!tenantId) return;
    
    try {
      const count = await notificationService.getUnreadCount(tenantId);
      setUnreadCount(count);
      console.log("Unread count:", count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  useEffect(() => {
    // const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const tenantId = localStorage.getItem('tenantId');
    
    if (!tenantId) {
      console.log("Provider UI: No tenantId, notification polling disabled");
      return;
    }

    console.log("Provider UI: Starting notification polling for:", tenantId);
    fetchNotifications();
    fetchUnreadCount();
    
    const interval = setInterval(() => {
      console.log("Provider UI: Polling notifications (30s interval)");
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    
    return () => {
      console.log("Provider UI: Stopping notification polling");
      clearInterval(interval);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, fetchNotifications, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
