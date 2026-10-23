import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background-color,border-color,color,box-shadow,transform,filter] duration-fast ease-out active:scale-[0.985] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-primary-hover hover:shadow-glow-violet",
        accent:
          "bg-accent text-on-accent hover:brightness-110 hover:shadow-glow-cyan",
        outline:
          "border border-line-strong bg-surface/40 text-foreground backdrop-blur hover:border-secondary/70 hover:bg-surface-2/70",
        ghost: "text-muted hover:bg-surface hover:text-foreground",
        danger: "bg-danger text-white hover:brightness-110",
      },
      size: {
        sm: "h-9 rounded-xs px-3.5 text-[13px]",
        md: "h-11 rounded-sm px-5 text-sm",
        lg: "h-13 rounded-sm px-7 text-[15px]",
        icon: "size-10 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
