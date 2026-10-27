"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Entrada suave al hacer scroll. Solo anima transform y opacity.
 * Con `prefers-reduced-motion` el CSS desactiva la animación sin cambiar el HTML.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      data-reveal
      suppressHydrationWarning
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
