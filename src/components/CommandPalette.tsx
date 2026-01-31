'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { landingThemes } from '@/lib/landing-themes';

const NAV_ITEMS: { label: string; href: string; keywords: string }[] = [
  { label: 'Features', href: '/#features', keywords: 'features' },
  { label: 'Themes', href: '/#themes', keywords: 'themes' },
  { label: 'AI Features', href: '/ai', keywords: 'ai' },
  { label: 'README Generator', href: '/readme-generator', keywords: 'readme' },
  { label: 'Portfolio Builder', href: '/portfolio/octocat', keywords: 'portfolio' },
];

type ItemType = { type: 'nav'; label: string; href: string } | { type: 'theme'; id: string; name: string; href: string };

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const navItems: ItemType[] = NAV_ITEMS.map(({ label, href }) => ({ type: 'nav', label, href }));
  const themeItems: ItemType[] = landingThemes.map((t) => ({ type: 'theme', id: t.id, name: t.name, href: '/#themes' }));

  const allItems: ItemType[] = [...navItems, ...themeItems];

  const filtered = allItems.filter((item) => {
    const text = item.type === 'nav' ? item.label : item.name;
    return text.toLowerCase().includes(query.toLowerCase().trim());
  });

  const selectItem = useCallback(
    (item: ItemType) => {
      onClose();
      setQuery('');
      setSelectedIndex(0);
      if (item.href.startsWith('/#')) {
        window.location.href = item.href;
      } else {
        router.push(item.href);
      }
    },
    [onClose, router]
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % Math.max(1, filtered.length));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % Math.max(1, filtered.length));
        return;
      }
      if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        selectItem(filtered[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, filtered, selectedIndex, onClose, selectItem]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const child = el.children[selectedIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, filtered.length]);

  if (!open) return null;

  return (
    <>
      <div
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1998,
          animation: 'commandPaletteFadeIn 0.15s ease-out',
        }}
        onClick={onClose}
        onKeyDown={() => {}}
      />
      <div
        role="dialog"
        aria-label="Search themes and pages"
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '560px',
          background: '#111',
          border: '1px solid #1f1f1f',
          borderRadius: '12px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
          zIndex: 1999,
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease-out',
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div style={{ padding: '12px', borderBottom: '1px solid #1f1f1f', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#666', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search themes and pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fafafa',
              fontSize: '15px',
              outline: 'none',
            }}
            aria-label="Search"
          />
          <kbd style={{ fontSize: '11px', color: '#666', padding: '2px 6px', background: '#1a1a1a', borderRadius: '4px' }}>
            ESC
          </kbd>
        </div>
        <div
          ref={listRef}
          style={{ maxHeight: '320px', overflow: 'auto', padding: '8px' }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
              No results for &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((item, i) => {
              const label = item.type === 'nav' ? item.label : item.name;
              const isSelected = i === selectedIndex;
              return (
                <button
                  key={item.type === 'nav' ? item.href : item.id}
                  type="button"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    border: 'none',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                    color: '#fafafa',
                    fontSize: '14px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setSelectedIndex(i)}
                  onClick={() => selectItem(item)}
                >
                  {item.type === 'theme' && (
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 4,
                        background: item.type === 'theme' ? (landingThemes.find((t) => t.id === item.id)?.color ?? '#666') : '#666',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {item.type === 'nav' && (
                    <span style={{ width: 12, height: 12, flexShrink: 0 }} />
                  )}
                  {label}
                </button>
              );
            })
          )}
        </div>
        <div style={{ padding: '8px 12px', borderTop: '1px solid #1f1f1f', fontSize: '12px', color: '#404040' }}>
          <kbd style={{ padding: '2px 4px', background: '#1a1a1a', borderRadius: '2px' }}>↑↓</kbd> navigate
          {' · '}
          <kbd style={{ padding: '2px 4px', background: '#1a1a1a', borderRadius: '2px' }}>Enter</kbd> select
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes commandPaletteFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes commandPaletteScaleIn { from { opacity: 0; transform: translateX(-50%) scale(0.96); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
      ` }} />
    </>
  );
}
