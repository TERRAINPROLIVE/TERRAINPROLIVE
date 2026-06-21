import React, { useEffect, useRef, useState } from "react";

/**
 * Premium count-up. Custom easing matching cubic-bezier(0.16, 1, 0.3, 1) —
 * same curve Linear/Vercel use. Fast start, long gentle tail. 60fps via rAF.
 * Honors prefers-reduced-motion.
 */
const EASE = (t) => 1 - Math.pow(1 - t, 4);

export function useCountUp(target, duration = 1400, deps = []) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      setValue(target * EASE(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, ...deps]);

  return value;
}

export function CountUp({ value, prefix = "", suffix = "", decimals = 0, className, duration = 1400 }) {
  const v = useCountUp(value, duration);
  const display = decimals === 0
    ? Math.round(v).toLocaleString("en-AU")
    : v.toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span className={className} data-testid="count-up">
      {prefix}{display}{suffix}
    </span>
  );
}
