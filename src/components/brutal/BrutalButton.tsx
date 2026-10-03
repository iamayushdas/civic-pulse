import React from "react";
import { cn } from "@/lib/utils";

export type BrutalButtonVariant =
  | "primary"
  | "white"
  | "ghost"
  | "accent"
  | "danger";

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BrutalButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
  block?: boolean;
}

const variantStyles: Record<BrutalButtonVariant, string> = {
  primary: "btn-brutal-primary",
  white: "btn-brutal-white",
  ghost: "btn-brutal-ghost",
  accent: "btn-brutal-primary",
  danger: "btn-brutal-primary",
};

export function BrutalButton({
  variant = "primary",
  loading,
  icon,
  block,
  className,
  children,
  ...props
}: BrutalButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      disabled={loading || props.disabled}
      className={cn(
        "btn-brutal",
        variantStyles[variant],
        block && "btn-brutal-block",
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
}