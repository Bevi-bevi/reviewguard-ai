import { useActor as useCoreActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";

export function useBackendActor() {
  return useCoreActor<backendInterface>(createActor);
}
