"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

function msUntilSundayReset(): number {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  end.setHours(23, 59, 59, 999);

  if (end.getTime() <= now.getTime()) {
    end.setDate(end.getDate() + 7);
  }

  return end.getTime() - now.getTime();
}

export function DealCountdown() {
  const t = useTranslations("home.deals");
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(msUntilSundayReset());

    const interval = window.setInterval(() => {
      setRemaining(msUntilSundayReset());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const mounted = remaining !== null;
  const total = Math.max(remaining ?? 0, 0);

  const parts = [
    { key: "days", value: Math.floor(total / 86_400_000) },
    { key: "hours", value: Math.floor(total / 3_600_000) % 24 },
    { key: "minutes", value: Math.floor(total / 60_000) % 60 },
    { key: "seconds", value: Math.floor(total / 1000) % 60 },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
        {t("countdownLabel")}
      </span>
      <div className="flex items-end gap-1.5" role="timer" aria-live="off">
        {parts.map((part) => (
          <div
            key={part.key}
            className="flex min-w-[46px] flex-col items-center rounded-sm border border-line bg-surface/70 px-2 py-1.5"
          >
            <span className="font-mono text-sm tabular-nums text-foreground">
              {mounted ? String(part.value).padStart(2, "0") : "--"}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
              {t(part.key)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
