import type * as React from "react";
import { cn } from "@/lib/cn";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-sm border border-line bg-surface/70 px-4 text-sm text-foreground transition-colors duration-fast placeholder:text-faint hover:border-line-strong focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={htmlFor}
        className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-[11px] leading-relaxed text-danger"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-faint">{hint}</p>
      ) : null}
    </div>
  );
}
