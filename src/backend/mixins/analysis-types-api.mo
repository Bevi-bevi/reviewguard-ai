import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Common "../types/common";
import Types "../types/analysis-types";
import AnalysisTypesLib "../lib/analysis-types";

mixin (
  accessControlState : AccessControl.AccessControlState,
  analysisStoreV2 : AnalysisTypesLib.AnalysisStoreV2,
  nextIdRef : { var value : Nat },
) {
  // Analyze an image given its object-storage key.
  // Fetches the image URL, runs OCR + authenticity check via AI, stores as #Image record.
  public shared ({ caller }) func analyzeImage(imageKey : Text) : async Types.ImageAnalysisResult {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");

    // Build the image URL from the object-storage key pattern
    let imageUrl = "https://storage.caffeine.ai/" # imageKey;

    let prompt = "You are an expert image and review authenticity analyst. Analyze the provided image (which is a screenshot of a product review page). Perform two tasks: (1) Extract any visible review text via OCR and analyze it for fake review patterns such as generic language, excessive positivity, vague descriptions, suspicious phrasing. (2) Detect if the image itself has been manipulated, edited, or appears AI-generated. Return ONLY a valid JSON object with exactly these fields: {\\\"extractedText\\\": \\\"<all visible review text extracted from the image>\\\", \\\"textIsFake\\\": <true or false based on text analysis>, \\\"textConfidence\\\": <integer 0-100>, \\\"imageIsAuthentic\\\": <true if image appears real, false if manipulated/AI-generated>, \\\"overallIsFake\\\": <true if review is likely fake based on both analyses>, \\\"confidenceScore\\\": <integer 0-100 overall confidence>, \\\"explanation\\\": \\\"<brief explanation covering both text and image analysis findings>\\\"}. Do not include any text outside the JSON object.";

    let requestBody = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":[{\"type\":\"text\",\"text\":\"" # prompt # "\"},{\"type\":\"image_url\",\"image_url\":{\"url\":\"" # imageUrl # "\"}}]}],\"max_tokens\":500,\"temperature\":0.2}";

    let apiKey = "";
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer " # apiKey },
    ];

    let responseText = await OutCall.httpPostRequest(
      "https://api.openai.com/v1/chat/completions",
      headers,
      requestBody,
      transformV2,
    );

    let aiJson = extractOpenAiContentV2(responseText);
    let timestamp : Common.Timestamp = Time.now();
    let result = AnalysisTypesLib.parseImageAiResponse(aiJson, imageKey, "", timestamp);

    // Store as AnalysisRecordV2 with type #Image
    let id = nextIdRef.value;
    nextIdRef.value += 1;
    let record : Types.AnalysisRecordV2 = {
      id;
      userId = caller;
      reviewText = result.ocrText;
      isFake = result.isFake;
      confidenceScore = result.confidenceScore;
      explanation = result.explanation;
      timestamp;
      analysisType = #Image;
      sourceUrl = null;
      imageKey = ?imageKey;
    };
    AnalysisTypesLib.storeAnalysisV2(analysisStoreV2, caller, record);

    result;
  };

  // Fetch all reviews from a product URL and analyze each one.
  // Stores results as #URL records, returns per-review results.
  public shared ({ caller }) func analyzeProductUrl(url : Text) : async Types.UrlAnalysisResult {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");

    // Validate URL scheme
    if (not (url.startsWith(#text "http://") or url.startsWith(#text "https://"))) {
      Runtime.trap("Invalid URL: must start with http:// or https://");
    };

    // Fetch the product page HTML
    let pageHtml = await OutCall.httpGetRequest(url, [], transformV2);

    // Extract review text segments from HTML
    let rawReviews = extractReviewsFromHtml(pageHtml);
    let maxReviews = Nat.min(rawReviews.size(), 20);
    let reviewsToAnalyze = rawReviews.sliceToArray(0, maxReviews);

    // Analyze each review via AI
    let reviewItems = List.empty<Types.ReviewAnalysisItem>();
    let apiKey = "";
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Authorization"; value = "Bearer " # apiKey },
    ];

    var i = 0;
    while (i < reviewsToAnalyze.size()) {
      let reviewText = reviewsToAnalyze[i];
      let escapedText = escapeJsonStrV2(reviewText);
      let prompt = "You are a product review authenticity detector. Analyze the following product review and determine if it is fake or genuine. Return ONLY a valid JSON object with exactly these fields: {\\\"isFake\\\": <true or false>, \\\"confidenceScore\\\": <integer 0-100>, \\\"explanation\\\": \\\"<brief explanation of key indicators>\\\"}. Do not include any text outside the JSON object.\\n\\nReview to analyze:\\n" # escapedText;
      let requestBody = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":\"" # prompt # "\"}],\"max_tokens\":300,\"temperature\":0.2}";

      let responseText = await OutCall.httpPostRequest(
        "https://api.openai.com/v1/chat/completions",
        headers,
        requestBody,
        transformV2,
      );
      let aiJson = extractOpenAiContentV2(responseText);
      let item = AnalysisTypesLib.parseReviewItem(aiJson, reviewText);
      reviewItems.add(item);

      // Store each review as an individual AnalysisRecordV2
      let timestamp : Common.Timestamp = Time.now();
      let id = nextIdRef.value;
      nextIdRef.value += 1;
      let record : Types.AnalysisRecordV2 = {
        id;
        userId = caller;
        reviewText = item.reviewText;
        isFake = item.isFake;
        confidenceScore = item.confidenceScore;
        explanation = item.explanation;
        timestamp;
        analysisType = #URL;
        sourceUrl = ?url;
        imageKey = null;
      };
      AnalysisTypesLib.storeAnalysisV2(analysisStoreV2, caller, record);

      i += 1;
    };

    AnalysisTypesLib.buildUrlAnalysisResult(url, reviewItems.toArray());
  };

  // Get paginated analyses filtered by optional analysis type (for separate history tabs).
  public query ({ caller }) func getMyAnalysesV2(
    page : Nat,
    pageSize : Nat,
    analysisType : ?Types.AnalysisType,
  ) : async Types.PaginatedAnalysesV2 {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    AnalysisTypesLib.getUserAnalysesV2(analysisStoreV2, caller, page, pageSize, analysisType);
  };

  // Extended dashboard stats including per-type counts (textCount, imageCount, urlCount).
  public query ({ caller }) func getDashboardStatsV2() : async Types.DashboardStatsV2 {
    if (caller.isAnonymous()) Runtime.trap("Authentication required");
    AnalysisTypesLib.getDashboardStatsV2(analysisStoreV2, caller);
  };

  // ---- Private helpers ----

  // HTTP transformation function (strips response headers for determinism).
  // Named differently from analysis-api's 'transform' to avoid duplicate public function names.
  public query func transformV2(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Find starting index of needle chars in haystack chars (V2 variant).
  func findSubarrayV2(haystack : [Char], needle : [Char]) : ?Nat {
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

  // Extract the AI-generated JSON object from OpenAI API response body (V2 variant).
  func extractOpenAiContentV2(responseText : Text) : Text {
    let chars = responseText.toArray();
    let contentKey = "\"content\":\"".toArray();
    switch (findSubarrayV2(chars, contentKey)) {
      case null responseText;
      case (?idx) {
        let afterContent = chars.sliceToArray(idx + contentKey.size(), chars.size());
        let openBrace = "{".toArray();
        switch (findSubarrayV2(afterContent, openBrace)) {
          case null responseText;
          case (?braceStart) {
            var depth = 0;
            var endIdx = braceStart;
            var i = braceStart;
            var escaped = false;
            var inString = false;
            let dqChar : Char = '\"';
            let bsChar : Char = '\\';
            while (i < afterContent.size()) {
              let c = afterContent[i];
              if (escaped) {
                escaped := false;
              } else if (c == bsChar and inString) {
                escaped := true;
              } else if (c == dqChar) {
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

  // Escape a string for safe embedding inside a JSON string value (V2 variant).
  func escapeJsonStrV2(s : Text) : Text {
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

  // Extract review text segments from raw HTML.
  // Looks for text between common review-container HTML tags/patterns.
  func extractReviewsFromHtml(html : Text) : [Text] {
    let reviews = List.empty<Text>();
    // Split HTML into segments by common review class/tag markers
    // Strategy: look for content between <span ...review...> or <div ...review...> patterns
    // We search for common patterns that wrap review text
    let patterns = [
      "review-body",
      "review-text",
      "reviewText",
      "review_body",
      "comment-body",
      "comment-text",
      "feedback-text",
      "review-content",
    ];

    let htmlLower = html.toLower();
    let htmlChars = html.toArray();
    let htmlLowerChars = htmlLower.toArray();

    for (pattern in patterns.values()) {
      let patternChars = pattern.toArray();
      var searchStart = 0;
      var found = true;
      while (found and reviews.size() < 20) {
        let slice = htmlLowerChars.sliceToArray(searchStart, htmlLowerChars.size());
        switch (findSubarrayV2(slice, patternChars)) {
          case null { found := false };
          case (?relIdx) {
            let absIdx = searchStart + relIdx;
            // Find the next closing > after the pattern
            var closeTag = absIdx + patternChars.size();
            while (closeTag < htmlChars.size() and htmlChars[closeTag] != '>') {
              closeTag += 1;
            };
            if (closeTag < htmlChars.size()) {
              closeTag += 1; // skip >
              // Collect text until the next < (tag open)
              let textChars = List.empty<Char>();
              var j = closeTag;
              while (j < htmlChars.size() and htmlChars[j] != '<') {
                textChars.add(htmlChars[j]);
                j += 1;
              };
              let reviewText = Text.fromArray(textChars.toArray()).trim(#char ' ');
              let trimmed = reviewText.trim(#char '\n').trim(#char '\r').trim(#char '\t').trim(#char ' ');
              if (trimmed.size() > 20) {
                reviews.add(trimmed);
              };
              searchStart := absIdx + patternChars.size() + 1;
            } else {
              found := false;
            };
          };
        };
      };
    };

    // If no structured reviews found, try generic paragraph / list item approach
    if (reviews.isEmpty()) {
      let pTag = "<p".toArray();
      let liTag = "<li".toArray();
      for (tag in [pTag, liTag].values()) {
        var searchStart = 0;
        var found = true;
        while (found and reviews.size() < 20) {
          let slice = htmlLowerChars.sliceToArray(searchStart, htmlLowerChars.size());
          switch (findSubarrayV2(slice, tag)) {
            case null { found := false };
            case (?relIdx) {
              let absIdx = searchStart + relIdx;
              var closeTag = absIdx + tag.size();
              while (closeTag < htmlChars.size() and htmlChars[closeTag] != '>') {
                closeTag += 1;
              };
              if (closeTag < htmlChars.size()) {
                closeTag += 1;
                let textChars = List.empty<Char>();
                var j = closeTag;
                while (j < htmlChars.size() and htmlChars[j] != '<') {
                  textChars.add(htmlChars[j]);
                  j += 1;
                };
                let trimmed = Text.fromArray(textChars.toArray()).trim(#char ' ').trim(#char '\n').trim(#char '\r').trim(#char '\t').trim(#char ' ');
                if (trimmed.size() > 30) {
                  reviews.add(trimmed);
                };
                searchStart := absIdx + tag.size() + 1;
              } else {
                found := false;
              };
            };
          };
        };
      };
    };

    reviews.toArray();
  };
};
