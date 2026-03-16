import * as React from "react";

import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  slate: "border-slate-200 bg-slate-100 text-slate-700",
  blue: "border-blue-100 bg-blue-50 text-blue-700",
  teal: "border-teal-100 bg-teal-50 text-teal-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  violet: "border-violet-100 bg-violet-50 text-violet-700",
  outline: "border-slate-200 bg-white text-slate-600",
} as const;

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof VARIANT_STYLES;
};

export function Badge({
  className,
  variant = "slate",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        VARIANT_STYLES[variant],
        className,
      )}
      {...props}
    />
  );
}
