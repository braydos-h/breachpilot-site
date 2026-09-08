"use client";

import { useEffect, useState } from "react";

const LINE = "Plan \u00b7 Recon \u00b7 Exploit \u00b7 Verify \u00b7 Report.";

/**
 * Restrained hero typewriter — types once, respects reduced motion.
 * SSR emits the full line (no empty flash); typing starts idle-deferred so
 * the ~40 re-renders land after LCP/INP measurement.
 */
export function Typewriter() {
  const [text, setText] = useState(LINE);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    let interval = 0;
    const start = () => {
      let i = 0;
      setText("");
      setTyping(true);
      interval = window.setInterval(() => {
        i += 1;
        setText(LINE.slice(0, i));
        if (i >= LINE.length) {
          window.clearInterval(interval);
          setTyping(false);
        }
      }, 45);
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(start);
    } else {
      timeoutId = window.setTimeout(start, 800);
    }
    return () => {
      window.clearInterval(interval);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <p className="mt-4 font-mono text-sm text-muted-foreground sm:text-base" aria-label={LINE}>
      <span aria-hidden>{text}</span>
      {typing && <span className="animate-typing-caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-foreground" aria-hidden />}
    </p>
  );
}
