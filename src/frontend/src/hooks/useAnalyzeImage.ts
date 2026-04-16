import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ImageAnalysisResult } from "../types";
import { useBackendActor } from "./useBackendActor";

export function useAnalyzeImage() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation<ImageAnalysisResult, Error, string>({
    mutationFn: async (imageKey: string) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.analyzeImage(imageKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStatsV2"] });
      queryClient.invalidateQueries({ queryKey: ["historyV2"] });
    },
  });
}
