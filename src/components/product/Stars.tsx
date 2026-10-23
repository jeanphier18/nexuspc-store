import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function Stars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  const filled = Math.round(rating);

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating.toFixed(1)} / 5`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={cn(
            "size-3.5",
            index < filled
              ? "fill-accent text-accent"
              : "fill-transparent text-line-strong",
          )}
        />
      ))}
    </span>
  );
}
