import { useQuery } from "@tanstack/react-query";
import type { AnalysisType, PaginatedAnalysesV2 } from "../types";
import { useBackendActor } from "./useBackendActor";

export function useHistoryV2(
  page = 1,
  pageSize = 10,
  analysisType?: AnalysisType,
) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<PaginatedAnalysesV2>({
    queryKey: ["historyV2", page, pageSize, analysisType],
    queryFn: async () => {
      if (!actor)
        return { total: 0n, page: 1n, pageSize: BigInt(pageSize), items: [] };
      return actor.getMyAnalysesV2(
        BigInt(page),
        BigInt(pageSize),
        analysisType ?? null,
      );
    },
    enabled: !!actor && !isFetching,
  });
}
