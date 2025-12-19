import { apiClient } from "./apiClient";
import type {
  AdminCreateLocationDto,
  AdminListLocationResponseDto,
  AdminUpdateLocationDto,
  RequestParams,
} from "@/api";
import { ContentType } from "@/api";

export const adminLocationApi = {
  getAllLocations: async (
    pageSize: number,
    page?: number,
    search?: string,
    params: RequestParams = {}
  ) => {
    return apiClient.api.adminLocationControllerFindAll(
      {
        pageSize,
        page,
        search,
      },
      params
    );
  },

  createLocation: async (data: AdminCreateLocationDto) => {
    return apiClient.api.adminLocationControllerCreate(data);
  },

  updateLocation: async (id: string, data: AdminUpdateLocationDto) => {
    return apiClient.api.adminLocationControllerUpdate(id, data);
  },
};
