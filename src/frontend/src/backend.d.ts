import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ImageAnalysisResult {
    authenticityVerdict: string;
    explanation: string;
    isFake: boolean;
    ocrText: string;
    confidenceScore: bigint;
    imageKey: string;
    timestamp: Timestamp;
    ocrVerdict: string;
}
export type Timestamp = bigint;
export interface UrlAnalysisResult {
    reviews: Array<ReviewAnalysisItem>;
    fakeCount: bigint;
    sourceUrl: string;
    totalReviews: bigint;
    genuineCount: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AnalysisRecordV2 {
    id: AnalysisId;
    userId: UserId;
    analysisType: AnalysisType;
    explanation: string;
    isFake: boolean;
    reviewText: string;
    sourceUrl?: string;
    confidenceScore: bigint;
    imageKey?: string;
    timestamp: Timestamp;
}
export interface DashboardStats {
    totalAnalyses: bigint;
    fakeCount: bigint;
    recentAnalyses: Array<AnalysisRecord>;
    genuineCount: bigint;
    averageScore: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface PaginatedAnalyses {
    total: bigint;
    page: bigint;
    pageSize: bigint;
    items: Array<AnalysisRecord>;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type UserId = Principal;
export interface ReviewAnalysisItem {
    explanation: string;
    isFake: boolean;
    reviewText: string;
    confidenceScore: bigint;
}
export interface AnalysisRecord {
    id: AnalysisId;
    userId: UserId;
    explanation: string;
    isFake: boolean;
    reviewText: string;
    confidenceScore: bigint;
    timestamp: Timestamp;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PaginatedAnalysesV2 {
    total: bigint;
    page: bigint;
    pageSize: bigint;
    items: Array<AnalysisRecordV2>;
}
export type AnalysisId = bigint;
export interface AnalysisResult {
    explanation: string;
    isFake: boolean;
    confidenceScore: bigint;
    timestamp: Timestamp;
}
export interface DashboardStatsV2 {
    totalAnalyses: bigint;
    imageCount: bigint;
    fakeCount: bigint;
    recentAnalyses: Array<AnalysisRecordV2>;
    urlCount: bigint;
    textCount: bigint;
    genuineCount: bigint;
    averageScore: bigint;
}
export enum AnalysisType {
    URL = "URL",
    Text = "Text",
    Image = "Image"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    analyzeImage(imageKey: string): Promise<ImageAnalysisResult>;
    analyzeProductUrl(url: string): Promise<UrlAnalysisResult>;
    analyzeReview(reviewText: string): Promise<AnalysisResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearMyAnalyses(): Promise<void>;
    deleteAnalysis(analysisId: AnalysisId): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getDashboardStatsV2(): Promise<DashboardStatsV2>;
    getMyAnalyses(page: bigint, pageSize: bigint): Promise<PaginatedAnalyses>;
    getMyAnalysesV2(page: bigint, pageSize: bigint, analysisType: AnalysisType | null): Promise<PaginatedAnalysesV2>;
    isCallerAdmin(): Promise<boolean>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    transformV2(input: TransformationInput): Promise<TransformationOutput>;
}
