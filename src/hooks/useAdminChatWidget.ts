import type { MessageResponseDto } from "@/api";
import {
  adminGetListConversationsQuery,
  adminGetListMessagesQuery,
  adminSendMessageMutation,
} from "@/queries/adminChatQueries";
import type { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";

export const useAdminChatWidget = () => {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [messageInput, setMessageInput] = useState<string>("");
  const [unreadConversations, setUnreadConversations] = useState<Set<string>>(
    new Set()
  );
  const socketRef = useRef<Socket | null>(null);

  // Fetch conversations list
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = adminGetListConversationsQuery({
    pageSize: 20,
  });

  // Fetch messages for selected conversation
  const { data: messagesData, refetch: refetchMessages } =
    adminGetListMessagesQuery(
      {
        page: 1,
        pageSize: 50,
      },
      selectedConversationId
    );

  // Send message mutation
  const { isPending: isSending, mutate: sendMessage } =
    adminSendMessageMutation();

  // Auto-select first conversation on load
  useEffect(() => {
    if (
      conversationsData?.data &&
      conversationsData.data.length > 0 &&
      !selectedConversationId
    ) {
      setSelectedConversationId(conversationsData.data[0].id);
    }
  }, [conversationsData, selectedConversationId]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId) {
      setUnreadConversations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedConversationId);
        return newSet;
      });
    }
  }, [selectedConversationId]);

  // Setup socket connection
  useEffect(() => {
    const socketUrl = `${import.meta.env.VITE_BACKEND_BASE_URL}/chat`;
    const socket = io(socketUrl, {
      auth: {
        token: localStorage.getItem("accessToken") || "",
      },
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Admin chat connected to socket");
    });

    socket.on("disconnect", () => {
      console.log("Admin chat disconnected from socket");
    });

    // Listen for new messages
    socket.on(import.meta.env.VITE_CHAT_EVENT, (data: MessageResponseDto) => {
      // If message belongs to current conversation, refetch messages
      if (data.conversationId === selectedConversationId) {
        refetchMessages();
      } else {
        // Mark conversation as unread if message is not for current conversation
        setUnreadConversations((prev) => {
          const newSet = new Set(prev);
          newSet.add(data.conversationId);
          return newSet;
        });

        // Show toast notification for new message from other conversations
        const conversation = conversationsData?.data?.find(
          (c) => c.id === data.conversationId
        );
        const senderName = conversation?.user?.name || "Người dùng";
        // toast.info(`Tin nhắn mới từ ${senderName}`, {
        //   description:
        //     data.content.length > 50
        //       ? data.content.substring(0, 50) + "..."
        //       : data.content,
        //   duration: 4000,
        // });
      }

      // Always refetch conversations to update latest message
      refetchConversations();
    }); // Listen for new conversation
    socket.on("newConversation", () => {
      console.log("New conversation created");
      toast.success("Có cuộc trò chuyện mới!", {
        description: "Một khách hàng vừa bắt đầu cuộc trò chuyện",
        duration: 4000,
      });
      refetchConversations();
    });

    socketRef.current = socket;

    return () => {
      socket.off(import.meta.env.VITE_CHAT_EVENT);
      socket.off("newConversation");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [selectedConversationId, refetchMessages, refetchConversations]);

  // Handle send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId) return;

    sendMessage(
      {
        content: messageInput.trim(),
        conversationId: selectedConversationId,
      },
      {
        onSuccess: () => {
          setMessageInput("");
          // Refetch messages after sending
          setTimeout(() => {
            refetchMessages();
          }, 200);
        },
      }
    );
  };

  return {
    // Conversations
    conversations: conversationsData?.data || [],
    isLoadingConversations,
    unreadConversations,

    // Selected conversation
    selectedConversationId,
    setSelectedConversationId,

    // Messages
    messages: messagesData?.data || [],

    // Message input
    messageInput,
    setMessageInput,

    // Send message
    isSending,
    handleSendMessage,

    // Refetch
    refetchConversations,
    refetchMessages,
  };
};
