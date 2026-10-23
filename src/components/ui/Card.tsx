import type * as React from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  glow = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { glow?: boolean }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-card border border-line bg-surface/70 backdrop-blur-sm transition-colors duration-base hover:border-line-strong",
        className,
      )}
      {...props}
    >
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-base group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(520px circle at 50% -10%, rgba(124,58,237,0.22), transparent 55%)",
          }}
        />
      ) : null}
      {children}
    </div>
  );
}
