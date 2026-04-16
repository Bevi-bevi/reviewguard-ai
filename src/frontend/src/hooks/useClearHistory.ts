import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBackendActor } from "./useBackendActor";

export function useClearHistory() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.clearMyAnalyses();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });
}
