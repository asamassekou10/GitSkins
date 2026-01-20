'use client';

import { useEffect, useState } from 'react';

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
  const [animatedStats, setAnimatedStats] = useState<Stat[]>(
    stats.map((stat) => ({ ...stat, value: 0 }))
  );

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.value / steps;

      const interval = setInterval(() => {
        currentStep++;
        const newValue = Math.min(Math.floor(increment * currentStep), stat.value);

        setAnimatedStats((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], value: newValue };
          return updated;
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);
    });
  }, [stats]);

  return (
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
      {animatedStats.map((stat, index) => (
        <div
          key={index}
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 50%, #ff8c00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '8px',
            }}
          >
            {stat.prefix}
            {stat.value.toLocaleString()}
            {stat.suffix}
          </div>
          <div
            style={{
              fontSize: '16px',
              color: '#888888',
              fontWeight: 500,
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
