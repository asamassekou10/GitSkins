'use client';

import { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { AnimatedSection } from './AnimatedSection';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
}

interface StatsCounterProps {
  stats: Stat[];
}

export function StatsCounter({ stats }: StatsCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0));
  const [triggered, setTriggered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;

    if (prefersReducedMotion) {
      setAnimatedValues(stats.map((s) => s.value));
      return;
    }

    const duration = 1800;
    const steps = 60;
    const stepMs = duration / steps;

    const timers = stats.map((stat, i) => {
      let step = 0;
      return setInterval(() => {
        step++;
        const progress = step / steps;
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(eased * stat.value);
        setAnimatedValues((prev) => {
          const next = [...prev];
          next[i] = Math.min(val, stat.value);
          return next;
        });
        if (step >= steps) clearInterval(timers[i]);
      }, stepMs);
    });

    return () => timers.forEach(clearInterval);
  }, [triggered, stats, prefersReducedMotion]);

  return (
    <div ref={containerRef}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '32px',
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '60px 20px',
        }}
      >
        {stats.map((stat, i) => (
          <AnimatedSection key={i} delay={i * 0.08} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 'clamp(32px, 5vw, 48px)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '8px',
              }}
            >
              {stat.prefix}{animatedValues[i].toLocaleString()}{stat.suffix}
            </div>
            <div style={{ fontSize: '16px', color: '#888888', fontWeight: 500 }}>
              {stat.label}
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
