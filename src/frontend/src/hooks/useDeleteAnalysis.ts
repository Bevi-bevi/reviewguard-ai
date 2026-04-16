import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AnalysisId } from "../types";
import { useBackendActor } from "./useBackendActor";

export function useDeleteAnalysis() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, AnalysisId>({
    mutationFn: async (analysisId: AnalysisId) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.deleteAnalysis(analysisId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
