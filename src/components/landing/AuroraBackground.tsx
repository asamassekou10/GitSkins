'use client';

interface AuroraBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  position?: 'top' | 'center';
}

export function AuroraBackground({
  intensity = 'medium',
  position = 'top'
}: AuroraBackgroundProps) {
  const opacityMap = {
    low: { primary: 0.15, secondary: 0.08 },
    medium: { primary: 0.25, secondary: 0.12 },
    high: { primary: 0.35, secondary: 0.18 },
  };

  const opacity = opacityMap[intensity];
  const topPosition = position === 'top' ? '10%' : '50%';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Main aurora sphere */}
      <div
        className="aurora-sphere"
        style={{
          position: 'absolute',
          top: topPosition,
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '700px',
          background: `radial-gradient(
            ellipse at center,
            rgba(34, 197, 94, ${opacity.primary}) 0%,
            rgba(34, 197, 94, ${opacity.secondary}) 30%,
            rgba(34, 197, 94, 0.03) 55%,
            transparent 70%
          )`,
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'aurora-pulse 10s ease-in-out infinite',
        }}
      />

      {/* Secondary glow for depth */}
      <div
        style={{
          position: 'absolute',
          top: position === 'top' ? '5%' : '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: `radial-gradient(
            ellipse at center,
            rgba(74, 222, 128, ${opacity.primary * 0.6}) 0%,
            transparent 60%
          )`,
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'aurora-float 12s ease-in-out infinite',
        }}
      />

      {/* Subtle accent glow */}
      <div
        style={{
          position: 'absolute',
          top: position === 'top' ? '20%' : '55%',
          left: '30%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(
            circle,
            rgba(34, 197, 94, ${opacity.secondary}) 0%,
            transparent 70%
          )`,
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'aurora-pulse 8s ease-in-out infinite reverse',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: position === 'top' ? '15%' : '50%',
          right: '25%',
          width: '250px',
          height: '250px',
          background: `radial-gradient(
            circle,
            rgba(74, 222, 128, ${opacity.secondary * 0.8}) 0%,
            transparent 70%
          )`,
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'aurora-float 15s ease-in-out infinite',
        }}
      />
    </div>
  );
}
