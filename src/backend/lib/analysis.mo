import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Common "../types/common";
import Types "../types/analysis";

module {
  public type AnalysisStore = Map.Map<Common.UserId, List.List<Types.AnalysisRecord>>;

  // --- JSON parsing helpers ---
  // Find the starting index of a needle [Char] in a haystack [Char].
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

  // Extract a boolean value for a given JSON key (e.g. "isFake": true).
  func extractBool(chars : [Char], key : Text) : Bool {
    let searchChars = ("\"" # key # "\"").toArray();
    switch (findSubarray(chars, searchChars)) {
      case null false;
      case (?idx) {
        // Look ahead for "true" or "false"
        let trueChars = "true".toArray();
        let falseChars = "false".toArray();
        let rest = chars.sliceToArray(idx + searchChars.size(), chars.size());
        switch (findSubarray(rest, trueChars)) {
          case null false;
          case (?tIdx) {
            // Make sure "true" comes before any "false"
            switch (findSubarray(rest, falseChars)) {
              case null true;
              case (?fIdx) tIdx < fIdx;
            };
          };
        };
      };
    };
  };

  // Extract a Nat value for a given JSON key (e.g. "confidenceScore": 87).
  func extractNat(chars : [Char], key : Text) : Nat {
    let searchChars = ("\"" # key # "\"").toArray();
    switch (findSubarray(chars, searchChars)) {
      case null 50;
      case (?idx) {
        // Scan past key to find digits
        let start = idx + searchChars.size();
        var i = start;
        // skip non-digits
        while (i < chars.size() and (chars[i] < '0' or chars[i] > '9')) {
          i += 1;
        };
        // collect digits
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

  // Extract a string value for a given JSON key (e.g. "explanation": "...").
  // Handles basic JSON string escaping by treating \" as a non-terminating quote.
  func extractStr(chars : [Char], key : Text) : Text {
    let searchChars = ("\"" # key # "\"").toArray();
    switch (findSubarray(chars, searchChars)) {
      case null "Analysis not available";
      case (?idx) {
        let start = idx + searchChars.size();
        // Find opening quote of value (skip colon, whitespace)
        var i = start;
        let quoteChar : Char = '\"';
        while (i < chars.size() and chars[i] != quoteChar) {
          i += 1;
        };
        if (i >= chars.size()) return "Analysis not available";
        i += 1; // skip opening quote
        // Collect chars until unescaped closing quote
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

  // Parse the AI JSON response into an AnalysisRecord.
  public func parseAiResponse(
    json : Text,
    timestamp : Common.Timestamp,
    id : Common.AnalysisId,
    userId : Common.UserId,
    reviewText : Text,
  ) : Types.AnalysisRecord {
    let chars = json.toArray();
    let isFake = extractBool(chars, "isFake");
    let confidenceScore = extractNat(chars, "confidenceScore");
    let explanation = extractStr(chars, "explanation");
    { id; userId; reviewText; isFake; confidenceScore; explanation; timestamp };
  };

  // Store an analysis record for a user.
  public func storeAnalysis(
    store : AnalysisStore,
    userId : Common.UserId,
    record : Types.AnalysisRecord,
  ) {
    switch (store.get(userId)) {
      case null {
        let userList = List.empty<Types.AnalysisRecord>();
        userList.add(record);
        store.add(userId, userList);
      };
      case (?userList) {
        userList.add(record);
      };
    };
  };

  // Get paginated analyses for a user (newest first).
  public func getUserAnalyses(
    store : AnalysisStore,
    userId : Common.UserId,
    page : Nat,
    pageSize : Nat,
  ) : Types.PaginatedAnalyses {
    let effectivePageSize = if (pageSize == 0) 10 else pageSize;
    switch (store.get(userId)) {
      case null {
        { items = []; total = 0; page; pageSize = effectivePageSize };
      };
      case (?userList) {
        let total = userList.size();
        let start = page * effectivePageSize;
        if (start >= total) {
          return { items = []; total; page; pageSize = effectivePageSize };
        };
        let end = Nat.min(start + effectivePageSize, total);
        let reversed = userList.reverse();
        let items = reversed.sliceToArray(start, end);
        { items; total; page; pageSize = effectivePageSize };
      };
    };
  };

  // Delete a specific analysis record. Returns true if deleted, false if not found.
  public func deleteAnalysis(
    store : AnalysisStore,
    userId : Common.UserId,
    analysisId : Common.AnalysisId,
  ) : Bool {
    switch (store.get(userId)) {
      case null false;
      case (?userList) {
        let sizeBefore = userList.size();
        let filtered = userList.filter(func(r : Types.AnalysisRecord) : Bool {
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

  // Remove all analyses for a user.
  public func clearUserAnalyses(
    store : AnalysisStore,
    userId : Common.UserId,
  ) {
    store.remove(userId);
  };

  // Compute dashboard statistics for a user.
  public func getDashboardStats(
    store : AnalysisStore,
    userId : Common.UserId,
  ) : Types.DashboardStats {
    switch (store.get(userId)) {
      case null {
        { totalAnalyses = 0; fakeCount = 0; genuineCount = 0; averageScore = 0; recentAnalyses = [] };
      };
      case (?userList) {
        let total = userList.size();
        var fakeCount = 0;
        var scoreSum = 0;
        userList.forEach(func(r : Types.AnalysisRecord) {
          if (r.isFake) fakeCount += 1;
          scoreSum += r.confidenceScore;
        });
        let genuineCount = total - fakeCount;
        let averageScore = if (total == 0) 0 else scoreSum / total;
        let reversed = userList.reverse();
        let recentCount = Nat.min(5, total);
        let recentAnalyses = reversed.sliceToArray(0, recentCount);
        { totalAnalyses = total; fakeCount; genuineCount; averageScore; recentAnalyses };
      };
    };
  };
};
