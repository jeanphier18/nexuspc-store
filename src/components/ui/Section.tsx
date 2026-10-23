import type * as React from "react";
import { cn } from "@/lib/cn";

export function Section({
  kicker,
  title,
  body,
  aside,
  children,
  className,
}: {
  kicker: string;
  title: string;
  body: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("border-t border-line/70 py-16 sm:py-20", className)}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="eyebrow">{kicker}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-end">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {title}
          </h2>
          <div className="md:justify-self-end">
            <p className="max-w-lg text-sm leading-relaxed text-muted">
              {body}
            </p>
            {aside ? <div className="mt-4">{aside}</div> : null}
          </div>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
