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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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
  }, []);

  const { data: conversation, isSuccess: isGetConversationSuccess } =
    getConversationQuery();

  const conversationId = conversation?.data.id;

  const chatMessagesInfinite = getListMessagesInfiniteQuery({ pageSize: 10 });

  const { isPending: isSendMessagePending, mutate: sendMessageMute } =
    sendMessageMutation();

  const {
    isPending: isCreateConversationPending,
    mutate: createConversationMutate,
  } = createConversationMutation();

  return {
    chatMessages: chatMessagesInfinite.isSuccess
      ? chatMessagesInfinite.data.pages.flatMap((p: any) => p.data.data)
      : [],
    fetchNextPage: chatMessagesInfinite.fetchNextPage,
    hasNextPage: chatMessagesInfinite.hasNextPage,
    isFetchingNextPage: chatMessagesInfinite.isFetchingNextPage,
    isSendMessagePending,
    sendMessageMute,
    conversationId,
    message,
    setMessage,
    conversation: conversation?.data,
    isCreateConversationPending,
    createConversationMutate,
    messagesContainerRef,
  };
};
