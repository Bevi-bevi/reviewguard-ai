import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Loader2,
  LogIn,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ConfidenceBar } from "../components/ConfidenceBar";
import { VerdictBadge } from "../components/VerdictBadge";
import { useAnalyzeUrl } from "../hooks/useAnalyzeUrl";
import { getVerdict } from "../types";
import type { ReviewAnalysisItem, UrlAnalysisResult } from "../types";

const URL_PATTERN = /^https?:\/\/.+/;

function LoginPrompt() {
  const { login } = useInternetIdentity();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card px-8 py-14 text-center"
      data-ocid="analyze_url.login_prompt"
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{
          background: "oklch(var(--primary) / 0.12)",
          border: "1.5px solid oklch(var(--primary) / 0.3)",
        }}
      >
        <LogIn className="h-7 w-7 text-primary" />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-xl font-bold text-foreground">
          Sign in to analyze URLs
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          You need to be signed in with Internet Identity to run AI-powered URL
          review analysis and save your results.
        </p>
      </div>
      <Button
        onClick={login}
        className="gap-2"
        data-ocid="analyze_url.login_button"
      >
        <LogIn className="h-4 w-4" />
        Sign in with Internet Identity
      </Button>
    </motion.div>
  );
}

function ReviewRow({
  review,
  index,
  isFake,
}: {
  review: ReviewAnalysisItem;
  index: number;
  isFake: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const verdict = getVerdict(review.isFake, review.confidenceScore);
  const score = Number(review.confidenceScore);
  const excerpt =
    review.reviewText.length > 120
      ? `${review.reviewText.slice(0, 117)}…`
      : review.reviewText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      data-ocid={`analyze_url.review_item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left group"
        aria-expanded={expanded}
      >
        <div
          className={`flex items-center gap-3 px-4 py-3 border-b border-border transition-colors duration-150 hover:bg-muted/40 ${
            expanded ? "bg-muted/20" : ""
          }`}
        >
          <div className="shrink-0">
            {isFake ? (
              <XCircle size={14} style={{ color: "oklch(var(--chart-3))" }} />
            ) : (
              <CheckCircle2
                size={14}
                style={{ color: "oklch(var(--chart-4))" }}
              />
            )}
          </div>
          <div className="w-[130px] shrink-0">
            <VerdictBadge verdict={verdict} size="sm" />
          </div>
          <div className="w-12 shrink-0 text-right">
            <span className="font-mono text-xs tabular-nums text-foreground">
              {score}%
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm text-muted-foreground">{excerpt}</p>
          </div>
          <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div
              className={`px-5 py-4 border-b border-border ${
                verdict === "genuine"
                  ? "result-genuine"
                  : verdict === "fake"
                    ? "result-fake"
                    : "result-suspicious"
              }`}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Full Review
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {review.reviewText}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    AI Explanation
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {review.explanation}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <ConfidenceBar score={score} verdict={verdict} showLabel />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ReviewGroup({
  title,
  reviews,
  isFake,
  accent,
  icon: Icon,
  startIndex,
}: {
  title: string;
  reviews: ReviewAnalysisItem[];
  isFake: boolean;
  accent: string;
  icon: React.ElementType;
  startIndex: number;
}) {
  if (reviews.length === 0) return null;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: `oklch(${accent} / 0.3)` }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{
          background: `oklch(${accent} / 0.06)`,
          borderColor: `oklch(${accent} / 0.2)`,
        }}
      >
        <Icon size={14} style={{ color: `oklch(${accent})` }} />
        <h3
          className="font-display text-sm font-semibold"
          style={{ color: `oklch(${accent})` }}
        >
          {title}
        </h3>
        <span
          className="ml-auto font-mono text-xs font-bold px-2 py-0.5 rounded-sm"
          style={{
            background: `oklch(${accent} / 0.12)`,
            color: `oklch(${accent})`,
          }}
        >
          {reviews.length}
        </span>
      </div>
      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 border-b border-border text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <div className="w-4 shrink-0" />
        <div className="w-[130px] shrink-0">Verdict</div>
        <div className="w-12 shrink-0 text-right">Score</div>
        <div className="flex-1">Review</div>
        <div className="w-4 shrink-0" />
      </div>
      {reviews.map((review, i) => (
        <ReviewRow
          key={`${isFake ? "fake" : "genuine"}-${startIndex + i}`}
          review={review}
          index={startIndex + i}
          isFake={isFake}
        />
      ))}
    </div>
  );
}

function UrlResultView({
  result,
  onReset,
}: {
  result: UrlAnalysisResult;
  onReset: () => void;
}) {
  const total = Number(result.totalReviews);
  const genuine = Number(result.genuineCount);
  const fake = Number(result.fakeCount);
  const genuineReviews = result.reviews.filter((r) => !r.isFake);
  const fakeReviews = result.reviews.filter((r) => r.isFake);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-5"
    >
      {/* Summary header */}
      <Card className="p-5" data-ocid="analyze_url.summary_card">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Analysis Complete
            </h3>
            <a
              href={result.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline mt-1 break-all"
            >
              <ExternalLink size={11} />
              {result.sourceUrl}
            </a>
          </div>
          <div className="font-mono text-2xl font-bold text-foreground tabular-nums">
            {total}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total", value: total, color: "var(--primary)" },
            { label: "Genuine", value: genuine, color: "var(--chart-4)" },
            {
              label: "Fake / Suspicious",
              value: fake,
              color: "var(--chart-3)",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-3 text-center"
              style={{ background: `oklch(${stat.color} / 0.08)` }}
            >
              <div
                className="font-display text-2xl font-bold tabular-nums"
                style={{ color: `oklch(${stat.color})` }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Distribution bar */}
        {total > 0 && (
          <div className="mt-4 h-2 w-full rounded-full overflow-hidden flex bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(genuine / total) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-chart-4"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(fake / total) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="h-full bg-chart-3"
            />
          </div>
        )}
      </Card>

      {/* Genuine reviews */}
      <ReviewGroup
        title="Genuine Reviews"
        reviews={genuineReviews}
        isFake={false}
        accent="var(--chart-4)"
        icon={CheckCircle2}
        startIndex={0}
      />

      {/* Fake reviews */}
      <ReviewGroup
        title="Fake / Suspicious Reviews"
        reviews={fakeReviews}
        isFake={true}
        accent="var(--chart-3)"
        icon={ShieldAlert}
        startIndex={genuineReviews.length}
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-1">
        <Button
          variant="outline"
          className="gap-2"
          onClick={onReset}
          data-ocid="analyze_url.analyze_another_button"
        >
          <RefreshCw className="h-4 w-4" />
          Analyze another URL
        </Button>
      </div>
    </motion.div>
  );
}

export default function AnalyzeUrl() {
  const { isInitializing, isAuthenticated } = useInternetIdentity();
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);

  const {
    mutate: analyzeUrl,
    isPending,
    error: mutationError,
    reset: resetMutation,
  } = useAnalyzeUrl();

  function handleUrlChange(val: string) {
    setUrl(val);
    if (urlError && URL_PATTERN.test(val.trim())) {
      setUrlError(null);
    }
  }

  function handleAnalyze() {
    const trimmed = url.trim();
    if (!trimmed) {
      setUrlError("Please enter a product URL.");
      return;
    }
    if (!URL_PATTERN.test(trimmed)) {
      setUrlError("URL must start with http:// or https://");
      return;
    }
    setUrlError(null);
    analyzeUrl(trimmed, {
      onSuccess: (res) => setResult(res),
    });
  }

  function handleReset() {
    setUrl("");
    setUrlError(null);
    setResult(null);
    resetMutation();
  }

  if (isInitializing) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        data-ocid="analyze_url.loading_state"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-1"
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{
              background: "oklch(var(--primary) / 0.1)",
              border: "1px solid oklch(var(--primary) / 0.25)",
            }}
          >
            <Globe size={15} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            URL Analysis
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Paste a product page URL (Amazon, eBay, etc.). Our AI will fetch all
          reviews and analyze each one for authenticity — grouped by verdict.
        </p>
      </motion.div>

      {/* Auth gate */}
      {!isAuthenticated ? (
        <LoginPrompt />
      ) : (
        <AnimatePresence mode="wait">
          {result ? (
            <UrlResultView key="result" result={result} onReset={handleReset} />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Input */}
              <Card
                className="p-5 space-y-3"
                data-ocid="analyze_url.input_card"
              >
                <label
                  htmlFor="url-input"
                  className="block text-sm font-medium text-foreground"
                >
                  Product Page URL
                </label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://www.amazon.com/dp/B08N5WRWNW"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  disabled={isPending}
                  className="font-mono text-sm"
                  aria-describedby={urlError ? "url-error" : "url-hint"}
                  aria-invalid={!!urlError}
                  data-ocid="analyze_url.url_input"
                />
                {urlError ? (
                  <p
                    id="url-error"
                    className="flex items-center gap-1.5 text-xs text-destructive"
                    role="alert"
                    data-ocid="analyze_url.field_error"
                  >
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    {urlError}
                  </p>
                ) : (
                  <p id="url-hint" className="text-xs text-muted-foreground">
                    Supports Amazon, eBay, Walmart, and most product review
                    pages · Press Enter to analyze
                  </p>
                )}
              </Card>

              {/* Error state */}
              {mutationError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3"
                  data-ocid="analyze_url.error_state"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-destructive">
                      Analysis failed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mutationError.message.includes("Not connected")
                        ? "Could not connect to the backend. Please refresh and try again."
                        : "Could not fetch or analyze reviews from that URL. Check the link and try again."}
                    </p>
                  </div>
                </motion.div>
              )}

              <Separator />

              {/* Submit */}
              <Button
                size="lg"
                className="w-full gap-2 font-semibold"
                onClick={handleAnalyze}
                disabled={isPending || !url.trim()}
                data-ocid="analyze_url.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Fetching and analyzing reviews…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Product Reviews
                  </>
                )}
              </Button>

              {isPending && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-muted-foreground"
                  data-ocid="analyze_url.loading_state"
                >
                  Fetching reviews from the product page and analyzing each one
                  — this may take 15–30 seconds…
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
