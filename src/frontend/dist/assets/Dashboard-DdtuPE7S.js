import { c as createLucideIcon, u as useInternetIdentity, a as useNavigate, j as jsxRuntimeExports, B as Button, L as LogIn, F as FileImage, G as Globe } from "./index-DkpGCSxA.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as ConfidenceBar } from "./ConfidenceBar-x7YNWXno.js";
import { E as EmptyState, S as Skeleton } from "./EmptyState-DV19LUZp.js";
import { u as useBackendActor, a as useQuery, f as formatScore, g as getVerdict, V as VerdictBadge, b as formatTimestamp } from "./index-v5AWFvYv.js";
import { T as TriangleAlert, S as Search } from "./triangle-alert-DL2PqnGe.js";
import { m as motion } from "./proxy-DgVxUjh9.js";
import { C as CircleCheck, S as ShieldAlert } from "./shield-alert-BfqZnETi.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function useDashboardStats() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalAnalyses: 0n,
          fakeCount: 0n,
          genuineCount: 0n,
          averageScore: 0n,
          textCount: 0n,
          imageCount: 0n,
          urlCount: 0n,
          recentAnalyses: []
        };
      }
      return actor.getDashboardStatsV2();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e4
  });
}
function StatCard({
  label,
  value,
  icon,
  accent,
  delay
}) {
  const accentStyles = {
    primary: {
      background: "oklch(var(--primary) / 0.08)",
      border: "1px solid oklch(var(--primary) / 0.22)",
      color: "oklch(var(--primary))"
    },
    "chart-3": {
      background: "oklch(var(--chart-3) / 0.08)",
      border: "1px solid oklch(var(--chart-3) / 0.22)",
      color: "oklch(var(--chart-3))"
    },
    "chart-4": {
      background: "oklch(var(--chart-4) / 0.08)",
      border: "1px solid oklch(var(--chart-4) / 0.22)",
      color: "oklch(var(--chart-4))"
    },
    "chart-2": {
      background: "oklch(var(--chart-2) / 0.08)",
      border: "1px solid oklch(var(--chart-2) / 0.22)",
      color: "oklch(var(--chart-2))"
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex h-10 w-10 items-center justify-center rounded-lg",
            style: accentStyles[accent],
            children: icon
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-3xl font-bold text-foreground tabular-nums tracking-tight mb-0.5", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground font-mono tracking-wider uppercase", children: label })
      ] }) })
    }
  );
}
function AnalysisTypeBreakdown({
  textCount,
  imageCount,
  urlCount
}) {
  const total = textCount + imageCount + urlCount;
  const types = [
    {
      label: "Text",
      count: textCount,
      icon: FileText,
      pct: total > 0 ? textCount / total * 100 : 0,
      color: "--chart-1"
    },
    {
      label: "Image",
      count: imageCount,
      icon: FileImage,
      pct: total > 0 ? imageCount / total * 100 : 0,
      color: "--chart-2"
    },
    {
      label: "URL",
      count: urlCount,
      icon: Globe,
      pct: total > 0 ? urlCount / total * 100 : 0,
      color: "--chart-5"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "border-border bg-card",
      "data-ocid": "dashboard.type_breakdown_card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 14 }),
          "Analysis by Type"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: types.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex h-7 w-7 shrink-0 items-center justify-center rounded",
              style: { background: `oklch(var(${t.color}) / 0.1)` },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { size: 13, style: { color: `oklch(var(${t.color}))` } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: t.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground tabular-nums", children: t.count })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { width: 0 },
                animate: { width: `${t.pct}%` },
                transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
                className: "h-full rounded-full",
                style: { background: `oklch(var(${t.color}))` }
              }
            ) })
          ] })
        ] }, t.label)) })
      ]
    }
  );
}
function DistributionBar({
  fakeCount,
  genuineCount,
  totalAnalyses
}) {
  const suspiciousCount = Math.max(0, totalAnalyses - fakeCount - genuineCount);
  const fakePct = totalAnalyses > 0 ? fakeCount / totalAnalyses * 100 : 0;
  const suspPct = totalAnalyses > 0 ? suspiciousCount / totalAnalyses * 100 : 0;
  const genuinePct = totalAnalyses > 0 ? genuineCount / totalAnalyses * 100 : 0;
  const segments = [
    {
      label: "Genuine",
      pct: genuinePct,
      count: genuineCount,
      colorClass: "bg-chart-4"
    },
    {
      label: "Suspicious",
      pct: suspPct,
      count: suspiciousCount,
      colorClass: "bg-chart-2"
    },
    { label: "Fake", pct: fakePct, count: fakeCount, colorClass: "bg-chart-3" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "border-border bg-card",
      "data-ocid": "dashboard.distribution_card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 14 }),
          "Verdict Distribution"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-3 w-full rounded-full overflow-hidden flex bg-muted",
              role: "img",
              "aria-label": `Distribution: ${Math.round(genuinePct)}% genuine, ${Math.round(suspPct)}% suspicious, ${Math.round(fakePct)}% fake`,
              children: segments.map((seg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: `${seg.pct}%` },
                  transition: { duration: 0.8, delay: 0.2, ease: "easeOut" },
                  className: `h-full ${seg.colorClass}`
                },
                seg.label
              ))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-5 flex-wrap", children: segments.map((seg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 w-2 rounded-full ${seg.colorClass}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground font-mono", children: [
              seg.label,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground font-semibold", children: [
                Math.round(seg.pct),
                "%"
              ] }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-60", children: [
                "(",
                seg.count,
                ")"
              ] })
            ] })
          ] }, seg.label)) })
        ] })
      ]
    }
  );
}
function RecentAnalysisCard({
  record,
  index
}) {
  const verdict = getVerdict(record.isFake, record.confidenceScore);
  const score = Number(record.confidenceScore);
  const text = record.reviewText;
  const excerpt = text.length > 140 ? `${text.slice(0, 140)}…` : text;
  const borderVar = verdict === "genuine" ? "--chart-4" : verdict === "suspicious" ? "--chart-2" : "--chart-3";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, x: -12 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.35, delay: 0.1 + index * 0.07 },
      "data-ocid": `dashboard.recent_item.${index + 1}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Card,
        {
          className: "border-border bg-card overflow-hidden transition-smooth hover:shadow-md",
          style: { borderLeft: `3px solid oklch(var(${borderVar}))` },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(VerdictBadge, { verdict, size: "sm" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono tabular-nums", children: formatTimestamp(record.timestamp) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed line-clamp-2 break-words", children: excerpt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ConfidenceBar, { score, verdict, showLabel: true })
          ] })
        }
      )
    }
  );
}
function StatsSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "dashboard.loading_state", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-lg mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 mb-1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
    ] }) }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" }, i)) })
  ] });
}
function LoginPrompt({ onLogin }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4",
      "data-ocid": "dashboard.login_prompt",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-6",
              style: {
                background: "oklch(var(--primary) / 0.1)",
                border: "1px solid oklch(var(--primary) / 0.25)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { size: 30, style: { color: "oklch(var(--primary))" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Sign in to view your dashboard" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Your analysis history and statistics are saved to your account. Sign in with Internet Identity to access your personal forensic dashboard." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "lg",
            onClick: onLogin,
            className: "gap-2",
            "data-ocid": "dashboard.login_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 18 }),
              "Sign in with Internet Identity"
            ]
          }
        )
      ]
    }
  );
}
function Dashboard() {
  const { isAuthenticated, isInitializing, login } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useDashboardStats();
  if (isInitializing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-4xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatsSkeleton, {}) });
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPrompt, { onLogin: login });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-4xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatsSkeleton, {}) });
  }
  if (isError || !stats) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "max-w-4xl mx-auto px-4 py-8",
        "data-ocid": "dashboard.error_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            title: "Failed to load dashboard",
            description: "There was an error fetching your stats. Please try refreshing the page.",
            actionLabel: "Try again",
            onAction: () => window.location.reload(),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 28 })
          }
        )
      }
    );
  }
  const totalAnalyses = Number(stats.totalAnalyses);
  const fakeCount = Number(stats.fakeCount);
  const genuineCount = Number(stats.genuineCount);
  const textCount = Number(stats.textCount);
  const imageCount = Number(stats.imageCount);
  const urlCount = Number(stats.urlCount);
  const hasTypeCounts = textCount + imageCount + urlCount > 0;
  if (totalAnalyses === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "max-w-4xl mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        title: "No analyses yet",
        description: "Analyze your first product review to see your statistics, verdict history, and confidence trends appear here.",
        actionLabel: "Analyze a review",
        onAction: () => navigate({ to: "/analyze" }),
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 28 })
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "max-w-4xl mx-auto px-4 py-8 space-y-6",
      "data-ocid": "dashboard.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.35 },
            className: "flex items-center justify-between gap-4 flex-wrap",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground tracking-tight", children: "Analysis Dashboard" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: "Your review forensics at a glance" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  onClick: () => navigate({ to: "/analyze" }),
                  size: "sm",
                  className: "gap-1.5",
                  "data-ocid": "dashboard.analyze_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14 }),
                    "Analyze New Review"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
            "data-ocid": "dashboard.stats_grid",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Analyses",
                  value: totalAnalyses,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 18 }),
                  accent: "primary",
                  delay: 0
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Fake Reviews",
                  value: fakeCount,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 18 }),
                  accent: "chart-3",
                  delay: 0.08
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Genuine Reviews",
                  value: genuineCount,
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 18 }),
                  accent: "chart-4",
                  delay: 0.16
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Avg. Confidence",
                  value: formatScore(stats.averageScore),
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 18 }),
                  accent: "chart-2",
                  delay: 0.24
                }
              )
            ]
          }
        ),
        hasTypeCounts && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.28 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AnalysisTypeBreakdown,
              {
                textCount,
                imageCount,
                urlCount
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, delay: 0.3 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DistributionBar,
              {
                fakeCount,
                genuineCount,
                totalAnalyses
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.3, delay: 0.4 },
            className: "space-y-3",
            "data-ocid": "dashboard.recent_list",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider", children: "Recent Analyses" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground opacity-60", children: [
                  "(last ",
                  stats.recentAnalyses.length,
                  ")"
                ] })
              ] }),
              stats.recentAnalyses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                EmptyState,
                {
                  title: "No recent analyses",
                  description: "Your most recent reviews will appear here after you run your first analysis.",
                  actionLabel: "Go to Analyze",
                  onAction: () => navigate({ to: "/analyze" })
                }
              ) : stats.recentAnalyses.map((record, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                RecentAnalysisCard,
                {
                  record,
                  index
                },
                String(record.id)
              ))
            ]
          }
        )
      ]
    }
  );
}
export {
  Dashboard as default
};
