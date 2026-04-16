import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AnalysisResult } from "../types";
import { useBackendActor } from "./useBackendActor";

export function useAnalyze() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation<AnalysisResult, Error, string>({
    mutationFn: async (reviewText: string) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.analyzeReview(reviewText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
