import type { ConversationResponseDto } from "@/api";
import {
  createConversationMutation,
  getConversationQuery,
  getListMessagesInfiniteQuery,
  sendMessageMutation,
} from "@/queries/chatQueries";
import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";

export const useChatWidget = () => {
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

  // First get (or create) conversation for current user
  const conversationQuery = getConversationQuery();

  const conversationId = conversationQuery.isSuccess
    ? (conversationQuery.data.data as any)?.id
    : undefined;

  // Messages infinite query (pages). We'll load page 1 first (latest) and fetchNextPage to load older pages
  const chatMessagesInfinite = getListMessagesInfiniteQuery({ pageSize: 10 });

  const onSendMessage = sendMessageMutation();

  const conversation = conversationQuery;

  const createConversation = createConversationMutation();

  // wrapper to send message and refresh the list after success
  const sendMessageAndRefresh = async (
    body: Parameters<typeof onSendMessage.mutateAsync>[0]
  ) => {
    const res = await onSendMessage.mutateAsync(body);
    // after sending, invalidate message lists so UI will refresh
    await queryClient.invalidateQueries(["chatMessages"] as any);
    await queryClient.invalidateQueries(["chatMessagesInfinite"] as any);
    return res;
  };

  return {
    // flatten pages into a single array of messages (oldest->newest after sorting in UI)
    chatMessages: chatMessagesInfinite.isSuccess
      ? chatMessagesInfinite.data.pages.flatMap((p: any) => p.data.data)
      : [],
    // pagination helpers from useInfiniteQuery
    fetchNextPage: chatMessagesInfinite.fetchNextPage,
    hasNextPage: chatMessagesInfinite.hasNextPage,
    isFetchingNextPage: chatMessagesInfinite.isFetchingNextPage,
    // keep backwards-compatible mutation object
    onSendMessage: onSendMessage,
    // convenience wrapper that sends and then refreshes the list
    sendMessage: sendMessageAndRefresh,
    message,
    setMessage,
    conversation: conversation.isSuccess
      ? conversation.data.data
      : ({} as ConversationResponseDto),
    createConversation,
  };
};
