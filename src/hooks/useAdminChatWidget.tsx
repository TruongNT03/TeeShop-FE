import type { AdminConversationResponseDto, MessageResponseDto } from "@/api";
import {
  adminGetListConversationsQuery,
  adminGetListMessagesQuery,
  adminSendMessageMutation,
  getListMessagesInfiniteQuery,
} from "@/queries/adminChatQueries";
import { useQueryClient } from "@tanstack/react-query";
import type { Socket } from "node_modules/socket.io-client/build/esm/socket";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useAdminChatWidget = () => {
  const [conversationId, setConversationId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  // Initialize socket once and set up listeners
  useEffect(() => {
    const socketUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/chat`;
    const socket = io(socketUrl, {
      auth: {
        token: localStorage.getItem("accessToken") || "",
      },
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Connected to chat server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from chat server");
    });

    socket.on(import.meta.env.VITE_CHAT_EVENT, (data: any) => {
      console.log("New chat message received:", data);
      // When a new message arrives through socket, invalidate messages queries so react-query will refetch
      try {
        console.log("Invalidating chatMessages queries");
        // Use simple key array to match queries that start with 'chatMessages'
        queryClient.invalidateQueries(["chatMessages"] as any);
      } catch (e) {
        // ignore if query client not ready
        console.warn("Failed to invalidate chatMessages queries", e);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.off(import.meta.env.VITE_CHAT_EVENT);
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data, isLoading, isError, isSuccess } =
    adminGetListConversationsQuery({
      page: 1,
      pageSize: 20,
    });

  const { data: messagesData } = adminGetListMessagesQuery(
    {
      page: 1,
      pageSize: 20,
    },
    conversationId
  );

  const onSendMessage = adminSendMessageMutation();

  return {
    conversations: data?.data.data || ([] as AdminConversationResponseDto[]),
    isLoading,
    isError,
    conversationId,
    setConversationId,
    chatMessages: messagesData?.data.data || ([] as MessageResponseDto[]),
    message,
    setMessage,
    onSendMessage,
  };
};
