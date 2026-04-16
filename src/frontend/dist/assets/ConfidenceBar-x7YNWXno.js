import { j as jsxRuntimeExports, b as cn } from "./index-DkpGCSxA.js";
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
const barColorClass = {
  genuine: "bg-chart-4",
  suspicious: "bg-chart-2",
  fake: "bg-chart-3"
};
function ConfidenceBar({
  score,
  verdict,
  showLabel = true,
  className
}) {
  const clamped = Math.min(100, Math.max(0, score));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-3", className), children: [
    showLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs whitespace-nowrap font-mono", children: "Confidence" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "h-full rounded-full transition-all duration-700",
          barColorClass[verdict]
        ),
        style: { width: `${clamped}%` },
        "aria-valuenow": clamped,
        "aria-valuemin": 0,
        "aria-valuemax": 100
      }
    ) }),
    showLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs font-semibold text-foreground tabular-nums w-8 text-right", children: [
      clamped,
      "%"
    ] })
  ] });
}
export {
  Card as C,
  CardContent as a,
  CardHeader as b,
  CardTitle as c,
  ConfidenceBar as d
};
