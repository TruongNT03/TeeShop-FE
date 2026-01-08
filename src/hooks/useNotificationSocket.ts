import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

export const useNotificationSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socketUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/notification`;
    const socket = io(socketUrl, {
      auth: {
        token: localStorage.getItem("accessToken") || "",
      },
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Connected to notification server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from notification server");
    });

    socket.on("notification", (data: any) => {
      // Show toast notification
      toast.info(data.title || "New Notification", {
        description: data.content || "You have a new notification",
        action: {
          label: "Đóng",

          onClick: () => {},
        },
      });

      // Invalidate notifications queries to refetch
      try {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({
          queryKey: ["notificationUnreadCount"],
        });
      } catch (e) {
        console.warn("Failed to invalidate notifications queries", e);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.off("notification");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return socketRef;
};
