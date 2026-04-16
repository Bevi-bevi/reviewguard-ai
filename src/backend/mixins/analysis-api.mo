import List "mo:core/List";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import Types "../types/analysis";
import AnalysisLib "../lib/analysis";

mixin (
  accessControlState : AccessControl.AccessControlState,
  analysisStore : AnalysisLib.AnalysisStore,
  nextIdRef : { var value : Nat },
) {
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func analyzeReview(reviewText : Text) : async Types.AnalysisResult {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");

    let escapedText = escapeJsonStr(reviewText);
    let prompt = "You are a product review authenticity detector. Analyze the following product review and determine if it is fake or genuine. Return ONLY a valid JSON object with exactly these fields: {\\\"isFake\\\": <true or false>, \\\"confidenceScore\\\": <integer 0-100>, \\\"explanation\\\": \\\"<brief explanation of key indicators>\\\"}. Do not include any text outside the JSON object.\\n\\nReview to analyze:\\n" # escapedText;

    let requestBody = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":\"" # prompt # "\"}],\"max_tokens\":300,\"temperature\":0.2}";

    let apiKey = ""; // API key to be configured via canister init or environment variable
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer " # apiKey },
    ];

    let responseText = await OutCall.httpPostRequest(
      "https://api.openai.com/v1/chat/completions",
      headers,
      requestBody,
      transform,
    );

    let aiJson = extractOpenAiContent(responseText);

    let timestamp : Common.Timestamp = Time.now();
    let id = nextIdRef.value;
    nextIdRef.value += 1;

    let record = AnalysisLib.parseAiResponse(aiJson, timestamp, id, caller, reviewText);
    AnalysisLib.storeAnalysis(analysisStore, caller, record);

    {
      isFake = record.isFake;
      confidenceScore = record.confidenceScore;
      explanation = record.explanation;
      timestamp = record.timestamp;
    };
  };

  public query ({ caller }) func getMyAnalyses(page : Nat, pageSize : Nat) : async Types.PaginatedAnalyses {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    AnalysisLib.getUserAnalyses(analysisStore, caller, page, pageSize);
  };

  public shared ({ caller }) func deleteAnalysis(analysisId : Common.AnalysisId) : async Bool {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    AnalysisLib.deleteAnalysis(analysisStore, caller, analysisId);
  };

  public shared ({ caller }) func clearMyAnalyses() : async () {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    AnalysisLib.clearUserAnalyses(analysisStore, caller);
  };

  public query ({ caller }) func getDashboardStats() : async Types.DashboardStats {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    AnalysisLib.getDashboardStats(analysisStore, caller);
  };

  // Escape a string for safe embedding inside a JSON string value.
  func escapeJsonStr(s : Text) : Text {
    let result = List.empty<Text>();
    let dqChar : Char = '\"';
    let bsChar : Char = '\\';
    for (c in s.toIter()) {
      if (c == dqChar) result.add("\\\"")
      else if (c == bsChar) result.add("\\\\")
      else if (c == '\n') result.add("\\n")
      else if (c == '\r') result.add("\\r")
      else if (c == '\t') result.add("\\t")
      else result.add(Text.fromChar(c));
    };
    result.values().join("");
  };

  // Find starting index of needle chars in haystack chars.
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

  // Extract the AI-generated JSON object from OpenAI API response body.
  // Response structure: {"choices":[{"message":{"content":"<json>"}}]}
  func extractOpenAiContent(responseText : Text) : Text {
    let chars = responseText.toArray();
    let contentKey = "\"content\":\"".toArray();
    switch (findSubarray(chars, contentKey)) {
      case null responseText;
      case (?idx) {
        let afterContent = chars.sliceToArray(idx + contentKey.size(), chars.size());
        // Find opening { of the JSON object in the content string
        let openBrace = "{".toArray();
        switch (findSubarray(afterContent, openBrace)) {
          case null responseText;
          case (?braceStart) {
            // Walk forward to find the matching closing brace
            var depth = 0;
            var endIdx = braceStart;
            var i = braceStart;
            var escaped = false;
            var inString = false;
            let dqChar2 : Char = '\"';
            let bsChar2 : Char = '\\';
            while (i < afterContent.size()) {
              let c = afterContent[i];
              if (escaped) {
                escaped := false;
              } else if (c == bsChar2 and inString) {
                escaped := true;
              } else if (c == dqChar2) {
                inString := not inString;
              } else if (not inString) {
                if (c == '{') depth += 1;
                if (c == '}') {
                  depth -= 1;
                  if (depth == 0) { endIdx := i; i := afterContent.size() };
                };
              };
              i += 1;
            };
            Text.fromArray(afterContent.sliceToArray(braceStart, endIdx + 1));
          };
        };
      };
    };
  };
};
