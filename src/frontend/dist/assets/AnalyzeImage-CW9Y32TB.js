import { c as createLucideIcon, d as useQueryClient, u as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, f as LoaderCircle, F as FileImage, X, B as Button, L as LogIn, S as ShieldCheck } from "./index-DkpGCSxA.js";
import { C as Card, d as ConfidenceBar } from "./ConfidenceBar-x7YNWXno.js";
import { C as CircleAlert, a as Separator, S as Sparkles, R as RefreshCw } from "./separator-9JLyakCf.js";
import { u as useBackendActor, g as getVerdict, V as VerdictBadge, b as formatTimestamp } from "./index-v5AWFvYv.js";
import { u as useMutation, A as AnimatePresence } from "./index-B_abcmbw.js";
import { m as motion } from "./proxy-DgVxUjh9.js";
import { C as CircleCheck, S as ShieldAlert } from "./shield-alert-BfqZnETi.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function useAnalyzeImage() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (imageKey) => {
      if (!actor) throw new Error("Not connected to backend");
      return actor.analyzeImage(imageKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStatsV2"] });
      queryClient.invalidateQueries({ queryKey: ["historyV2"] });
    }
  });
}
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
function LoginPrompt() {
  const { login } = useInternetIdentity();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
      className: "flex flex-col items-center justify-center gap-6 rounded-xl border border-border bg-card px-8 py-14 text-center",
      "data-ocid": "analyze_image.login_prompt",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Sign in to analyze images" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-sm text-sm text-muted-foreground", children: "You need to be signed in with Internet Identity to run AI-powered image analysis and save your results." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: login,
            className: "gap-2",
            "data-ocid": "analyze_image.login_button",
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
function AuthenticitySection({
  label,
  flagged,
  description,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-start gap-3 rounded-lg border p-4",
      style: {
        background: flagged ? "oklch(var(--chart-3) / 0.06)" : "oklch(var(--chart-4) / 0.06)",
        borderColor: flagged ? "oklch(var(--chart-3) / 0.35)" : "oklch(var(--chart-4) / 0.35)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            style: {
              background: flagged ? "oklch(var(--chart-3) / 0.12)" : "oklch(var(--chart-4) / 0.12)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Icon,
              {
                size: 16,
                style: {
                  color: flagged ? "oklch(var(--chart-3))" : "oklch(var(--chart-4))"
                }
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "mt-0.5 text-sm font-semibold",
              style: {
                color: flagged ? "oklch(var(--chart-3))" : "oklch(var(--chart-4))"
              },
              children: flagged ? "Flagged" : "Looks Authentic"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground leading-relaxed", children: description })
        ] })
      ]
    }
  );
}
function ImageResultView({
  result,
  onReset
}) {
  const verdict = getVerdict(result.isFake, result.confidenceScore);
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
            "data-ocid": "analyze_image.result_card",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(VerdictBadge, { verdict, size: "lg" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold text-foreground tabular-nums", children: [
                  score,
                  "% confidence"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground font-mono", children: formatTimestamp(result.timestamp) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ConfidenceBar, { score, verdict, showLabel: false })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
            "data-ocid": "analyze_image.verdicts_grid",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AuthenticitySection,
                {
                  label: "OCR Text Analysis",
                  flagged: result.isFake,
                  description: result.ocrVerdict || (result.isFake ? "Extracted text contains patterns associated with fake reviews." : "Extracted text appears authentic and natural."),
                  icon: Eye
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AuthenticitySection,
                {
                  label: "Image Authenticity",
                  flagged: result.isFake,
                  description: result.authenticityVerdict || (result.isFake ? "Image shows signs of manipulation or AI generation." : "Image appears to be an authentic, unmodified screenshot."),
                  icon: result.isFake ? ShieldAlert : ShieldCheck
                }
              )
            ]
          }
        ),
        result.ocrText && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 space-y-2", "data-ocid": "analyze_image.ocr_text_card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold text-foreground", children: "Extracted Text (OCR)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 leading-relaxed bg-muted/40 rounded-lg p-3 font-mono text-xs whitespace-pre-wrap break-words", children: result.ocrText })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "p-6 space-y-3",
            "data-ocid": "analyze_image.explanation_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-sm font-semibold text-foreground", children: "AI Explanation" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap", children: result.explanation })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "gap-2",
            onClick: onReset,
            "data-ocid": "analyze_image.analyze_another_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
              "Analyze another image"
            ]
          }
        ) })
      ]
    }
  );
}
function AnalyzeImage() {
  const { isInitializing, isAuthenticated } = useInternetIdentity();
  const [file, setFile] = reactExports.useState(null);
  const [preview, setPreview] = reactExports.useState(null);
  const [uploadProgress, setUploadProgress] = reactExports.useState(0);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [fileError, setFileError] = reactExports.useState(null);
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const {
    mutate: analyzeImage,
    isPending: isAnalyzing,
    error: analysisError,
    reset: resetMutation
  } = useAnalyzeImage();
  const handleFileSelect = reactExports.useCallback(
    (selected) => {
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
      reader.onload = (e) => {
        var _a;
        return setPreview((_a = e.target) == null ? void 0 : _a.result);
      };
      reader.readAsDataURL(selected);
    },
    [resetMutation]
  );
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect]
  );
  const handleDragOver = reactExports.useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = reactExports.useCallback(() => setIsDragOver(false), []);
  async function handleUploadAndAnalyze() {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const interval = setInterval(() => {
        setUploadProgress((p) => Math.min(p + 15, 85));
      }, 200);
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
        onSuccess: (res) => setResult(res)
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex min-h-[60vh] items-center justify-center",
        "data-ocid": "analyze_image.loading_state",
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
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { size: 15, className: "text-primary" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground tracking-tight", children: "Image Analysis" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Upload a screenshot of a product review page. Our AI will extract the text via OCR and detect signs of image manipulation or AI generation." })
        ]
      }
    ),
    !isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoginPrompt, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: result ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageResultView,
      {
        result,
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
          !file ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "aria-label": "Upload image dropzone",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              onDrop: handleDrop,
              onDragOver: handleDragOver,
              onDragLeave: handleDragLeave,
              className: `relative w-full flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-14 text-center cursor-pointer transition-smooth ${isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}`,
              "data-ocid": "analyze_image.dropzone",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex h-14 w-14 items-center justify-center rounded-full",
                    style: { background: "oklch(var(--primary) / 0.1)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 24, className: "text-primary" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-base font-semibold text-foreground", children: [
                    "Drop your image here or",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "browse" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "JPG, PNG, or WebP · Max 10MB" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: fileInputRef,
                    type: "file",
                    accept: "image/jpeg,image/png,image/webp",
                    className: "sr-only",
                    onChange: (e) => {
                      var _a;
                      const f = (_a = e.target.files) == null ? void 0 : _a[0];
                      if (f) handleFileSelect(f);
                    },
                    "data-ocid": "analyze_image.upload_button"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "overflow-hidden p-0",
              "data-ocid": "analyze_image.preview_card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-muted/40", children: [
                  preview && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: preview,
                      alt: "Uploaded preview",
                      className: "w-full max-h-72 object-contain"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleRemoveFile,
                      className: "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground shadow hover:text-destructive transition-colors",
                      "aria-label": "Remove image",
                      "data-ocid": "analyze_image.remove_image_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3.5 border-t border-border flex items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: file.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      (file.size / 1024 / 1024).toFixed(2),
                      " MB"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16, className: "text-chart-4 shrink-0" })
                ] }),
                isUploading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-4 space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Processing image…" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                      uploadProgress,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      className: "h-full bg-primary rounded-full",
                      initial: { width: 0 },
                      animate: { width: `${uploadProgress}%` },
                      transition: { duration: 0.3 }
                    }
                  ) })
                ] })
              ]
            }
          ),
          fileError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: "flex items-center gap-1.5 text-xs text-destructive",
              role: "alert",
              "data-ocid": "analyze_image.field_error",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 flex-shrink-0" }),
                fileError
              ]
            }
          ),
          analysisError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.97 },
              animate: { opacity: 1, scale: 1 },
              className: "flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3",
              "data-ocid": "analyze_image.error_state",
              role: "alert",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: "Analysis failed" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: analysisError.message.includes("Not connected") ? "Could not connect to the backend. Please refresh and try again." : "The AI image analysis encountered an error. Please try again." })
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
              onClick: handleUploadAndAnalyze,
              disabled: !file || isUploading || isAnalyzing || !!fileError,
              "data-ocid": "analyze_image.submit_button",
              children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Processing image…"
              ] }) : isAnalyzing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                "Analyzing with AI…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
                "Analyze Image"
              ] })
            }
          ),
          (isUploading || isAnalyzing) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-center text-xs text-muted-foreground",
              "data-ocid": "analyze_image.loading_state",
              children: isUploading ? "Processing image data…" : "AI is analyzing the image — OCR extraction + authenticity check…"
            }
          )
        ]
      },
      "form"
    ) })
  ] });
}
export {
  AnalyzeImage as default
};
