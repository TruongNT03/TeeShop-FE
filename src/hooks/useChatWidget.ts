import type {
  ConversationResponseDto,
  ListMessageResponseDto,
  MessageResponseDto,
} from "@/api";
import {
  createConversationMutation,
  getConversationQuery,
  getListMessagesInfiniteQuery,
  sendMessageMutation,
} from "@/queries/chatQueries";
import { useState, useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

export const useChatWidget = () => {
  const [message, setMessage] = useState<string>("");
  const [newMessages, setNewMessages] = useState<MessageResponseDto[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [hasNewMessage, setHasNewMessage] = useState<boolean>(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const {
    data: conversation,
    isSuccess: isGetConversationSuccess,
    refetch: refetchConversation,
  } = getConversationQuery();

  const conversationId = conversation?.data.id;

  const {
    data: chatMessages,
    fetchNextPage: listMessageFetchNextPage,
    hasNextPage: listMessageHasNextPage,
    isFetchingNextPage: listMessageIsFetchingNextPage,
  } = getListMessagesInfiniteQuery({ pageSize: 10, conversationId });

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

    socket.on(import.meta.env.VITE_CHAT_EVENT, (data: MessageResponseDto) => {
      setHasNewMessage(true);
      setNewMessages((prev) => {
        // Check if message already exists to prevent duplicates
        if (prev.some((msg) => msg.id === data.id)) {
          return prev;
        }
        return [data, ...prev];
      });
    });

    socketRef.current = socket;

    return () => {
      socket.off(import.meta.env.VITE_CHAT_EVENT);
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const { isPending: isSendMessagePending, mutate: sendMessageMute } =
    sendMessageMutation();

  const {
    isPending: isCreateConversationPending,
    mutate: createConversationMutate,
  } = createConversationMutation();

  // Wrap createConversation to refetch after success
  const handleCreateConversation = () => {
    createConversationMutate(undefined, {
      onSuccess: () => {
        // Refetch conversation to get the new conversation data
        refetchConversation();
      },
    });
  };

  const allMessages = [
    ...(newMessages || []),
    ...(chatMessages?.pages.flatMap((p: ListMessageResponseDto) => p.data) ||
      []),
  ];

  // Remove duplicates by message ID (prioritize socket messages)
  const uniqueMessages = Array.from(
    new Map(allMessages.map((msg) => [msg.id, msg])).values()
  );

  return {
    chatMessages: uniqueMessages,
    fetchNextPage: listMessageFetchNextPage,
    hasNextPage: listMessageHasNextPage,
    isFetchingNextPage: listMessageIsFetchingNextPage,
    isSendMessagePending,
    sendMessageMute,
    conversationId,
    message,
    setMessage,
    conversation: conversation?.data,
    isCreateConversationPending,
    createConversationMutate: handleCreateConversation,
    messagesContainerRef,
    isSendingMessage,
    setIsSendingMessage,
    hasNewMessage,
    setHasNewMessage,
  };
};
