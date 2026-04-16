import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  History,
  Loader2,
  LogIn,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type KeyboardEvent, useState } from "react";
import { ConfidenceBar } from "../components/ConfidenceBar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { VerdictBadge } from "../components/VerdictBadge";
import { useAnalyze } from "../hooks/useAnalyze";
import { formatTimestamp, getVerdict } from "../types";
import type { AnalysisResult, Verdict } from "../types";

const MIN_CHARS = 20;
const MAX_CHARS = 5000;

interface ResultState {
  result: AnalysisResult;
  reviewExcerpt: string;
  verdict: Verdict;
}

function LoginPrompt() {
  const { login } = useInternetIdentity();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card px-8 py-14 text-center"
      data-ocid="analyze.login_prompt"
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
          Sign in to analyze reviews
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          You need to be signed in with Internet Identity to run AI-powered
          review analysis and save your results.
        </p>
      </div>
      <Button
        onClick={login}
        className="gap-2"
        data-ocid="analyze.login_button"
      >
        <LogIn className="h-4 w-4" />
        Sign in with Internet Identity
      </Button>
    </motion.div>
  );
}

function AnalysisResultCard({
  state,
  onReset,
}: { state: ResultState; onReset: () => void }) {
  const { result, reviewExcerpt, verdict } = state;
  const score = Number(result.confidenceScore);

  const resultClass =
    verdict === "genuine"
      ? "result-genuine"
      : verdict === "fake"
        ? "result-fake"
        : "result-suspicious";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-4"
    >
      {/* Result header card */}
      <Card
        className={`overflow-hidden p-0 ${resultClass}`}
        data-ocid="analyze.result_card"
      >
        <div className="px-6 py-5 space-y-4">
          {/* Verdict + score row */}
          <div className="flex flex-wrap items-center gap-3">
            <VerdictBadge verdict={verdict} size="lg" />
            <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
              {score}% confidence
            </span>
            <span className="ml-auto text-xs text-muted-foreground font-mono">
              {formatTimestamp(result.timestamp)}
            </span>
          </div>

          {/* Confidence bar */}
          <ConfidenceBar score={score} verdict={verdict} showLabel={false} />

          <Separator />

          {/* Review excerpt */}
          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Review excerpt
            </p>
            <p className="text-sm text-foreground/80 italic line-clamp-2">
              "{reviewExcerpt}"
            </p>
          </div>
        </div>
      </Card>

      {/* Explanation card */}
      <Card className="p-6 space-y-3" data-ocid="analyze.explanation_card">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-display text-sm font-semibold text-foreground">
            AI Explanation
          </h3>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {result.explanation}
        </p>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-1">
        <Button
          variant="outline"
          className="gap-2"
          onClick={onReset}
          data-ocid="analyze.analyze_another_button"
        >
          <RefreshCw className="h-4 w-4" />
          Analyze another review
        </Button>
        <Button
          asChild
          className="gap-2"
          data-ocid="analyze.view_history_button"
        >
          <Link to="/history">
            <History className="h-4 w-4" />
            View analysis history
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

export default function Analyze() {
  const { isInitializing, isAuthenticated } = useInternetIdentity();
  const [reviewText, setReviewText] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<ResultState | null>(null);

  const {
    mutate: analyze,
    isPending,
    error: mutationError,
    reset: resetMutation,
  } = useAnalyze();

  const charCount = reviewText.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  function handleTextChange(val: string) {
    setReviewText(val);
    if (validationError && val.length >= MIN_CHARS) {
      setValidationError(null);
    }
  }

  function handleAnalyze() {
    if (!isValid) {
      if (charCount < MIN_CHARS) {
        setValidationError(
          `Review must be at least ${MIN_CHARS} characters. Add ${MIN_CHARS - charCount} more.`,
        );
      } else {
        setValidationError(
          `Review exceeds maximum length of ${MAX_CHARS} characters.`,
        );
      }
      return;
    }
    setValidationError(null);
    analyze(reviewText, {
      onSuccess: (result) => {
        const verdict = getVerdict(result.isFake, result.confidenceScore);
        const excerpt =
          reviewText.length > 120 ? `${reviewText.slice(0, 117)}…` : reviewText;
        setAnalysisState({ result, reviewExcerpt: excerpt, verdict });
      },
    });
  }

  function handleReset() {
    setReviewText("");
    setValidationError(null);
    setAnalysisState(null);
    resetMutation();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleAnalyze();
    }
  }

  if (isInitializing) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        data-ocid="analyze.loading_state"
      >
        <LoadingSpinner label="Loading…" />
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
        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
          Analyze a Review
        </h1>
        <p className="text-muted-foreground text-sm">
          Paste any product review below. Our AI will detect whether it's
          genuine, suspicious, or fake.
        </p>
      </motion.div>

      {/* Auth gate */}
      {!isAuthenticated ? (
        <LoginPrompt />
      ) : (
        <AnimatePresence mode="wait">
          {analysisState ? (
            <AnalysisResultCard
              key="result"
              state={analysisState}
              onReset={handleReset}
            />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Input card */}
              <Card className="p-5 space-y-3" data-ocid="analyze.input_card">
                <label
                  htmlFor="review-textarea"
                  className="block text-sm font-medium text-foreground"
                >
                  Product Review Text
                </label>
                <Textarea
                  id="review-textarea"
                  data-ocid="analyze.review_input"
                  placeholder="Paste the product review here… (minimum 20 characters)"
                  value={reviewText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={8}
                  maxLength={MAX_CHARS}
                  disabled={isPending}
                  className="resize-none font-body text-sm leading-relaxed focus-visible:ring-ring"
                  aria-describedby={
                    validationError ? "review-error" : "review-hint"
                  }
                  aria-invalid={!!validationError}
                />

                {/* Character counter + hint */}
                <div className="flex items-center justify-between">
                  <div>
                    {validationError ? (
                      <p
                        id="review-error"
                        className="flex items-center gap-1.5 text-xs text-destructive"
                        data-ocid="analyze.field_error"
                        role="alert"
                      >
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        {validationError}
                      </p>
                    ) : (
                      <p
                        id="review-hint"
                        className="text-xs text-muted-foreground"
                      >
                        {charCount < MIN_CHARS
                          ? `${MIN_CHARS - charCount} more characters needed`
                          : "Press ⌘+Enter to analyze"}
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-mono text-xs tabular-nums ${charCount > MAX_CHARS * 0.9 ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                  </span>
                </div>
              </Card>

              {/* Error state */}
              {mutationError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3"
                  data-ocid="analyze.error_state"
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
                        : "The AI analysis encountered an error. Please try again in a moment."}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Submit */}
              <Button
                size="lg"
                className="w-full gap-2 font-semibold"
                onClick={handleAnalyze}
                disabled={isPending || !isValid}
                data-ocid="analyze.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing with AI…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Review
                  </>
                )}
              </Button>

              {isPending && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-muted-foreground"
                  data-ocid="analyze.loading_state"
                >
                  AI is reading the review — this usually takes 5–15 seconds…
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
