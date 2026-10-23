import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em]",
  {
    variants: {
      variant: {
        neutral: "border-line bg-surface-2/80 text-muted",
        accent: "border-accent/40 bg-accent/10 text-accent",
        primary: "border-primary/50 bg-primary/20 text-secondary",
        success: "border-success/40 bg-success/10 text-success",
        danger: "border-danger/40 bg-danger/10 text-danger",
        outline: "border-line-strong bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
