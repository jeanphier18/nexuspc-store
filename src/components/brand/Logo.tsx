import { cn } from "@/lib/cn";

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="size-8 shrink-0 text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 2.5 28 9v14l-12 6.5L4 23V9z" />
        <path d="M11.5 21V11l9 10V11" />
      </svg>
      {showWordmark ? (
        <span className="font-display text-base font-semibold tracking-tight">
          NEXUS<span className="text-accent">PC</span>
        </span>
      ) : null}
    </span>
  );
}
