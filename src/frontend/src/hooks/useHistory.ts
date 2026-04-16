import { useQuery } from "@tanstack/react-query";
import type { PaginatedAnalyses } from "../types";
import { useBackendActor } from "./useBackendActor";

export function useHistory(page = 1, pageSize = 10) {
  const { actor, isFetching } = useBackendActor();

  return useQuery<PaginatedAnalyses>({
    queryKey: ["history", page, pageSize],
    queryFn: async () => {
      if (!actor) return { total: 0n, page: 1n, pageSize: 10n, items: [] };
      return actor.getMyAnalyses(BigInt(page), BigInt(pageSize));
    },
    enabled: !!actor && !isFetching,
  });
}
