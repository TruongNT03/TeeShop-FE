import type { CreateMessageDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const getListMessagesQuery = (
  query: Parameters<typeof apiClient.api.chatControllerGetListMessages>[0]
) => {
  return useQuery({
    queryKey: ["chatMessages", query],
    queryFn: () => apiClient.api.chatControllerGetListMessages(query),
  });
};

export const getListMessagesInfiniteQuery = (opts: { pageSize: number }) => {
  const { pageSize } = opts;
  return useInfiniteQuery({
    queryKey: ["chatMessagesInfinite", pageSize],
    // start from page 1 by default
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }: any) =>
      apiClient.api.chatControllerGetListMessages({
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

export const sendMessageMutation = () => {
  return useMutation({
    mutationFn: (body: CreateMessageDto) =>
      apiClient.api.chatControllerCreateMessage(body),
  });
};

export const getConversationQuery = () => {
  return useQuery({
    queryKey: ["chatConversation"],
    queryFn: () => apiClient.api.chatControllerGetConversation(),
  });
};

export const createConversationMutation = () => {
  return useMutation({
    mutationFn: () => apiClient.api.chatControllerCreateConversation(),
  });
};
