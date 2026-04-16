import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UrlAnalysisResult } from "../types";
import { useBackendActor } from "./useBackendActor";

export function useAnalyzeUrl() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation<UrlAnalysisResult, Error, string>({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.analyzeProductUrl(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStatsV2"] });
      queryClient.invalidateQueries({ queryKey: ["historyV2"] });
    },
  });
}
