'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseThinkingProgressOptions {
  /** Interval in ms between step advances. Default 1200. */
  intervalMs?: number;
}

/**
 * Hook for timer-based thinking progress. Call start() when kicking off a request,
 * complete() on success, reset() on error. activeIndex advances automatically up to steps.length - 1.
 */
export function useThinkingProgress(
  stepLabels: string[],
  options: UseThinkingProgressOptions = {}
) {
  const { intervalMs = 1200 } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setActiveIndex(0);
    const maxIndex = Math.max(0, stepLabels.length - 1);
    if (maxIndex === 0) return;
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? maxIndex : prev + 1));
    }, intervalMs);
  }, [stepLabels.length, intervalMs, clearTimer]);

  const complete = useCallback(() => {
    clearTimer();
    setActiveIndex(stepLabels.length);
  }, [stepLabels.length, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setActiveIndex(0);
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    activeIndex,
    setActiveIndex,
    start,
    complete,
    reset,
    steps: stepLabels.map((label, i) => ({ id: `step-${i}`, label })),
  };
}
