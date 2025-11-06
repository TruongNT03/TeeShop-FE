import type { CreateMessageDto } from "@/api";
import { apiClient } from "./apiClient";

export const ChatService = {
  getListMessages: async (
    query: Parameters<typeof apiClient.api.chatControllerGetListMessages>[0]
  ) => apiClient.api.chatControllerGetListMessages(query),

  sendMessage: async (body: CreateMessageDto) =>
    apiClient.api.chatControllerCreateMessage(body),

  getConversation: async () => apiClient.api.chatControllerGetConversation(),
};
