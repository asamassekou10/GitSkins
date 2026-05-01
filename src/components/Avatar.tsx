'use client';

import { useState } from 'react';

interface AvatarProps {
  src: string;
  name: string;
  size?: number;
  shape?: 'circle' | 'square';
  ring?: boolean;
  style?: React.CSSProperties;
}

function getInitialsBg(name: string): string {
  const palette = ['#22c55e', '#3b82f6', '#a855f7', '#f97316', '#ec4899', '#14b8a6', '#eab308', '#ef4444'];
  const idx = (name.charCodeAt(0) + name.charCodeAt(name.length - 1)) % palette.length;
  return palette[idx];
}

export function Avatar({ src, name, size = 36, shape = 'circle', ring = false, style }: AvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const radius = shape === 'circle' ? '50%' : `${Math.round(size * 0.22)}px`;
  const initial = (name[0] ?? '?').toUpperCase();
  const bgColor = getInitialsBg(name);

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: radius,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    ...style,
  };

  const ringStyle: React.CSSProperties = ring
    ? {
        outline: '2px solid #22c55e',
        outlineOffset: '2px',
      }
    : {};

  return (
    <>
      {ring && (
        <style>{`
          @keyframes _avatar_ring_pulse {
            0%, 100% { outline-color: #22c55e; box-shadow: 0 0 0 0 rgba(34,197,94,0.3); }
            50% { outline-color: #4ade80; box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }
          }
        `}</style>
      )}
      <div
        style={{
          ...baseStyle,
          ...ringStyle,
          animation: ring ? '_avatar_ring_pulse 2.5s ease-in-out infinite' : undefined,
        }}
      >
        {/* Shimmer skeleton — shows until image loads */}
        {!loaded && !error && (
          <div
            className="skeleton"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius,
            }}
          />
        )}

        {/* Initials fallback */}
        {error && (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: radius,
              fontSize: Math.round(size * 0.4),
              fontWeight: 700,
              color: '#000',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {initial}
          </div>
        )}

        {/* Actual image */}
        {!error && (
          <img
            src={src}
            alt={name}
            width={size}
            height={size}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => { setError(true); setLoaded(true); }}
            style={{
              width: size,
              height: size,
              objectFit: 'cover',
              borderRadius: radius,
              display: 'block',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          />
        )}
      </div>
    </>
  );
}
