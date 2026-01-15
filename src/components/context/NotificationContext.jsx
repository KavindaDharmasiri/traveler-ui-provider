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
      return;
    }
    
    try {
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
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  useEffect(() => {
    // const authData = JSON.parse(localStorage.getItem('authData') || '{}');
    const tenantId = localStorage.getItem('tenantId');
    
    if (!tenantId) {
      return;
    }

    fetchNotifications();
    fetchUnreadCount();
    
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);
    
    return () => {
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
