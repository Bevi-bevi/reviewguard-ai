import Common "common";

module {
  public type AnalysisResult = {
    isFake : Bool;
    confidenceScore : Nat;
    explanation : Text;
    timestamp : Common.Timestamp;
  };

  public type AnalysisRecord = {
    id : Common.AnalysisId;
    userId : Common.UserId;
    reviewText : Text;
    isFake : Bool;
    confidenceScore : Nat;
    explanation : Text;
    timestamp : Common.Timestamp;
  };

  public type DashboardStats = {
    totalAnalyses : Nat;
    fakeCount : Nat;
    genuineCount : Nat;
    averageScore : Nat;
    recentAnalyses : [AnalysisRecord];
  };

  public type PaginatedAnalyses = {
    items : [AnalysisRecord];
    total : Nat;
    page : Nat;
    pageSize : Nat;
  };
};
