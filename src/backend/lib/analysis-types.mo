import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Common "../types/common";
import Types "../types/analysis-types";

module {
  // Separate store for extended V2 records (image and URL analyses)
  public type AnalysisStoreV2 = Map.Map<Common.UserId, List.List<Types.AnalysisRecordV2>>;

  // Store an extended analysis record for a user.
  public func storeAnalysisV2(
    store : AnalysisStoreV2,
    userId : Common.UserId,
    record : Types.AnalysisRecordV2,
  ) {
    switch (store.get(userId)) {
      case null {
        let userList = List.empty<Types.AnalysisRecordV2>();
        userList.add(record);
        store.add(userId, userList);
      };
      case (?userList) {
        userList.add(record);
      };
    };
  };

  // Get paginated analyses for a user filtered by optional analysis type (newest first).
  public func getUserAnalysesV2(
    store : AnalysisStoreV2,
    userId : Common.UserId,
    page : Nat,
    pageSize : Nat,
    analysisType : ?Types.AnalysisType,
  ) : Types.PaginatedAnalysesV2 {
    let effectivePageSize = if (pageSize == 0) 10 else pageSize;
    switch (store.get(userId)) {
      case null {
        { items = []; total = 0; page; pageSize = effectivePageSize };
      };
      case (?userList) {
        // Apply optional type filter
        let filtered = switch (analysisType) {
          case null userList;
          case (?t) userList.filter(func(r : Types.AnalysisRecordV2) : Bool {
            switch (r.analysisType, t) {
              case (#Text, #Text) true;
              case (#Image, #Image) true;
              case (#URL, #URL) true;
              case _ false;
            };
          });
        };
        let total = filtered.size();
        let start = page * effectivePageSize;
        if (start >= total) {
          return { items = []; total; page; pageSize = effectivePageSize };
        };
        let end = Nat.min(start + effectivePageSize, total);
        let reversed = filtered.reverse();
        let items = reversed.sliceToArray(start, end);
        { items; total; page; pageSize = effectivePageSize };
      };
    };
  };

  // Delete a specific V2 analysis record. Returns true if deleted, false if not found.
  public func deleteAnalysisV2(
    store : AnalysisStoreV2,
    userId : Common.UserId,
    analysisId : Common.AnalysisId,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?userList) {
        let sizeBefore = userList.size();
        let filtered = userList.filter(func(r : Types.AnalysisRecordV2) : Bool {
          r.id != analysisId
        });
        if (filtered.size() == sizeBefore) {
          false;
        } else {
          store.add(userId, filtered);
          true;
        };
      };
    };
  };

  // Remove all V2 analyses for a user.
  public func clearUserAnalysesV2(
    store : AnalysisStoreV2,
    userId : Common.UserId,
  ) {
    store.remove(userId);
  };

  // Compute extended dashboard stats including per-type counts.
  public func getDashboardStatsV2(
    store : AnalysisStoreV2,
    userId : Common.UserId,
  ) : Types.DashboardStatsV2 {
    switch (store.get(userId)) {
      case null {
        {
          totalAnalyses = 0;
          fakeCount = 0;
          genuineCount = 0;
          averageScore = 0;
          recentAnalyses = [];
          textCount = 0;
          imageCount = 0;
          urlCount = 0;
        };
      };
      case (?userList) {
        let total = userList.size();
        var fakeCount = 0;
        var scoreSum = 0;
        var textCount = 0;
        var imageCount = 0;
        var urlCount = 0;
        userList.forEach(func(r : Types.AnalysisRecordV2) {
          if (r.isFake) fakeCount += 1;
          scoreSum += r.confidenceScore;
          switch (r.analysisType) {
            case (#Text) textCount += 1;
            case (#Image) imageCount += 1;
            case (#URL) urlCount += 1;
          };
        });
        let genuineCount = total - fakeCount;
        let averageScore = if (total == 0) 0 else scoreSum / total;
        let reversed = userList.reverse();
        let recentCount = Nat.min(5, total);
        let recentAnalyses = reversed.sliceToArray(0, recentCount);
        {
          totalAnalyses = total;
          fakeCount;
          genuineCount;
          averageScore;
          recentAnalyses;
          textCount;
          imageCount;
          urlCount;
        };
      };
    };
  };

  // --- JSON parsing helpers (shared with analysis-types operations) ---

  func findSubarray(haystack : [Char], needle : [Char]) : ?Nat {
    let hLen = haystack.size();
    let nLen = needle.size();
    if (nLen == 0) return ?0;
    if (nLen > hLen) return null;
    var i = 0;
    while (i <= hLen - nLen) {
      var j = 0;
      var match = true;
      while (j < nLen) {
        if (haystack[i + j] != needle[j]) { match := false; j := nLen };
        j += 1;
      };
      if (match) return ?i;
      i += 1;
    };
    null;
  };

  func extractBool(chars : [Char], key : Text) : Bool {
    let searchChars = ("\"" # key # "\"").toArray();
    switch (findSubarray(chars, searchChars)) {
      case null false;
      case (?idx) {
        let trueChars = "true".toArray();
        let falseChars = "false".toArray();
        let rest = chars.sliceToArray(idx + searchChars.size(), chars.size());
        switch (findSubarray(rest, trueChars)) {
          case null false;
          case (?tIdx) {
            switch (findSubarray(rest, falseChars)) {
              case null true;
              case (?fIdx) tIdx < fIdx;
            };
          };
        };
      };
    };
  };

  func extractNat(chars : [Char], key : Text) : Nat {
    let searchChars = ("\"" # key # "\"").toArray();
    switch (findSubarray(chars, searchChars)) {
      case null 50;
      case (?idx) {
        let start = idx + searchChars.size();
        var i = start;
        while (i < chars.size() and (chars[i] < '0' or chars[i] > '9')) {
          i += 1;
        };
        let digits = List.empty<Char>();
        while (i < chars.size() and chars[i] >= '0' and chars[i] <= '9') {
          digits.add(chars[i]);
          i += 1;
        };
        if (digits.isEmpty()) {
          50;
        } else {
          switch (Nat.fromText(Text.fromArray(digits.toArray()))) {
            case null 50;
            case (?n) n;
          };
        };
      };
    };
  };

  func extractStr(chars : [Char], key : Text) : Text {
    let searchChars = ("\"" # key # "\"").toArray();
    switch (findSubarray(chars, searchChars)) {
      case null "Analysis not available";
      case (?idx) {
        let start = idx + searchChars.size();
        var i = start;
        let quoteChar : Char = '\"';
        while (i < chars.size() and chars[i] != quoteChar) {
          i += 1;
        };
        if (i >= chars.size()) return "Analysis not available";
        i += 1; // skip opening quote
        let result = List.empty<Char>();
        var escaped = false;
        while (i < chars.size()) {
          let c = chars[i];
          if (escaped) {
            if (c == 'n') { result.add('\n') }
            else if (c == 't') { result.add('\t') }
            else if (c == 'r') { result.add('\r') }
            else { result.add(c) };
            escaped := false;
          } else if (c == '\\') {
            escaped := true;
          } else if (c == quoteChar) {
            i := chars.size(); // break
          } else {
            result.add(c);
          };
          i += 1;
        };
        Text.fromArray(result.toArray());
      };
    };
  };

  // Build a ReviewAnalysisItem from AI JSON (isFake, confidenceScore, explanation, plus reviewText).
  public func parseReviewItem(
    json : Text,
    reviewText : Text,
  ) : Types.ReviewAnalysisItem {
    let chars = json.toArray();
    let isFake = extractBool(chars, "isFake");
    let confidenceScore = extractNat(chars, "confidenceScore");
    let explanation = extractStr(chars, "explanation");
    { reviewText; isFake; confidenceScore; explanation };
  };

  // Determine the overall fake verdict for an image from AI JSON response.
  public func parseImageAiResponse(
    json : Text,
    imageKey : Text,
    ocrText : Text,
    timestamp : Common.Timestamp,
  ) : Types.ImageAnalysisResult {
    let chars = json.toArray();
    let textIsFake = extractBool(chars, "textIsFake");
    let imageIsAuthentic = extractBool(chars, "imageIsAuthentic");
    let overallIsFake = extractBool(chars, "overallIsFake");
    let confidenceScore = extractNat(chars, "confidenceScore");
    let explanation = extractStr(chars, "explanation");
    let extractedText = extractStr(chars, "extractedText");
    // Use extractedText from AI if ocrText is empty (it may have been passed as empty)
    let finalOcrText = if (ocrText == "") extractedText else ocrText;
    let ocrVerdict = if (textIsFake)
      "The extracted text shows signs of fake review patterns"
    else
      "The extracted text appears genuine";
    let authenticityVerdict = if (not imageIsAuthentic)
      "Image appears AI-generated or manipulated"
    else
      "Image appears authentic";
    {
      imageKey;
      ocrText = finalOcrText;
      ocrVerdict;
      authenticityVerdict;
      isFake = overallIsFake;
      confidenceScore;
      explanation;
      timestamp;
    };
  };

  // Summarise a list of per-review results into a UrlAnalysisResult.
  public func buildUrlAnalysisResult(
    sourceUrl : Text,
    reviews : [Types.ReviewAnalysisItem],
  ) : Types.UrlAnalysisResult {
    let totalReviews = reviews.size();
    var fakeCount = 0;
    reviews.forEach(func(r : Types.ReviewAnalysisItem) {
      if (r.isFake) fakeCount += 1;
    });
    let genuineCount = totalReviews - fakeCount;
    { sourceUrl; reviews; totalReviews; fakeCount; genuineCount };
  };
};
