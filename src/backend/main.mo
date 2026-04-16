import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import AnalysisLib "lib/analysis";
import AnalysisMixin "mixins/analysis-api";
import AnalysisTypesLib "lib/analysis-types";
import AnalysisTypesMixin "mixins/analysis-types-api";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let analysisStore : AnalysisLib.AnalysisStore = Map.empty();
  var nextIdValue : Nat = 0;
  let nextIdRef = { var value = nextIdValue };

  include AnalysisMixin(accessControlState, analysisStore, nextIdRef);

  let analysisStoreV2 : AnalysisTypesLib.AnalysisStoreV2 = Map.empty();

  include AnalysisTypesMixin(accessControlState, analysisStoreV2, nextIdRef);
};
