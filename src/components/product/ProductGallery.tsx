"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { ProductImage } from "@/data/product-images";
import { cn } from "@/lib/cn";

export function ProductGallery({
  images,
  brand,
  categoryLabel,
  isNew,
  discount,
  labels,
}: {
  images: ProductImage[];
  brand: string;
  categoryLabel: string;
  isNew: boolean;
  discount: number | null;
  labels: {
    newLabel: string;
    previous: string;
    next: string;
    zoom: string;
    close: string;
    photoNote: string;
    thumbnail: string;
    mainImage: string;
    gallery: string;
  };
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const touchStart = useRef<number | null>(null);
  const image = images[active] ?? images[0];

  const go = (direction: -1 | 1) => {
    setActive((current) => (current + direction + images.length) % images.length);
  };

  const openZoom = () => {
    dialogRef.current?.showModal();
    setOpen(true);
    document.documentElement.style.overflow = "hidden";
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, images.length]);

  if (!image) return null;

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          data-gallery-stage
          className="group relative aspect-[4/3] overflow-hidden bg-surface-2 sm:aspect-[16/10]"
          onTouchStart={(event) => {
            touchStart.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return;
            const delta =
              (event.changedTouches[0]?.clientX ?? 0) - touchStart.current;
            if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1);
            touchStart.current = null;
          }}
        >
          <Image
            key={image.src}
            data-gallery-main
            src={image.src}
            alt={image.alt}
            fill
            priority={active === 0}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="animate-[image-in_420ms_ease-out] object-cover"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-background/10"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(7,7,13,0.35)]"
          />

          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2">
            {isNew ? (
              <Badge variant="primary" className="backdrop-blur-sm">
                {labels.newLabel}
              </Badge>
            ) : (
              <span />
            )}
            {discount ? (
              <Badge variant="danger" className="backdrop-blur-sm">
                −{discount}%
              </Badge>
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-foreground/70">
                {brand}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-faint">
                {categoryLabel}
              </p>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint/80">
              {labels.photoNote}
            </span>
          </div>

          <button
            type="button"
            onClick={openZoom}
            aria-label={labels.zoom}
            className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong/80 bg-background/55 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-fast hover:border-accent/60 hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
          >
            <Expand aria-hidden="true" className="size-4" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.previous}
                className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong/70 bg-background/55 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-fast hover:border-accent/60 hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong/70 bg-background/55 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-fast hover:border-accent/60 hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
              >
                <ChevronRight aria-hidden="true" className="size-4" />
              </button>
            </>
          ) : null}
        </div>

        {images.length > 1 ? (
          <div className="flex gap-2 border-t border-line bg-surface/60 p-3">
            {images.map((item, index) => (
              <button
                key={`${item.id}-${index}`}
                type="button"
                data-gallery-thumb
                onClick={() => setActive(index)}
                aria-label={`${labels.thumbnail} ${index + 1}: ${item.alt}`}
                aria-pressed={index === active}
                className={cn(
                  "relative aspect-[4/3] w-20 overflow-hidden rounded-xs border transition-[border-color,opacity,transform] duration-fast",
                  index === active
                    ? "border-accent/80 opacity-100"
                    : "border-line opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={item.src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        data-gallery-dialog
        aria-label={labels.gallery}
        onClose={() => {
          setOpen(false);
          document.documentElement.style.overflow = "";
        }}
        className="m-auto h-[min(86vh,820px)] w-[min(92vw,1180px)] max-w-none overflow-hidden rounded-card border border-line-strong bg-background p-0 text-foreground shadow-panel backdrop:bg-background/90 backdrop:backdrop-blur-md"
      >
        <div className="relative h-full w-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="92vw"
            className="object-contain"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-5 pb-4 pt-16">
            <p
              data-gallery-counter
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint"
            >
              {labels.mainImage} {active + 1}/{images.length} · {image.alt}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={labels.close}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-line-strong bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-accent/60 hover:text-accent"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.previous}
                className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-accent/60 hover:text-accent"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-background/70 text-foreground backdrop-blur-sm transition-colors hover:border-accent/60 hover:text-accent"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
