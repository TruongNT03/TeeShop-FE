import type { CreateMessageDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const adminGetListConversationsQuery = (
  query: Parameters<
    typeof apiClient.api.adminChatControllerGetListConversation
  >[0]
) => {
  return useQuery({
    queryKey: ["adminChatConversations", query],
    queryFn: () => apiClient.api.adminChatControllerGetListConversation(query),
  });
};

export const adminGetListMessagesQuery = (
  query: Parameters<typeof apiClient.api.adminChatControllerGetListMessages>[1],
  conversationId: string
) => {
  return useQuery({
    queryKey: ["adminChatMessages", query, conversationId],
    queryFn: () =>
      apiClient.api.adminChatControllerGetListMessages(conversationId, query),
  });
};

export const adminSendMessageMutation = () => {
  return useMutation({
    mutationFn: (body: CreateMessageDto) =>
      apiClient.api.chatControllerCreateMessage(body),
  });
};

export const getListMessagesInfiniteQuery = (opts: {
  pageSize: number;
  conversationId: string;
}) => {
  const { pageSize, conversationId } = opts;
  return useInfiniteQuery({
    queryKey: ["adminChatMessagesInfinite", pageSize, conversationId],
    // start from page 1 by default
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }: any) =>
      apiClient.api.adminChatControllerGetListMessages(conversationId, {
        page: pageParam,
        pageSize,
      }),

    getNextPageParam: (lastPage: any) => {
      const page = lastPage.data.paginate.page;
      const total = lastPage.data.paginate.totalPage;
      return page < total ? page + 1 : undefined;
    },
  });
};
