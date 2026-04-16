import { useQuery } from "@tanstack/react-query";
import type { DashboardStatsV2 } from "../types";
import { useBackendActor } from "./useBackendActor";

export function useDashboardStats() {
  const { actor, isFetching } = useBackendActor();

  return useQuery<DashboardStatsV2>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalAnalyses: 0n,
          fakeCount: 0n,
          genuineCount: 0n,
          averageScore: 0n,
          textCount: 0n,
          imageCount: 0n,
          urlCount: 0n,
          recentAnalyses: [],
        };
      }
      return actor.getDashboardStatsV2();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}
