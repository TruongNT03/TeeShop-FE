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
        // Invalidate messages queries
        queryClient.invalidateQueries({ queryKey: ["adminChatMessages"] });
        // Also invalidate conversations list to update latest message
        queryClient.invalidateQueries({ queryKey: ["adminChatConversations"] });
      } catch (e) {
        // ignore if query client not ready
        console.warn("Failed to invalidate chatMessages queries", e);
      }
    });

    // Listen for new conversation created
    socket.on("newConversation", (data: any) => {
      console.log("New conversation created:", data);
      try {
        // Invalidate conversations list to show the new conversation
        queryClient.invalidateQueries({ queryKey: ["adminChatConversations"] });
      } catch (e) {
        console.warn("Failed to invalidate conversations queries", e);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.off(import.meta.env.VITE_CHAT_EVENT);
      socket.off("newConversation");
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    data: conversations,
    isLoading,
    isError,
    isSuccess,
  } = adminGetListConversationsQuery({
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

  const { isPending: isSendMessagePending, mutate: sendMessageMutation } =
    adminSendMessageMutation();

  useEffect(() => {
    if (isSuccess && conversations?.data?.data?.length > 0 && !conversationId) {
      setConversationId(conversations.data.data[0].id);
    }
  }, [isSuccess, conversations, conversationId]);

  return {
    conversations:
      conversations?.data.data || ([] as AdminConversationResponseDto[]),
    isLoading,
    isError,
    conversationId,
    setConversationId,
    chatMessages: messagesData?.data.data || ([] as MessageResponseDto[]),
    message,
    setMessage,
    isSendMessagePending,
    sendMessageMutation,
  };
};
