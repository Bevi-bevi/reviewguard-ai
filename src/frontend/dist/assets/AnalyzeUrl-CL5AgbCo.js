import { c as createLucideIcon, j as jsxRuntimeExports, b as cn, d as useQueryClient, u as useInternetIdentity, r as reactExports, f as LoaderCircle, G as Globe, B as Button, L as LogIn } from "./index-DkpGCSxA.js";
import { C as Card, d as ConfidenceBar } from "./ConfidenceBar-x7YNWXno.js";
import { C as CircleAlert, a as Separator, S as Sparkles, R as RefreshCw } from "./separator-9JLyakCf.js";
import { u as useBackendActor, g as getVerdict, V as VerdictBadge } from "./index-v5AWFvYv.js";
import { u as useMutation, A as AnimatePresence } from "./index-B_abcmbw.js";
import { m as motion } from "./proxy-DgVxUjh9.js";
import { E as ExternalLink, C as ChevronUp, a as ChevronDown } from "./external-link-91Qw5OSw.js";
import { C as CircleCheck, S as ShieldAlert } from "./shield-alert-BfqZnETi.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode);
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function useAnalyzeUrl() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (url) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.analyzeProductUrl(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStatsV2"] });
      queryClient.invalidateQueries({ queryKey: ["historyV2"] });
    }
  });
}
const URL_PATTERN = /^https?:\/\/.+/;
function LoginPrompt() {
  const { login } = useInternetIdentity();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card px-8 py-14 text-center",
      "data-ocid": "analyze_url.login_prompt",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Sign in to analyze URLs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: "You need to be signed in with Internet Identity to run AI-powered URL review analysis and save your results." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: login,
            className: "gap-2",
            "data-ocid": "analyze_url.login_button",
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
function ReviewRow({
  review,
  index,
  isFake
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const verdict = getVerdict(review.isFake, review.confidenceScore);
  const score = Number(review.confidenceScore);
  const excerpt = review.reviewText.length > 120 ? `${review.reviewText.slice(0, 117)}…` : review.reviewText;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 6 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.04, duration: 0.2 },
      "data-ocid": `analyze_url.review_item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setExpanded((e) => !e),
            className: "w-full text-left group",
            "aria-expanded": expanded,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-center gap-3 px-4 py-3 border-b border-border transition-colors duration-150 hover:bg-muted/40 ${expanded ? "bg-muted/20" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: isFake ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 14, style: { color: "oklch(var(--chart-3))" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircleCheck,
                    {
                      size: 14,
                      style: { color: "oklch(var(--chart-4))" }
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[130px] shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VerdictBadge, { verdict, size: "sm" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 shrink-0 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs tabular-nums text-foreground", children: [
                    score,
                    "%"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm text-muted-foreground", children: excerpt }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 text-muted-foreground group-hover:text-foreground transition-colors", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 14 }) })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, height: 0 },
            animate: { opacity: 1, height: "auto" },
            exit: { opacity: 0, height: 0 },
            transition: { duration: 0.22, ease: "easeInOut" },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `px-5 py-4 border-b border-border ${verdict === "genuine" ? "result-genuine" : verdict === "fake" ? "result-fake" : "result-suspicious"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Full Review" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: review.reviewText })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "AI Explanation" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: review.explanation })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ConfidenceBar, { score, verdict, showLabel: true }) })
                ]
              }
            )
          }
        ) })
      ]
    }
  );
}
function ReviewGroup({
  title,
  reviews,
  isFake,
  accent,
  icon: Icon,
  startIndex
}) {
  if (reviews.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border overflow-hidden",
      style: { borderColor: `oklch(${accent} / 0.3)` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 px-4 py-3 border-b",
            style: {
              background: `oklch(${accent} / 0.06)`,
              borderColor: `oklch(${accent} / 0.2)`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 14, style: { color: `oklch(${accent})` } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "font-display text-sm font-semibold",
                  style: { color: `oklch(${accent})` },
                  children: title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "ml-auto font-mono text-xs font-bold px-2 py-0.5 rounded-sm",
                  style: {
                    background: `oklch(${accent} / 0.12)`,
                    color: `oklch(${accent})`
                  },
                  children: reviews.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-2 bg-muted/30 border-b border-border text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[130px] shrink-0", children: "Verdict" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 shrink-0 text-right", children: "Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: "Review" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 shrink-0" })
        ] }),
        reviews.map((review, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReviewRow,
          {
            review,
            index: startIndex + i,
            isFake
          },
          `${isFake ? "fake" : "genuine"}-${startIndex + i}`
        ))
      ]
    }
  );
}
function UrlResultView({
  result,
  onReset
}) {
  const total = Number(result.totalReviews);
  const genuine = Number(result.genuineCount);
  const fake = Number(result.fakeCount);
  const genuineReviews = result.reviews.filter((r) => !r.isFake);
  const fakeReviews = result.reviews.filter((r) => r.isFake);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
      className: "space-y-5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5", "data-ocid": "analyze_url.summary_card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-foreground", children: "Analysis Complete" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: result.sourceUrl,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "flex items-center gap-1 text-xs text-primary hover:underline mt-1 break-all",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 11 }),
                    result.sourceUrl
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-2xl font-bold text-foreground tabular-nums", children: [
              total,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs font-normal text-muted-foreground", children: "reviews" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
            { label: "Total", value: total, color: "var(--primary)" },
            { label: "Genuine", value: genuine, color: "var(--chart-4)" },
            {
              label: "Fake / Suspicious",
              value: fake,
              color: "var(--chart-3)"
            }
          ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg p-3 text-center",
              style: { background: `oklch(${stat.color} / 0.08)` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-display text-2xl font-bold tabular-nums",
                    style: { color: `oklch(${stat.color})` },
                    children: stat.value
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: stat.label })
              ]
            },
            stat.label
          )) }),
          total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 h-2 w-full rounded-full overflow-hidden flex bg-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { width: 0 },
                animate: { width: `${genuine / total * 100}%` },
                transition: { duration: 0.8, ease: "easeOut" },
                className: "h-full bg-chart-4"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { width: 0 },
                animate: { width: `${fake / total * 100}%` },
                transition: { duration: 0.8, delay: 0.1, ease: "easeOut" },
                className: "h-full bg-chart-3"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReviewGroup,
          {
            title: "Genuine Reviews",
            reviews: genuineReviews,
            isFake: false,
            accent: "var(--chart-4)",
            icon: CircleCheck,
            startIndex: 0
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReviewGroup,
          {
            title: "Fake / Suspicious Reviews",
            reviews: fakeReviews,
            isFake: true,
            accent: "var(--chart-3)",
            icon: ShieldAlert,
            startIndex: genuineReviews.length
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "gap-2",
            onClick: onReset,
            "data-ocid": "analyze_url.analyze_another_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
              "Analyze another URL"
            ]
          }
        ) })
      ]
    }
  );
}
function AnalyzeUrl() {
  const { isInitializing, isAuthenticated } = useInternetIdentity();
  const [url, setUrl] = reactExports.useState("");
  const [urlError, setUrlError] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const {
    mutate: analyzeUrl,
    isPending,
    error: mutationError,
    reset: resetMutation
  } = useAnalyzeUrl();
  function handleUrlChange(val) {
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
      onSuccess: (res) => setResult(res)
    });
  }
  function handleReset() {
    setUrl("");
    setUrlError(null);
    setResult(null);
    resetMutation();
  }
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex min-h-[60vh] items-center justify-center",
        "data-ocid": "analyze_url.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Loading…" })
        ] })
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex h-8 w-8 items-center justify-center rounded-md",
                style: {
                  background: "oklch(var(--primary) / 0.1)",
                  border: "1px solid oklch(var(--primary) / 0.25)"
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 15, className: "text-primary" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground tracking-tight", children: "URL Analysis" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Paste a product page URL (Amazon, eBay, etc.). Our AI will fetch all reviews and analyze each one for authenticity — grouped by verdict." })
        ]
      }
    ),
    !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPrompt, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: result ? /* @__PURE__ */ jsxRuntimeExports.jsx(UrlResultView, { result, onReset: handleReset }, "result") : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.3 },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "p-5 space-y-3",
              "data-ocid": "analyze_url.input_card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "url-input",
                    className: "block text-sm font-medium text-foreground",
                    children: "Product Page URL"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "url-input",
                    type: "url",
                    placeholder: "https://www.amazon.com/dp/B08N5WRWNW",
                    value: url,
                    onChange: (e) => handleUrlChange(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && handleAnalyze(),
                    disabled: isPending,
                    className: "font-mono text-sm",
                    "aria-describedby": urlError ? "url-error" : "url-hint",
                    "aria-invalid": !!urlError,
                    "data-ocid": "analyze_url.url_input"
                  }
                ),
                urlError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    id: "url-error",
                    className: "flex items-center gap-1.5 text-xs text-destructive",
                    role: "alert",
                    "data-ocid": "analyze_url.field_error",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 flex-shrink-0" }),
                      urlError
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { id: "url-hint", className: "text-xs text-muted-foreground", children: "Supports Amazon, eBay, Walmart, and most product review pages · Press Enter to analyze" })
              ]
            }
          ),
          mutationError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.97 },
              animate: { opacity: 1, scale: 1 },
              className: "flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3",
              "data-ocid": "analyze_url.error_state",
              role: "alert",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: "Analysis failed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: mutationError.message.includes("Not connected") ? "Could not connect to the backend. Please refresh and try again." : "Could not fetch or analyze reviews from that URL. Check the link and try again." })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "lg",
              className: "w-full gap-2 font-semibold",
              onClick: handleAnalyze,
              disabled: isPending || !url.trim(),
              "data-ocid": "analyze_url.submit_button",
              children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Fetching and analyzing reviews…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
                "Analyze Product Reviews"
              ] })
            }
          ),
          isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-center text-xs text-muted-foreground",
              "data-ocid": "analyze_url.loading_state",
              children: "Fetching reviews from the product page and analyzing each one — this may take 15–30 seconds…"
            }
          )
        ]
      },
      "form"
    ) })
  ] });
}
export {
  AnalyzeUrl as default
};
