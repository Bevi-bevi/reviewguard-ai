export type {
  AnalysisRecord,
  AnalysisResult,
  DashboardStats,
  DashboardStatsV2,
  PaginatedAnalyses,
  PaginatedAnalysesV2,
  AnalysisRecordV2,
  AnalysisId,
  ImageAnalysisResult,
  UrlAnalysisResult,
  ReviewAnalysisItem,
} from "../backend";

export { AnalysisType } from "../backend";

export type Verdict = "genuine" | "suspicious" | "fake";

export function getVerdict(isFake: boolean, confidenceScore: bigint): Verdict {
  const score = Number(confidenceScore);
  if (isFake) {
    if (score >= 75) return "fake";
    return "suspicious";
  }
  return "genuine";
}

export function formatTimestamp(ts: bigint): string {
  // Backend timestamps are in nanoseconds
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

export function formatScore(score: bigint): string {
  return `${Number(score)}%`;
}

export function getAnalysisTypeLabel(
  type: import("../backend").AnalysisType,
): string {
  switch (type) {
    case "Text":
      return "Text";
    case "Image":
      return "Image";
    case "URL":
      return "URL";
    default:
      return "Text";
  }
}
