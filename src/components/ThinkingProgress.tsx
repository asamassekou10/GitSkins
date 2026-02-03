'use client';

export interface ThinkingProgressStep {
  id: string;
  label: string;
}

interface ThinkingProgressProps {
  /** Ordered list of step labels. */
  steps: ThinkingProgressStep[] | string[];
  /** Current step index (0-based). When >= steps.length, all steps are done. */
  activeIndex: number;
  /** 'card' = green-tinted block; 'inline' = compact line. */
  variant?: 'card' | 'inline';
  /** Optional sub-label for the active step. */
  subLabel?: string;
}

const normalizeSteps = (steps: ThinkingProgressStep[] | string[]): ThinkingProgressStep[] =>
  steps.map((s, i) =>
    typeof s === 'string' ? { id: `step-${i}`, label: s } : s
  );

export function ThinkingProgress({
  steps,
  activeIndex,
  variant = 'card',
  subLabel,
}: ThinkingProgressProps) {
  const list = normalizeSteps(steps);
  const allDone = activeIndex >= list.length;
  const currentLabel = allDone
    ? list[list.length - 1]?.label
    : list[activeIndex]?.label;

  const spinner = (
    <span
      style={{
        width: '18px',
        height: '18px',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'thinkingProgressSpin 1s linear infinite',
        flexShrink: 0,
      }}
    />
  );

  const checkmark = (
    <span style={{ flexShrink: 0, color: '#22c55e' }} aria-hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );

  if (variant === 'inline') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          color: '#22c55e',
        }}
      >
        {allDone ? checkmark : spinner}
        <span>
          {allDone ? 'Done' : currentLabel}
          {subLabel && !allDone && (
            <span style={{ color: '#666', marginLeft: '6px' }}>{subLabel}</span>
          )}
        </span>
        <style>{`@keyframes thinkingProgressSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '12px 16px',
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '10px',
        fontSize: '14px',
        color: '#22c55e',
      }}
    >
      {list.length === 1 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {allDone ? checkmark : spinner}
          <span style={{ fontWeight: 500 }}>
            {allDone ? 'Done' : currentLabel}
            {subLabel && !allDone && (
              <span style={{ color: '#666', fontWeight: 400, marginLeft: '6px' }}>{subLabel}</span>
            )}
          </span>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            {allDone ? checkmark : spinner}
            <span style={{ fontWeight: 600, color: '#fafafa' }}>
              {allDone ? 'Done' : `Step ${Math.min(activeIndex + 1, list.length)} of ${list.length}: ${currentLabel}`}
            </span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
            {list.map((step, i) => {
              const done = i < activeIndex;
              const active = i === activeIndex && !allDone;
              const pending = i > activeIndex;
              return (
                <li
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: i === 0 ? 0 : '6px',
                    color: done ? '#22c55e' : active ? '#fafafa' : '#888',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {done && checkmark}
                  {active && spinner}
                  {pending && (
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#555',
                        border: '1px solid #444',
                        borderRadius: '50%',
                        fontSize: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                  <span style={{ opacity: pending ? 0.85 : 1 }}>{step.label}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <style>{`@keyframes thinkingProgressSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
