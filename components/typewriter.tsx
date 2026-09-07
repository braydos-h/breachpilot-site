"use client";

import { useEffect, useState } from "react";

const LINES = ["Plan · Recon · Exploit · Verify · Report."];

/** Restrained hero typewriter — types once, respects reduced motion. */
export function Typewriter() {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(LINES[0]);
      setDone(true);
      return;
    }
    const full = LINES[0];
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setText(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 45);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="mt-4 font-mono text-sm text-muted-foreground sm:text-base" aria-label={LINES[0]}>
      {/* no-JS / pre-hydration fallback: full line visible until the effect runs */}
      <noscript>{LINES[0]}</noscript>
      <span aria-hidden>{text}</span>
      {!done && <span className="animate-typing-caret ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-foreground" aria-hidden />}
    </p>
  );
}
