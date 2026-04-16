import { c as createLucideIcon, j as jsxRuntimeExports, b as cn, d as useQueryClient, u as useInternetIdentity, r as reactExports, e as LoadingSpinner, B as Button, f as LoaderCircle, L as LogIn, g as Link } from "./index-DkpGCSxA.js";
import { C as Card, d as ConfidenceBar } from "./ConfidenceBar-x7YNWXno.js";
import { C as CircleAlert, S as Sparkles, a as Separator, R as RefreshCw } from "./separator-9JLyakCf.js";
import { u as useBackendActor, g as getVerdict, V as VerdictBadge, b as formatTimestamp } from "./index-v5AWFvYv.js";
import { u as useMutation, A as AnimatePresence } from "./index-B_abcmbw.js";
import { m as motion } from "./proxy-DgVxUjh9.js";
import { H as History } from "./history-BS-O3x9J.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function useAnalyze() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewText) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.analyzeReview(reviewText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    }
  });
}
const MIN_CHARS = 20;
const MAX_CHARS = 5e3;
function LoginPrompt() {
  const { login } = useInternetIdentity();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card px-8 py-14 text-center",
      "data-ocid": "analyze.login_prompt",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex h-16 w-16 items-center justify-center rounded-full",
            style: {
              background: "oklch(var(--primary) / 0.12)",
              border: "1.5px solid oklch(var(--primary) / 0.3)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-7 w-7 text-primary" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Sign in to analyze reviews" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: "You need to be signed in with Internet Identity to run AI-powered review analysis and save your results." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: login,
            className: "gap-2",
            "data-ocid": "analyze.login_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "h-4 w-4" }),
              "Sign in with Internet Identity"
            ]
          }
        )
      ]
    }
  );
}
function AnalysisResultCard({
  state,
  onReset
}) {
  const { result, reviewExcerpt, verdict } = state;
  const score = Number(result.confidenceScore);
  const resultClass = verdict === "genuine" ? "result-genuine" : verdict === "fake" ? "result-fake" : "result-suspicious";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
      className: "space-y-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: `overflow-hidden p-0 ${resultClass}`,
            "data-ocid": "analyze.result_card",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(VerdictBadge, { verdict, size: "lg" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold text-foreground tabular-nums", children: [
                  score,
                  "% confidence"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground font-mono", children: formatTimestamp(result.timestamp) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ConfidenceBar, { score, verdict, showLabel: false }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-widest text-muted-foreground", children: "Review excerpt" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground/80 italic line-clamp-2", children: [
                  '"',
                  reviewExcerpt,
                  '"'
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-6 space-y-3", "data-ocid": "analyze.explanation_card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold text-foreground", children: "AI Explanation" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap", children: result.explanation })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              className: "gap-2",
              onClick: onReset,
              "data-ocid": "analyze.analyze_another_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
                "Analyze another review"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              className: "gap-2",
              "data-ocid": "analyze.view_history_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/history", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4" }),
                "View analysis history",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
              ] })
            }
          )
        ] })
      ]
    }
  );
}
function Analyze() {
  const { isInitializing, isAuthenticated } = useInternetIdentity();
  const [reviewText, setReviewText] = reactExports.useState("");
  const [validationError, setValidationError] = reactExports.useState(null);
  const [analysisState, setAnalysisState] = reactExports.useState(null);
  const {
    mutate: analyze,
    isPending,
    error: mutationError,
    reset: resetMutation
  } = useAnalyze();
  const charCount = reviewText.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  function handleTextChange(val) {
    setReviewText(val);
    if (validationError && val.length >= MIN_CHARS) {
      setValidationError(null);
    }
  }
  function handleAnalyze() {
    if (!isValid) {
      if (charCount < MIN_CHARS) {
        setValidationError(
          `Review must be at least ${MIN_CHARS} characters. Add ${MIN_CHARS - charCount} more.`
        );
      } else {
        setValidationError(
          `Review exceeds maximum length of ${MAX_CHARS} characters.`
        );
      }
      return;
    }
    setValidationError(null);
    analyze(reviewText, {
      onSuccess: (result) => {
        const verdict = getVerdict(result.isFake, result.confidenceScore);
        const excerpt = reviewText.length > 120 ? `${reviewText.slice(0, 117)}…` : reviewText;
        setAnalysisState({ result, reviewExcerpt: excerpt, verdict });
      }
    });
  }
  function handleReset() {
    setReviewText("");
    setValidationError(null);
    setAnalysisState(null);
    resetMutation();
  }
  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleAnalyze();
    }
  }
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex min-h-[60vh] items-center justify-center",
        "data-ocid": "analyze.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { label: "Loading…" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "space-y-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground tracking-tight", children: "Analyze a Review" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Paste any product review below. Our AI will detect whether it's genuine, suspicious, or fake." })
        ]
      }
    ),
    !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPrompt, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: analysisState ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      AnalysisResultCard,
      {
        state: analysisState,
        onReset: handleReset
      },
      "result"
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.3 },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-3", "data-ocid": "analyze.input_card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "review-textarea",
                className: "block text-sm font-medium text-foreground",
                children: "Product Review Text"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "review-textarea",
                "data-ocid": "analyze.review_input",
                placeholder: "Paste the product review here… (minimum 20 characters)",
                value: reviewText,
                onChange: (e) => handleTextChange(e.target.value),
                onKeyDown: handleKeyDown,
                rows: 8,
                maxLength: MAX_CHARS,
                disabled: isPending,
                className: "resize-none font-body text-sm leading-relaxed focus-visible:ring-ring",
                "aria-describedby": validationError ? "review-error" : "review-hint",
                "aria-invalid": !!validationError
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: validationError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  id: "review-error",
                  className: "flex items-center gap-1.5 text-xs text-destructive",
                  "data-ocid": "analyze.field_error",
                  role: "alert",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 flex-shrink-0" }),
                    validationError
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  id: "review-hint",
                  className: "text-xs text-muted-foreground",
                  children: charCount < MIN_CHARS ? `${MIN_CHARS - charCount} more characters needed` : "Press ⌘+Enter to analyze"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `font-mono text-xs tabular-nums ${charCount > MAX_CHARS * 0.9 ? "text-destructive" : "text-muted-foreground"}`,
                  children: [
                    charCount.toLocaleString(),
                    " / ",
                    MAX_CHARS.toLocaleString()
                  ]
                }
              )
            ] })
          ] }),
          mutationError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.97 },
              animate: { opacity: 1, scale: 1 },
              className: "flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3",
              "data-ocid": "analyze.error_state",
              role: "alert",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: "Analysis failed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: mutationError.message.includes("Not connected") ? "Could not connect to the backend. Please refresh and try again." : "The AI analysis encountered an error. Please try again in a moment." })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              className: "w-full gap-2 font-semibold",
              onClick: handleAnalyze,
              disabled: isPending || !isValid,
              "data-ocid": "analyze.submit_button",
              children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Analyzing with AI…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
                "Analyze Review"
              ] })
            }
          ),
          isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-center text-xs text-muted-foreground",
              "data-ocid": "analyze.loading_state",
              children: "AI is reading the review — this usually takes 5–15 seconds…"
            }
          )
        ]
      },
      "form"
    ) })
  ] });
}
export {
  Analyze as default
};
