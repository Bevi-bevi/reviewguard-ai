import { j as jsxRuntimeExports, b as cn, B as Button } from "./index-DkpGCSxA.js";
import { S as Search } from "./triangle-alert-DL2PqnGe.js";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
  icon,
  ...rest
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      ),
      "data-ocid": "empty_state",
      ...rest,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground", children: icon ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 28 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-2 font-display text-lg font-semibold text-foreground", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 max-w-xs text-sm text-muted-foreground leading-relaxed", children: description }),
        actionLabel && onAction && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: onAction,
            variant: "outline",
            "data-ocid": "empty_state.primary_button",
            children: actionLabel
          }
        )
      ]
    }
  );
}
export {
  EmptyState as E,
  Skeleton as S
};
