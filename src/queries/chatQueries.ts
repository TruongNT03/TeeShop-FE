import type { CreateMessageDto, ListMessageResponseDto } from "@/api";
import { apiClient } from "@/services/apiClient";
import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  type QueryFunctionContext,
} from "@tanstack/react-query";

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
  return useInfiniteQuery<ListMessageResponseDto>({
    queryKey: ["chatMessagesInfinite", pageSize],
    initialPageParam: 1,
    queryFn: async ({ pageParam }: QueryFunctionContext) => {
      return (
        await apiClient.api.chatControllerGetListMessages({
          page: pageParam as number,
          pageSize,
        })
      ).data;
    },
    getNextPageParam: (lastPage) => {
      const page = lastPage.paginate.page;
      const total = lastPage.paginate.totalPage;
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
