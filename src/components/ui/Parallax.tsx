"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the scroll distance applied as vertical offset. Keep it tiny. */
  speed?: number;
  /** Only enabled from this viewport width (desktop). */
  minWidth?: number;
  /** Stop updating after this scroll distance (the hero is long gone). */
  maxScroll?: number;
};

/**
 * Very slight, rAF-throttled vertical parallax. Desktop only, disabled when
 * the user prefers reduced motion. No scroll hijacking.
 */
export function Parallax({
  children,
  className,
  speed = 0.07,
  minWidth = 1024,
  maxScroll = 1100,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`);
    let frame = 0;
    let listening = false;

    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, maxScroll);
      el.style.transform = `translate3d(0, ${(y * speed).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const setup = () => {
      const enabled = wide.matches && !reducedMotion.matches;
      if (enabled && !listening) {
        window.addEventListener("scroll", onScroll, { passive: true });
        listening = true;
        update();
      } else if (!enabled && listening) {
        window.removeEventListener("scroll", onScroll);
        listening = false;
        el.style.transform = "";
      }
    };

    setup();
    reducedMotion.addEventListener("change", setup);
    wide.addEventListener("change", setup);

    return () => {
      window.removeEventListener("scroll", onScroll);
      reducedMotion.removeEventListener("change", setup);
      wide.removeEventListener("change", setup);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed, minWidth, maxScroll]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
