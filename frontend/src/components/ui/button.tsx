import * as React from "react";

import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-100",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-4 focus-visible:ring-slate-200",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-slate-100",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-slate-100",
  destructive:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-red-100",
} as const;

const SIZE_STYLES = {
  sm: "h-9 px-3 text-sm",
  default: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10",
} as const;

export type ButtonVariant = keyof typeof VARIANT_STYLES;
export type ButtonSize = keyof typeof SIZE_STYLES;

export function buttonStyles({
  variant = "primary",
  size = "default",
  fullWidth = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition outline-none disabled:cursor-not-allowed disabled:opacity-60",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    fullWidth && "w-full",
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  className,
  variant,
  size,
  fullWidth,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
