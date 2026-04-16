import type { backendInterface } from "../backend";
import { AnalysisType, UserRole } from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const oneDay = BigInt(86_400_000_000_000);

const sampleAnalyses = [
  {
    id: BigInt(1),
    userId: Principal.anonymous(),
    reviewText:
      "This product is absolutely amazing! Best purchase I have ever made. Everyone should buy this right now!",
    explanation:
      "The review uses excessive superlatives, lacks specific details, and employs high-pressure language typical of fake reviews. The writing pattern matches known bot-generated content.",
    isFake: true,
    confidenceScore: BigInt(92),
    timestamp: now - oneDay,
  },
  {
    id: BigInt(2),
    userId: Principal.anonymous(),
    reviewText:
      "I bought this coffee maker 3 months ago. It brews quickly and the carafe keeps coffee hot for about 2 hours. The only downside is the water reservoir is a bit hard to fill.",
    explanation:
      "The review is balanced, specific, and includes both positive and negative aspects. The timeline and details are consistent with a genuine user experience.",
    isFake: false,
    confidenceScore: BigInt(87),
    timestamp: now - oneDay * BigInt(2),
  },
  {
    id: BigInt(3),
    userId: Principal.anonymous(),
    reviewText:
      "Five stars! Perfect product! Changed my life! Order now before it runs out! This is the best thing ever created!",
    explanation:
      "This review contains multiple red flags: excessive exclamation marks, vague praise, urgency tactics, and no specific product details. High probability of being artificially generated.",
    isFake: true,
    confidenceScore: BigInt(97),
    timestamp: now - oneDay * BigInt(3),
  },
  {
    id: BigInt(4),
    userId: Principal.anonymous(),
    reviewText:
      "Decent hiking boots. Broke them in over 2 weeks. The ankle support is solid but the toe box runs narrow. Returned for half size up. Good waterproofing in rain.",
    explanation:
      "Genuine review characteristics: specific use case, break-in period mentioned, sizing advice, and practical observations. Language and detail level are consistent with authentic buyer.",
    isFake: false,
    confidenceScore: BigInt(91),
    timestamp: now - oneDay * BigInt(4),
  },
  {
    id: BigInt(5),
    userId: Principal.anonymous(),
    reviewText:
      "DO NOT BUY! Worst product ever! Company is scam! I want refund! This destroyed my life!",
    explanation:
      "Extreme negative sentiment with no specific details or constructive criticism. Pattern matches review-bombing behavior commonly used by competitors. Likely not a genuine customer experience.",
    isFake: true,
    confidenceScore: BigInt(78),
    timestamp: now - oneDay * BigInt(5),
  },
];

const sampleAnalysesV2 = sampleAnalyses.map((r) => ({
  ...r,
  analysisType: AnalysisType.Text as AnalysisType,
  sourceUrl: undefined,
  imageKey: undefined,
}));

export const mockBackend: backendInterface = {
  analyzeReview: async (reviewText: string) => {
    await new Promise((r) => setTimeout(r, 1200));
    const isFake = reviewText.split("!").length > 3 || reviewText.length < 50;
    return {
      explanation: isFake
        ? "The review contains multiple indicators of artificial generation: excessive exclamation marks, lack of specific product details, and generic superlatives. Our AI model detected patterns consistent with known fake review templates."
        : "The review demonstrates authentic characteristics: specific product details, balanced perspective, and natural language patterns. No significant indicators of artificial generation were detected.",
      isFake,
      confidenceScore: isFake ? BigInt(88) : BigInt(83),
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };
  },

  analyzeImage: async (imageKey: string) => {
    await new Promise((r) => setTimeout(r, 1800));
    return {
      imageKey,
      ocrText: "Sample OCR extracted text from the uploaded image.",
      ocrVerdict: "The extracted text shows signs of generic, promotional language.",
      authenticityVerdict: "Image appears to be an authentic, unmodified screenshot.",
      isFake: true,
      confidenceScore: BigInt(76),
      explanation:
        "OCR extraction revealed promotional language patterns. The image itself appears unmodified.",
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    };
  },

  analyzeProductUrl: async (url: string) => {
    await new Promise((r) => setTimeout(r, 2200));
    return {
      sourceUrl: url,
      reviews: [
        {
          reviewText: "Amazing product, highly recommend!",
          isFake: true,
          confidenceScore: BigInt(89),
          explanation: "Generic praise with no specific details.",
        },
        {
          reviewText:
            "Good build quality but the strap is a bit tight. Took about a week to break in.",
          isFake: false,
          confidenceScore: BigInt(91),
          explanation: "Specific, balanced, genuine user experience.",
        },
      ],
      totalReviews: BigInt(2),
      fakeCount: BigInt(1),
      genuineCount: BigInt(1),
    };
  },

  assignCallerUserRole: async () => undefined,

  _initializeAccessControl: async () => undefined,

  clearMyAnalyses: async () => undefined,

  deleteAnalysis: async () => true,

  getCallerUserRole: async () => UserRole.user,

  getDashboardStats: async () => ({
    totalAnalyses: BigInt(47),
    fakeCount: BigInt(28),
    genuineCount: BigInt(19),
    averageScore: BigInt(84),
    recentAnalyses: sampleAnalyses.slice(0, 3),
  }),

  getDashboardStatsV2: async () => ({
    totalAnalyses: BigInt(47),
    fakeCount: BigInt(28),
    genuineCount: BigInt(19),
    averageScore: BigInt(84),
    textCount: BigInt(32),
    imageCount: BigInt(8),
    urlCount: BigInt(7),
    recentAnalyses: sampleAnalysesV2.slice(0, 3),
  }),

  getMyAnalyses: async (page: bigint, pageSize: bigint) => ({
    total: BigInt(sampleAnalyses.length),
    page,
    pageSize,
    items: sampleAnalyses,
  }),

  getMyAnalysesV2: async (page: bigint, pageSize: bigint, analysisType) => ({
    total: BigInt(
      analysisType ? sampleAnalysesV2.filter((r) => r.analysisType === analysisType).length : sampleAnalysesV2.length,
    ),
    page,
    pageSize,
    items: analysisType
      ? sampleAnalysesV2.filter((r) => r.analysisType === analysisType)
      : sampleAnalysesV2,
  }),

  isCallerAdmin: async () => false,

  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),

  transformV2: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
};
