import { get } from "@api/index";
import socket from "@src/socket";
import React, { createContext, useContext, useEffect, useState } from "react";

export const NotificationContext = createContext({
  notifications: [],
  clearNotifications: () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    socket.emit("register", userId);

    const fetchNotifications = async () => {
      try {
        const response: any = await get(`/employer/notification/${userId}`);
        setNotifications(response);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();

    socket.on("receive-notification", async () => {
      const response: any = await get(`/employer/notification/${userId}`);
      setNotifications((prev: any) => [response, ...prev]);
    });

    return () => {
      socket.off("receive-notification");
    };
  }, []);

  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Export a custom hook for easy access
export const useNotifications = () => useContext(NotificationContext);
