import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "@/services/apiClient";

export const getDashboardStatisticQuery = (
  statisticBy: "day" | "month" | "year" = "day"
) =>
  queryOptions({
    queryKey: ["admin", "dashboard", "statistic", statisticBy],
    queryFn: () =>
      apiClient.api.adminDashboardControllerGetDashboardStatistic({
        statisticBy,
      }),
  });

export const getLastThirtyDayChartDataQuery = () =>
  queryOptions({
    queryKey: ["admin", "dashboard", "chart-data"],
    queryFn: () =>
      apiClient.api.adminDashboardControllerGetLastThirtyDayChartData(),
  });

export const getPendingOrdersQuery = () =>
  queryOptions({
    queryKey: ["admin", "dashboard", "pending-orders"],
    queryFn: () => apiClient.api.adminDashboardControllerGetPendingOrder(),
  });
