import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileImage,
  FileText,
  Globe,
  LogIn,
  Search,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { ConfidenceBar } from "../components/ConfidenceBar";
import { EmptyState } from "../components/EmptyState";
import { VerdictBadge } from "../components/VerdictBadge";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { formatScore, formatTimestamp, getVerdict } from "../types";
import type { AnalysisRecord } from "../types";

// ---------- Stat card ----------

function StatCard({
  label,
  value,
  icon,
  accent,
  delay,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: "primary" | "chart-3" | "chart-4" | "chart-2";
  delay: number;
}) {
  const accentStyles: Record<typeof accent, React.CSSProperties> = {
    primary: {
      background: "oklch(var(--primary) / 0.08)",
      border: "1px solid oklch(var(--primary) / 0.22)",
      color: "oklch(var(--primary))",
    },
    "chart-3": {
      background: "oklch(var(--chart-3) / 0.08)",
      border: "1px solid oklch(var(--chart-3) / 0.22)",
      color: "oklch(var(--chart-3))",
    },
    "chart-4": {
      background: "oklch(var(--chart-4) / 0.08)",
      border: "1px solid oklch(var(--chart-4) / 0.22)",
      color: "oklch(var(--chart-4))",
    },
    "chart-2": {
      background: "oklch(var(--chart-2) / 0.08)",
      border: "1px solid oklch(var(--chart-2) / 0.22)",
      color: "oklch(var(--chart-2))",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-border bg-card h-full">
        <CardContent className="p-5">
          <div className="mb-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={accentStyles[accent]}
            >
              {icon}
            </div>
          </div>
          <div className="font-display text-3xl font-bold text-foreground tabular-nums tracking-tight mb-0.5">
            {value}
          </div>
          <div className="text-xs text-muted-foreground font-mono tracking-wider uppercase">
            {label}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------- Analysis type breakdown ----------

function AnalysisTypeBreakdown({
  textCount,
  imageCount,
  urlCount,
}: {
  textCount: number;
  imageCount: number;
  urlCount: number;
}) {
  const total = textCount + imageCount + urlCount;
  const types = [
    {
      label: "Text",
      count: textCount,
      icon: FileText,
      pct: total > 0 ? (textCount / total) * 100 : 0,
      color: "--chart-1",
    },
    {
      label: "Image",
      count: imageCount,
      icon: FileImage,
      pct: total > 0 ? (imageCount / total) * 100 : 0,
      color: "--chart-2",
    },
    {
      label: "URL",
      count: urlCount,
      icon: Globe,
      pct: total > 0 ? (urlCount / total) * 100 : 0,
      color: "--chart-5",
    },
  ];

  return (
    <Card
      className="border-border bg-card"
      data-ocid="dashboard.type_breakdown_card"
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Activity size={14} />
          Analysis by Type
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {types.map((t) => (
          <div key={t.label} className="flex items-center gap-3">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded"
              style={{ background: `oklch(var(${t.color}) / 0.1)` }}
            >
              <t.icon size={13} style={{ color: `oklch(var(${t.color}))` }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-foreground">
                  {t.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {t.count}
                </span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${t.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `oklch(var(${t.color}))` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ---------- Distribution bar ----------

function DistributionBar({
  fakeCount,
  genuineCount,
  totalAnalyses,
}: {
  fakeCount: number;
  genuineCount: number;
  totalAnalyses: number;
}) {
  const suspiciousCount = Math.max(0, totalAnalyses - fakeCount - genuineCount);
  const fakePct = totalAnalyses > 0 ? (fakeCount / totalAnalyses) * 100 : 0;
  const suspPct =
    totalAnalyses > 0 ? (suspiciousCount / totalAnalyses) * 100 : 0;
  const genuinePct =
    totalAnalyses > 0 ? (genuineCount / totalAnalyses) * 100 : 0;

  const segments = [
    {
      label: "Genuine",
      pct: genuinePct,
      count: genuineCount,
      colorClass: "bg-chart-4",
    },
    {
      label: "Suspicious",
      pct: suspPct,
      count: suspiciousCount,
      colorClass: "bg-chart-2",
    },
    { label: "Fake", pct: fakePct, count: fakeCount, colorClass: "bg-chart-3" },
  ];

  return (
    <Card
      className="border-border bg-card"
      data-ocid="dashboard.distribution_card"
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <BarChart3 size={14} />
          Verdict Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="h-3 w-full rounded-full overflow-hidden flex bg-muted"
          role="img"
          aria-label={`Distribution: ${Math.round(genuinePct)}% genuine, ${Math.round(suspPct)}% suspicious, ${Math.round(fakePct)}% fake`}
        >
          {segments.map((seg) => (
            <motion.div
              key={seg.label}
              initial={{ width: 0 }}
              animate={{ width: `${seg.pct}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className={`h-full ${seg.colorClass}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-1.5">
              <div className={`h-2 w-2 rounded-full ${seg.colorClass}`} />
              <span className="text-xs text-muted-foreground font-mono">
                {seg.label}{" "}
                <span className="text-foreground font-semibold">
                  {Math.round(seg.pct)}%
                </span>{" "}
                <span className="opacity-60">({seg.count})</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Recent analysis card ----------

function RecentAnalysisCard({
  record,
  index,
}: {
  record: AnalysisRecord;
  index: number;
}) {
  const verdict = getVerdict(record.isFake, record.confidenceScore);
  const score = Number(record.confidenceScore);
  const text = record.reviewText;
  const excerpt = text.length > 140 ? `${text.slice(0, 140)}\u2026` : text;

  const borderVar =
    verdict === "genuine"
      ? "--chart-4"
      : verdict === "suspicious"
        ? "--chart-2"
        : "--chart-3";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: 0.1 + index * 0.07 }}
      data-ocid={`dashboard.recent_item.${index + 1}`}
    >
      <Card
        className="border-border bg-card overflow-hidden transition-smooth hover:shadow-md"
        style={{ borderLeft: `3px solid oklch(var(${borderVar}))` }}
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <VerdictBadge verdict={verdict} size="sm" />
            <span className="text-xs text-muted-foreground font-mono tabular-nums">
              {formatTimestamp(record.timestamp)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 break-words">
            {excerpt}
          </p>
          <ConfidenceBar score={score} verdict={verdict} showLabel />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------- Loading skeleton ----------

function StatsSkeleton() {
  return (
    <div className="space-y-6" data-ocid="dashboard.loading_state">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} className="border-border bg-card">
            <CardContent className="p-5">
              <Skeleton className="h-10 w-10 rounded-lg mb-3" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ---------- Login prompt ----------

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4"
      data-ocid="dashboard.login_prompt"
    >
      <div className="text-center space-y-3 max-w-md">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl mb-6"
          style={{
            background: "oklch(var(--primary) / 0.1)",
            border: "1px solid oklch(var(--primary) / 0.25)",
          }}
        >
          <ShieldAlert size={30} style={{ color: "oklch(var(--primary))" }} />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Sign in to view your dashboard
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your analysis history and statistics are saved to your account. Sign
          in with Internet Identity to access your personal forensic dashboard.
        </p>
      </div>
      <Button
        size="lg"
        onClick={onLogin}
        className="gap-2"
        data-ocid="dashboard.login_button"
      >
        <LogIn size={18} />
        Sign in with Internet Identity
      </Button>
    </motion.div>
  );
}

// ---------- Main dashboard ----------

export default function Dashboard() {
  const { isAuthenticated, isInitializing, login } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isInitializing) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <StatsSkeleton />
      </section>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt onLogin={login} />;
  }

  if (isLoading) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <StatsSkeleton />
      </section>
    );
  }

  if (isError || !stats) {
    return (
      <section
        className="max-w-4xl mx-auto px-4 py-8"
        data-ocid="dashboard.error_state"
      >
        <EmptyState
          title="Failed to load dashboard"
          description="There was an error fetching your stats. Please try refreshing the page."
          actionLabel="Try again"
          onAction={() => window.location.reload()}
          icon={<AlertTriangle size={28} />}
        />
      </section>
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
    return (
      <section className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          title="No analyses yet"
          description="Analyze your first product review to see your statistics, verdict history, and confidence trends appear here."
          actionLabel="Analyze a review"
          onAction={() => navigate({ to: "/analyze" })}
          icon={<Search size={28} />}
        />
      </section>
    );
  }

  return (
    <section
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      data-ocid="dashboard.page"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
            Analysis Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Your review forensics at a glance
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/analyze" })}
          size="sm"
          className="gap-1.5"
          data-ocid="dashboard.analyze_button"
        >
          <Search size={14} />
          Analyze New Review
        </Button>
      </motion.div>

      {/* Stat cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="dashboard.stats_grid"
      >
        <StatCard
          label="Total Analyses"
          value={totalAnalyses}
          icon={<Activity size={18} />}
          accent="primary"
          delay={0}
        />
        <StatCard
          label="Fake Reviews"
          value={fakeCount}
          icon={<AlertTriangle size={18} />}
          accent="chart-3"
          delay={0.08}
        />
        <StatCard
          label="Genuine Reviews"
          value={genuineCount}
          icon={<CheckCircle2 size={18} />}
          accent="chart-4"
          delay={0.16}
        />
        <StatCard
          label="Avg. Confidence"
          value={formatScore(stats.averageScore)}
          icon={<TrendingUp size={18} />}
          accent="chart-2"
          delay={0.24}
        />
      </div>

      {/* Analysis type breakdown (shown when V2 counts are available) */}
      {hasTypeCounts && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
        >
          <AnalysisTypeBreakdown
            textCount={textCount}
            imageCount={imageCount}
            urlCount={urlCount}
          />
        </motion.div>
      )}

      {/* Distribution bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <DistributionBar
          fakeCount={fakeCount}
          genuineCount={genuineCount}
          totalAnalyses={totalAnalyses}
        />
      </motion.div>

      {/* Recent analyses */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="space-y-3"
        data-ocid="dashboard.recent_list"
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Analyses
          </h2>
          <span className="text-xs font-mono text-muted-foreground opacity-60">
            (last {stats.recentAnalyses.length})
          </span>
        </div>

        {stats.recentAnalyses.length === 0 ? (
          <EmptyState
            title="No recent analyses"
            description="Your most recent reviews will appear here after you run your first analysis."
            actionLabel="Go to Analyze"
            onAction={() => navigate({ to: "/analyze" })}
          />
        ) : (
          stats.recentAnalyses.map((record, index) => (
            <RecentAnalysisCard
              key={String(record.id)}
              record={record}
              index={index}
            />
          ))
        )}
      </motion.div>
    </section>
  );
}
