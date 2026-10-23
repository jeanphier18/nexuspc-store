"use client";

import { useEffect, useRef } from "react";

type Particle = {
  bx: number;
  by: number;
  z: number;
  r: number;
  alpha: number;
  drift: number;
  tint: number;
};

/**
 * Fondo reactivo al scroll y al puntero.
 * Tres capas: glows radiales (CSS), rejilla técnica (CSS) y campo de partículas (canvas 2D).
 * Sin WebGL para mantener el coste bajo. Respeta prefers-reduced-motion.
 */
export function ScrollBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const glowARef = useRef<HTMLDivElement | null>(null);
  const glowBRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let frameId = 0;
    let lastTime = 0;
    let scroll = window.scrollY;
    let lastRealScroll = window.scrollY;
    let speed = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerX = 0;
    let pointerY = 0;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const render = (dt: number, time: number) => {
      ctx.clearRect(0, 0, width, height);

      const stretch = 1 + Math.min(speed / 90, 1.1);

      for (const p of particles) {
        if (!reduceMotion) {
          p.by -= (p.drift * dt) / 1000;
        }

        let y =
          p.by -
          scroll * (0.05 + p.z * 0.17) +
          Math.sin(time * 0.0002 + p.z * 6) * 6 * p.z;
        y = ((y % height) + height) % height;

        const x = p.bx + pointerX * (8 + p.z * 26);
        const radius = p.r * (0.7 + p.z * 0.9);
        const alpha = p.alpha * (0.55 + p.z * 0.45);

        const tint =
          p.tint > 0.58
            ? "0, 229, 255"
            : p.tint > 0.22
              ? "167, 139, 250"
              : "231, 234, 243";

        ctx.beginPath();
        ctx.ellipse(x, y, radius, radius * stretch, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tint}, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(
        Math.min(110, Math.max(36, (width * height) / 18000)),
      );
      particles = Array.from({ length: count }, () => ({
        bx: Math.random() * width,
        by: Math.random() * height,
        z: rand(0.2, 1),
        r: rand(0.5, 1.9),
        alpha: rand(0.12, 0.48),
        drift: rand(4, 16),
        tint: Math.random(),
      }));

      render(16, 0);
    };

    const updateLayers = () => {
      const docHeight = document.documentElement.scrollHeight;
      const progress =
        docHeight > height ? scroll / (docHeight - height) : 0;

      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${(pointerX * 14).toFixed(2)}px, ${(-scroll * 0.16).toFixed(2)}px, 0)`;
      }
      if (glowARef.current) {
        glowARef.current.style.transform = `translate3d(${(pointerX * -34).toFixed(2)}px, ${(progress * 220 + pointerY * -30).toFixed(2)}px, 0)`;
      }
      if (glowBRef.current) {
        glowBRef.current.style.transform = `translate3d(${(pointerX * 28).toFixed(2)}px, ${(progress * -180).toFixed(2)}px, 0)`;
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(now - lastTime || 16.67, 48);
      lastTime = now;

      const realScroll = window.scrollY;
      const delta = realScroll - scroll;
      scroll += delta * 0.1;
      speed += (Math.abs(realScroll - lastRealScroll) - speed) * 0.12;
      lastRealScroll = realScroll;
      pointerX += (pointerTargetX - pointerX) * 0.06;
      pointerY += (pointerTargetY - pointerY) * 0.06;

      updateLayers();
      render(dt, now);

      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduceMotion || frameId) return;
      lastTime = performance.now();
      frameId = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerTargetX = (event.clientX / width - 0.5) * 2;
      pointerTargetY = (event.clientY / height - 0.5) * 2;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        updateLayers();
      }, 150);
    };

    resize();
    updateLayers();
    start();

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      {/* Glows que se desplazan con el progreso de scroll */}
      <div
        ref={glowARef}
        className="absolute -left-[15%] top-[5%] size-[70vmax] rounded-full opacity-80 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, rgba(124,58,237,0.26), rgba(124,58,237,0) 62%)",
        }}
      />
      <div
        ref={glowBRef}
        className="absolute -right-[20%] top-[35%] size-[60vmax] rounded-full opacity-70 will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,229,255,0.18), rgba(0,229,255,0) 60%)",
        }}
      />

      {/* Rejilla técnica en parallax */}
      <div
        ref={gridRef}
        className="absolute inset-[-20%] tech-grid opacity-80 will-change-transform"
      />

      {/* Partículas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Viñeta superior y fundido inferior para legibilidad */}
      <div className="absolute inset-0 tech-vignette" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/80 to-transparent" />
    </div>
  );
}
