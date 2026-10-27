"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduceMotion;
}

export type ArtItem = {
  id: string;
  src: string;
  label: string;
  side: "left" | "right";
  top: string;
  depth?: number;
  width?: string;
  style?: CSSProperties;
};

function ArtTile({
  item,
  progress,
  reduceMotion,
  bleed,
}: {
  item: ArtItem;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduceMotion: boolean | null;
  bleed: boolean;
}) {
  const depth = item.depth ?? 1;
  const gutter = bleed
    ? "0.25rem"
    : "calc(min(0px, (80rem - 100vw) / 2) * 0.9)";
  const y = useTransform(progress, [0, 1], [0, depth * 120]);
  const rotate = useTransform(
    progress,
    [0, 0.5, 1],
    [-0.8 * depth, 0, 0.8 * depth],
  );

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [5, -5]), {
    stiffness: 160,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 160,
    damping: 18,
  });

  return (
    <motion.div
      aria-hidden="true"
      suppressHydrationWarning
      className={cn(
        "pointer-events-auto absolute hidden lg:block",
        item.side === "left" ? "left-0" : "right-0",
      )}
      style={{
        top: item.top,
        width: item.width ?? "clamp(190px, 16vw, 270px)",
        ...item.style,
        [item.side === "left" ? "left" : "right"]: gutter,
        y: reduceMotion ? 0 : y,
        rotate: reduceMotion ? 0 : rotate,
      }}
    >
      <motion.div
        className="group relative rounded-sm border border-line/80 bg-surface-2/50 p-2 opacity-[0.22] shadow-panel backdrop-blur-[2px] transition-[opacity,border-color,box-shadow] duration-base hover:border-accent/45 hover:opacity-90 hover:shadow-glow-cyan focus-within:opacity-90"
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformPerspective: 900,
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onPointerMove={(event) => {
          if (reduceMotion) return;
          const rect = event.currentTarget.getBoundingClientRect();
          pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
          pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
        }}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-surface">
          <Image
            src={item.src}
            alt=""
            fill
            sizes="270px"
            className="object-cover grayscale-[0.55] saturate-[0.7] transition-[filter,transform] duration-slow group-hover:scale-[1.04] group-hover:grayscale-0 group-hover:saturate-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/35 via-transparent to-accent/25 mix-blend-color" />
          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(7,7,13,0.65)]" />

          <span className="absolute left-2 top-2 size-2 border-l border-t border-accent/70" />
          <span className="absolute right-2 top-2 size-2 border-r border-t border-accent/70" />
          <span className="absolute bottom-2 left-2 size-2 border-b border-l border-accent/70" />
          <span className="absolute bottom-2 right-2 size-2 border-b border-r border-accent/70" />
        </div>

        <div
          className={cn(
            "mt-2 flex items-center justify-between gap-2 px-0.5",
            item.side === "right" && "justify-end",
          )}
        >
          <span
            className={cn(
              "truncate font-mono text-[8px] uppercase tracking-[0.18em] text-foreground/70",
              item.side === "right" && "text-right",
            )}
          >
            {item.label}
          </span>
          <span
            className={cn(
              "font-mono text-[8px] text-accent/70",
              item.side === "right" && "hidden",
            )}
          >
            NEXUS
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function BackgroundArt({
  items,
  className,
  bleed = false,
}: {
  items: ArtItem[];
  className?: string;
  bleed?: boolean;
}) {
  const { scrollYProgress } = useScroll();
  const reduceMotion = usePrefersReducedMotion();

  if (items.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      data-background-art=""
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        className,
      )}
    >
      {items.map((item) => (
        <ArtTile
          key={item.id}
          item={item}
          progress={scrollYProgress}
          reduceMotion={reduceMotion}
          bleed={bleed}
        />
      ))}
    </div>
  );
}
