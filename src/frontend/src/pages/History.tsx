import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  FileImage,
  Globe,
  History as HistoryIcon,
  LogIn,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { VerdictBadge } from "../components/VerdictBadge";
import { useClearHistory } from "../hooks/useClearHistory";
import { useDeleteAnalysis } from "../hooks/useDeleteAnalysis";
import { useHistoryV2 } from "../hooks/useHistoryV2";
import { formatScore, formatTimestamp, getVerdict } from "../types";
import { AnalysisType } from "../types";
import type { AnalysisId, AnalysisRecordV2 } from "../types";

const PAGE_SIZE = 10;
const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e"];

function SkeletonRows() {
  return (
    <>
      {SKELETON_KEYS.map((k) => (
        <div
          key={k}
          className="flex items-center gap-4 px-5 py-4 border-b border-border"
        >
          <Skeleton className="h-5 w-24 rounded-sm" />
          <Skeleton className="h-5 w-12 rounded" />
          <Skeleton className="h-4 flex-1 rounded" />
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-7 w-7 rounded" />
        </div>
      ))}
    </>
  );
}

// ---------- Text row ----------

interface TextRowProps {
  record: AnalysisRecordV2;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onDelete: (id: AnalysisId) => void;
  isDeleting: boolean;
}

function TextRow({
  record,
  index,
  expanded,
  onToggle,
  onDelete,
  isDeleting,
}: TextRowProps) {
  const verdict = getVerdict(record.isFake, record.confidenceScore);
  const excerpt =
    record.reviewText.length > 80
      ? `${record.reviewText.slice(0, 80).trimEnd()}…`
      : record.reviewText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      data-ocid={`history.text.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left group"
        aria-expanded={expanded}
      >
        <div
          className={`flex items-center gap-3 px-5 py-3.5 border-b border-border transition-colors duration-150 hover:bg-muted/40 ${expanded ? "bg-muted/30" : ""}`}
        >
          <div className="w-[140px] shrink-0">
            <VerdictBadge verdict={verdict} size="sm" />
          </div>
          <div className="w-14 shrink-0 text-right">
            <span className="font-mono text-sm tabular-nums text-foreground">
              {formatScore(record.confidenceScore)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm text-muted-foreground">{excerpt}</p>
          </div>
          <div className="hidden sm:block shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatTimestamp(record.timestamp)}
          </div>
          <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
          <DeleteButton
            id={record.id}
            index={index}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
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
              className={`px-6 py-5 border-b border-border ${
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
                    {record.reviewText}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    AI Explanation
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {record.explanation}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>
                  ID:{" "}
                  <span className="font-mono text-foreground">
                    {String(record.id)}
                  </span>
                </span>
                <span>
                  Analyzed:{" "}
                  <span className="font-mono text-foreground">
                    {formatTimestamp(record.timestamp)}
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------- Image row ----------

function ImageRow({
  record,
  index,
  expanded,
  onToggle,
  onDelete,
  isDeleting,
}: TextRowProps) {
  const verdict = getVerdict(record.isFake, record.confidenceScore);
  const ocrExcerpt =
    record.reviewText.length > 70
      ? `${record.reviewText.slice(0, 67)}…`
      : record.reviewText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      data-ocid={`history.image.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left group"
        aria-expanded={expanded}
      >
        <div
          className={`flex items-center gap-3 px-5 py-3.5 border-b border-border transition-colors duration-150 hover:bg-muted/40 ${expanded ? "bg-muted/30" : ""}`}
        >
          <div className="w-[140px] shrink-0">
            <VerdictBadge verdict={verdict} size="sm" />
          </div>
          <div className="w-14 shrink-0 text-right">
            <span className="font-mono text-sm tabular-nums text-foreground">
              {formatScore(record.confidenceScore)}
            </span>
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="truncate text-xs font-mono text-muted-foreground/70">
              {record.imageKey ?? "image"}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {ocrExcerpt}
            </p>
          </div>
          <div className="hidden sm:block shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatTimestamp(record.timestamp)}
          </div>
          <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
          <DeleteButton
            id={record.id}
            index={index}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
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
              className={`px-6 py-5 border-b border-border ${
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
                    OCR Extracted Text
                  </p>
                  <p className="text-sm text-foreground leading-relaxed font-mono text-xs">
                    {record.reviewText}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    AI Explanation
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {record.explanation}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>
                  ID:{" "}
                  <span className="font-mono text-foreground">
                    {String(record.id)}
                  </span>
                </span>
                <span>
                  Analyzed:{" "}
                  <span className="font-mono text-foreground">
                    {formatTimestamp(record.timestamp)}
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------- URL row ----------

interface UrlGroupRowProps {
  record: AnalysisRecordV2;
  index: number;
  onDelete: (id: AnalysisId) => void;
  isDeleting: boolean;
}

function UrlGroupRow({
  record,
  index,
  onDelete,
  isDeleting,
}: UrlGroupRowProps) {
  const [expanded, setExpanded] = useState(false);
  const verdict = getVerdict(record.isFake, record.confidenceScore);
  const sourceUrl = record.sourceUrl ?? record.reviewText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      data-ocid={`history.url.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left group"
        aria-expanded={expanded}
      >
        <div
          className={`flex items-center gap-3 px-5 py-3.5 border-b border-border transition-colors duration-150 hover:bg-muted/40 ${expanded ? "bg-muted/30" : ""}`}
        >
          <div className="w-[140px] shrink-0">
            <VerdictBadge verdict={verdict} size="sm" />
          </div>
          <div className="w-14 shrink-0 text-right">
            <span className="font-mono text-sm tabular-nums text-foreground">
              {formatScore(record.confidenceScore)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <Globe size={12} className="shrink-0 text-primary" />
              <p className="truncate text-sm text-muted-foreground">
                {sourceUrl}
              </p>
            </div>
          </div>
          <div className="hidden sm:block shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatTimestamp(record.timestamp)}
          </div>
          <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
          <DeleteButton
            id={record.id}
            index={index}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
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
              className={`px-6 py-5 border-b border-border ${
                verdict === "genuine"
                  ? "result-genuine"
                  : verdict === "fake"
                    ? "result-fake"
                    : "result-suspicious"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Globe size={13} className="text-primary" />
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 break-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  {sourceUrl}
                  <ExternalLink size={10} />
                </a>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {record.explanation}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>
                  ID:{" "}
                  <span className="font-mono text-foreground">
                    {String(record.id)}
                  </span>
                </span>
                <span>
                  Analyzed:{" "}
                  <span className="font-mono text-foreground">
                    {formatTimestamp(record.timestamp)}
                  </span>
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------- Shared delete button ----------

function DeleteButton({
  id,
  index,
  onDelete,
  isDeleting,
}: {
  id: AnalysisId;
  index: number;
  onDelete: (id: AnalysisId) => void;
  isDeleting: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          aria-label="Delete this analysis"
          disabled={isDeleting}
          data-ocid={`history.delete_button.${index + 1}`}
        >
          {isDeleting ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent data-ocid="history.delete_dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this analysis?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The analysis record will be
            permanently removed from your history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-ocid="history.delete_dialog.cancel_button">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-ocid="history.delete_dialog.confirm_button"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------- Tab panel ----------

type TabType = "text" | "image" | "url";

function TabPanel({ tabType }: { tabType: TabType }) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<AnalysisId | null>(null);
  const [deletingId, setDeletingId] = useState<AnalysisId | null>(null);

  const analysisTypeFilter =
    tabType === "text"
      ? AnalysisType.Text
      : tabType === "image"
        ? AnalysisType.Image
        : AnalysisType.URL;

  const { data, isLoading, isError } = useHistoryV2(
    page,
    PAGE_SIZE,
    analysisTypeFilter,
  );
  const deleteMutation = useDeleteAnalysis();
  const clearMutation = useClearHistory();

  const totalPages = data ? Math.ceil(Number(data.total) / PAGE_SIZE) : 0;
  const hasItems = data && data.items.length > 0;

  function handleToggle(id: AnalysisId) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  async function handleDelete(id: AnalysisId) {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      if (expandedId === id) setExpandedId(null);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleClearAll() {
    await clearMutation.mutateAsync();
    setExpandedId(null);
    setPage(1);
  }

  const emptyMessages = {
    text: {
      title: "No text analyses yet",
      description: "Your text review analyses will appear here.",
      actionLabel: "Analyze a Review",
      to: "/analyze",
    },
    image: {
      title: "No image analyses yet",
      description: "Upload a screenshot to analyze it with our AI.",
      actionLabel: "Analyze an Image",
      to: "/analyze/image",
    },
    url: {
      title: "No URL analyses yet",
      description: "Paste a product URL to analyze all its reviews.",
      actionLabel: "Analyze a URL",
      to: "/analyze/url",
    },
  };

  const colHeaders =
    tabType === "url"
      ? ["Verdict", "Score", "Source URL", "Date"]
      : tabType === "image"
        ? ["Verdict", "Score", "Image / OCR Excerpt", "Date"]
        : ["Verdict", "Score", "Review Excerpt", "Date"];

  return (
    <div>
      {/* Clear all */}
      {hasItems && (
        <div className="flex justify-end mb-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                data-ocid={`history.${tabType}.clear_all_button`}
              >
                <X size={14} />
                Clear{" "}
                {tabType === "text"
                  ? "Text"
                  : tabType === "image"
                    ? "Image"
                    : "URL"}{" "}
                History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-ocid={`history.${tabType}.clear_all_dialog`}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-destructive" />
                  Clear {tabType} history?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  All {Number(data?.total ?? 0)} {tabType} analysis records will
                  be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  data-ocid={`history.${tabType}.clear_all_dialog.cancel_button`}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  data-ocid={`history.${tabType}.clear_all_dialog.confirm_button`}
                >
                  {clearMutation.isPending ? "Clearing…" : "Clear All"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {/* Column headers */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-border bg-muted/40">
          <div className="w-[140px] shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {colHeaders[0]}
          </div>
          <div className="w-14 shrink-0 text-right text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {colHeaders[1]}
          </div>
          <div className="flex-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {colHeaders[2]}
          </div>
          <div className="hidden sm:block shrink-0 w-36 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {colHeaders[3]}
          </div>
          <div className="w-7 shrink-0" />
          <div className="w-7 shrink-0" />
        </div>

        {isLoading && (
          <div data-ocid={`history.${tabType}.loading_state`}>
            <SkeletonRows />
          </div>
        )}

        {isError && !isLoading && (
          <div
            className="flex items-center gap-3 px-5 py-8 text-sm text-destructive"
            data-ocid={`history.${tabType}.error_state`}
          >
            <AlertTriangle size={16} />
            Failed to load history. Please try again.
          </div>
        )}

        {!isLoading && !isError && !hasItems && (
          <EmptyState
            title={emptyMessages[tabType].title}
            description={emptyMessages[tabType].description}
            actionLabel={emptyMessages[tabType].actionLabel}
            onAction={() => navigate({ to: emptyMessages[tabType].to as "/" })}
            icon={
              tabType === "image" ? (
                <FileImage size={28} />
              ) : tabType === "url" ? (
                <Globe size={28} />
              ) : (
                <HistoryIcon size={28} />
              )
            }
            data-ocid={`history.${tabType}.empty_state`}
          />
        )}

        {!isLoading && !isError && hasItems && (
          <div>
            {data.items.map((record, i) => {
              const globalIdx = (page - 1) * PAGE_SIZE + i;
              if (tabType === "image") {
                return (
                  <ImageRow
                    key={String(record.id)}
                    record={record}
                    index={globalIdx}
                    expanded={expandedId === record.id}
                    onToggle={() => handleToggle(record.id)}
                    onDelete={handleDelete}
                    isDeleting={deletingId === record.id}
                  />
                );
              }
              if (tabType === "url") {
                return (
                  <UrlGroupRow
                    key={String(record.id)}
                    record={record}
                    index={globalIdx}
                    onDelete={handleDelete}
                    isDeleting={deletingId === record.id}
                  />
                );
              }
              return (
                <TextRow
                  key={String(record.id)}
                  record={record}
                  index={globalIdx}
                  expanded={expandedId === record.id}
                  onToggle={() => handleToggle(record.id)}
                  onDelete={handleDelete}
                  isDeleting={deletingId === record.id}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="mt-5 flex items-center justify-between gap-4"
          data-ocid={`history.${tabType}.pagination`}
        >
          <p className="text-sm text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="gap-1.5"
              data-ocid={`history.${tabType}.pagination_prev`}
            >
              <ChevronLeft size={14} />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="gap-1.5"
              data-ocid={`history.${tabType}.pagination_next`}
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Main ----------

export default function History() {
  const { isAuthenticated, login } = useInternetIdentity();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <LogIn size={26} className="text-muted-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Sign in to view history
          </h2>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
            Your analysis history is private and linked to your Internet
            Identity.
          </p>
          <Button
            onClick={() => login()}
            variant="outline"
            data-ocid="history.login_cta_button"
          >
            <LogIn size={14} className="mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            background: "oklch(var(--primary) / 0.12)",
            border: "1px solid oklch(var(--primary) / 0.25)",
          }}
        >
          <HistoryIcon size={17} className="text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Analysis History
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            All your past analyses, organized by type
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="text" data-ocid="history.tabs">
        <TabsList className="mb-5" data-ocid="history.tab_list">
          <TabsTrigger
            value="text"
            className="gap-1.5"
            data-ocid="history.text_tab"
          >
            <MessageSquare size={13} />
            Text Analyses
          </TabsTrigger>
          <TabsTrigger
            value="image"
            className="gap-1.5"
            data-ocid="history.image_tab"
          >
            <FileImage size={13} />
            Image Analyses
          </TabsTrigger>
          <TabsTrigger
            value="url"
            className="gap-1.5"
            data-ocid="history.url_tab"
          >
            <Globe size={13} />
            URL Analyses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <TabPanel tabType="text" />
        </TabsContent>
        <TabsContent value="image">
          <TabPanel tabType="image" />
        </TabsContent>
        <TabsContent value="url">
          <TabPanel tabType="url" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
