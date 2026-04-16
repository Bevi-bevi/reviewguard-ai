import Common "common";

module {
  // Discriminates which input type was used for the analysis
  public type AnalysisType = {
    #Text;
    #Image;
    #URL;
  };

  // Extended analysis record — superset of the original AnalysisRecord
  // with new analysisType, optional sourceUrl, and optional imageKey fields
  public type AnalysisRecordV2 = {
    id : Common.AnalysisId;
    userId : Common.UserId;
    reviewText : Text;
    isFake : Bool;
    confidenceScore : Nat;
    explanation : Text;
    timestamp : Common.Timestamp;
    analysisType : AnalysisType;
    sourceUrl : ?Text;   // populated for #URL analyses
    imageKey : ?Text;    // populated for #Image analyses (object-storage key)
  };

  // Per-review result for URL analysis (each review found on the product page)
  public type ReviewAnalysisItem = {
    reviewText : Text;
    isFake : Bool;
    confidenceScore : Nat;
    explanation : Text;
  };

  // Full result returned by analyzeProductUrl
  public type UrlAnalysisResult = {
    sourceUrl : Text;
    reviews : [ReviewAnalysisItem];
    totalReviews : Nat;
    fakeCount : Nat;
    genuineCount : Nat;
  };

  // Full result returned by analyzeImage
  public type ImageAnalysisResult = {
    imageKey : Text;
    ocrText : Text;
    ocrVerdict : Text;        // e.g. "The extracted text shows signs of fake review patterns"
    authenticityVerdict : Text; // e.g. "Image appears AI-generated based on ..."
    isFake : Bool;
    confidenceScore : Nat;
    explanation : Text;
    timestamp : Common.Timestamp;
  };

  // Extended dashboard stats with per-type counts
  public type DashboardStatsV2 = {
    totalAnalyses : Nat;
    fakeCount : Nat;
    genuineCount : Nat;
    averageScore : Nat;
    recentAnalyses : [AnalysisRecordV2];
    textCount : Nat;
    imageCount : Nat;
    urlCount : Nat;
  };

  // Paginated result using extended record type
  public type PaginatedAnalysesV2 = {
    items : [AnalysisRecordV2];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };
};
