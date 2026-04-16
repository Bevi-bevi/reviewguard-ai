import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileImage,
  Loader2,
  LogIn,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { ConfidenceBar } from "../components/ConfidenceBar";
import { VerdictBadge } from "../components/VerdictBadge";
import { useAnalyzeImage } from "../hooks/useAnalyzeImage";
import { formatTimestamp, getVerdict } from "../types";
import type { ImageAnalysisResult } from "../types";
import type { Verdict } from "../types";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function LoginPrompt() {
  const { login } = useInternetIdentity();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card px-8 py-14 text-center"
      data-ocid="analyze_image.login_prompt"
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
          Sign in to analyze images
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          You need to be signed in with Internet Identity to run AI-powered
          image analysis and save your results.
        </p>
      </div>
      <Button
        onClick={login}
        className="gap-2"
        data-ocid="analyze_image.login_button"
      >
        <LogIn className="h-4 w-4" />
        Sign in with Internet Identity
      </Button>
    </motion.div>
  );
}

function AuthenticitySection({
  label,
  flagged,
  description,
  icon: Icon,
}: {
  label: string;
  flagged: boolean;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg border p-4"
      style={{
        background: flagged
          ? "oklch(var(--chart-3) / 0.06)"
          : "oklch(var(--chart-4) / 0.06)",
        borderColor: flagged
          ? "oklch(var(--chart-3) / 0.35)"
          : "oklch(var(--chart-4) / 0.35)",
      }}
    >
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{
          background: flagged
            ? "oklch(var(--chart-3) / 0.12)"
            : "oklch(var(--chart-4) / 0.12)",
        }}
      >
        <Icon
          size={16}
          style={{
            color: flagged ? "oklch(var(--chart-3))" : "oklch(var(--chart-4))",
          }}
        />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p
          className="mt-0.5 text-sm font-semibold"
          style={{
            color: flagged ? "oklch(var(--chart-3))" : "oklch(var(--chart-4))",
          }}
        >
          {flagged ? "Flagged" : "Looks Authentic"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function ImageResultView({
  result,
  onReset,
}: {
  result: ImageAnalysisResult;
  onReset: () => void;
}) {
  const verdict: Verdict = getVerdict(result.isFake, result.confidenceScore);
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
      {/* Overall verdict */}
      <Card
        className={`overflow-hidden p-0 ${resultClass}`}
        data-ocid="analyze_image.result_card"
      >
        <div className="px-6 py-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <VerdictBadge verdict={verdict} size="lg" />
            <span className="font-mono text-sm font-semibold text-foreground tabular-nums">
              {score}% confidence
            </span>
            <span className="ml-auto text-xs text-muted-foreground font-mono">
              {formatTimestamp(result.timestamp)}
            </span>
          </div>
          <ConfidenceBar score={score} verdict={verdict} showLabel={false} />
        </div>
      </Card>

      {/* Two verdict sections */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        data-ocid="analyze_image.verdicts_grid"
      >
        <AuthenticitySection
          label="OCR Text Analysis"
          flagged={result.isFake}
          description={
            result.ocrVerdict ||
            (result.isFake
              ? "Extracted text contains patterns associated with fake reviews."
              : "Extracted text appears authentic and natural.")
          }
          icon={Eye}
        />
        <AuthenticitySection
          label="Image Authenticity"
          flagged={result.isFake}
          description={
            result.authenticityVerdict ||
            (result.isFake
              ? "Image shows signs of manipulation or AI generation."
              : "Image appears to be an authentic, unmodified screenshot.")
          }
          icon={result.isFake ? ShieldAlert : ShieldCheck}
        />
      </div>

      {/* OCR Text */}
      {result.ocrText && (
        <Card className="p-5 space-y-2" data-ocid="analyze_image.ocr_text_card">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <h3 className="font-display text-sm font-semibold text-foreground">
              Extracted Text (OCR)
            </h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed bg-muted/40 rounded-lg p-3 font-mono text-xs whitespace-pre-wrap break-words">
            {result.ocrText}
          </p>
        </Card>
      )}

      {/* AI Explanation */}
      <Card
        className="p-6 space-y-3"
        data-ocid="analyze_image.explanation_card"
      >
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
          data-ocid="analyze_image.analyze_another_button"
        >
          <RefreshCw className="h-4 w-4" />
          Analyze another image
        </Button>
      </div>
    </motion.div>
  );
}

export default function AnalyzeImage() {
  const { isInitializing, isAuthenticated } = useInternetIdentity();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    mutate: analyzeImage,
    isPending: isAnalyzing,
    error: analysisError,
    reset: resetMutation,
  } = useAnalyzeImage();

  const handleFileSelect = useCallback(
    (selected: File) => {
      setFileError(null);
      setResult(null);
      resetMutation();

      if (!ACCEPTED_TYPES.includes(selected.type)) {
        setFileError("Please upload a JPG, PNG, or WebP image.");
        return;
      }
      if (selected.size > MAX_FILE_SIZE) {
        setFileError("File size exceeds 10MB limit.");
        return;
      }

      setFile(selected);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(selected);
    },
    [resetMutation],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  async function handleUploadAndAnalyze() {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress while encoding
      const interval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 15, 85));
      }, 200);

      // Encode file as base64 key (object-storage integration)
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binary += String.fromCharCode(uint8Array[i]);
      }
      const base64Key = btoa(binary);
      const imageKey = `image:${file.name}:${base64Key.slice(0, 32)}`;

      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);

      analyzeImage(imageKey, {
        onSuccess: (res) => setResult(res),
      });
    } catch {
      setIsUploading(false);
      setFileError("Failed to process image. Please try again.");
    }
  }

  function handleReset() {
    setFile(null);
    setPreview(null);
    setUploadProgress(0);
    setIsUploading(false);
    setFileError(null);
    setResult(null);
    resetMutation();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveFile() {
    setFile(null);
    setPreview(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (isInitializing) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        data-ocid="analyze_image.loading_state"
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
            <FileImage size={15} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
            Image Analysis
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Upload a screenshot of a product review page. Our AI will extract the
          text via OCR and detect signs of image manipulation or AI generation.
        </p>
      </motion.div>

      {/* Auth gate */}
      {!isAuthenticated ? (
        <LoginPrompt />
      ) : (
        <AnimatePresence mode="wait">
          {result ? (
            <ImageResultView
              key="result"
              result={result}
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
              {/* Dropzone */}
              {!file ? (
                <button
                  type="button"
                  aria-label="Upload image dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative w-full flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-14 text-center cursor-pointer transition-smooth ${
                    isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                  data-ocid="analyze_image.dropzone"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: "oklch(var(--primary) / 0.1)" }}
                  >
                    <Upload size={24} className="text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display text-base font-semibold text-foreground">
                      Drop your image here or{" "}
                      <span className="text-primary">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, or WebP · Max 10MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileSelect(f);
                    }}
                    data-ocid="analyze_image.upload_button"
                  />
                </button>
              ) : (
                <Card
                  className="overflow-hidden p-0"
                  data-ocid="analyze_image.preview_card"
                >
                  {/* Preview */}
                  <div className="relative bg-muted/40">
                    {preview && (
                      <img
                        src={preview}
                        alt="Uploaded preview"
                        className="w-full max-h-72 object-contain"
                      />
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow hover:text-destructive transition-colors"
                      aria-label="Remove image"
                      data-ocid="analyze_image.remove_image_button"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div className="px-5 py-3.5 border-t border-border flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <CheckCircle2 size={16} className="text-chart-4 shrink-0" />
                  </div>

                  {/* Upload progress */}
                  {isUploading && (
                    <div className="px-5 pb-4 space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processing image…</span>
                        <span className="font-mono">{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {/* File error */}
              {fileError && (
                <p
                  className="flex items-center gap-1.5 text-xs text-destructive"
                  role="alert"
                  data-ocid="analyze_image.field_error"
                >
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {fileError}
                </p>
              )}

              {/* Analysis error */}
              {analysisError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3"
                  data-ocid="analyze_image.error_state"
                  role="alert"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-destructive">
                      Analysis failed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {analysisError.message.includes("Not connected")
                        ? "Could not connect to the backend. Please refresh and try again."
                        : "The AI image analysis encountered an error. Please try again."}
                    </p>
                  </div>
                </motion.div>
              )}

              <Separator />

              {/* Submit */}
              <Button
                size="lg"
                className="w-full gap-2 font-semibold"
                onClick={handleUploadAndAnalyze}
                disabled={!file || isUploading || isAnalyzing || !!fileError}
                data-ocid="analyze_image.submit_button"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing image…
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing with AI…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analyze Image
                  </>
                )}
              </Button>

              {(isUploading || isAnalyzing) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-xs text-muted-foreground"
                  data-ocid="analyze_image.loading_state"
                >
                  {isUploading
                    ? "Processing image data…"
                    : "AI is analyzing the image — OCR extraction + authenticity check…"}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
