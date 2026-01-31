'use client';

import { useState, useRef, useEffect } from 'react';
import { analytics } from '@/components/AnalyticsProvider';

interface ShareMenuProps {
  /** The URL to share (e.g. showcase page or widget image URL) */
  shareUrl: string;
  /** Text to include in the share post */
  shareText: string;
  /** Direct image URL for download */
  imageUrl?: string;
  /** Filename for downloaded image */
  downloadFilename?: string;
  /** Analytics context */
  context?: { username?: string; theme?: string; widget?: string; source?: string };
}

export function ShareMenu({
  shareUrl,
  shareText,
  imageUrl,
  downloadFilename = 'gitskins-card.png',
  context = {},
}: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const track = (platform: string) => {
    analytics.track('social_share', { platform, ...context });
  };

  const shareToTwitter = () => {
    track('twitter');
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400');
    setOpen(false);
  };

  const shareToLinkedIn = () => {
    track('linkedin');
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
    setOpen(false);
  };

  const copyLink = async () => {
    track('copy_link');
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setOpen(false), 500);
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    track('download');
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open image in new tab
      window.open(imageUrl, '_blank');
    }
    setOpen(false);
  };

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#e5e5e5',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s ease',
  };

  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Share"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          fontSize: '13px',
          fontWeight: 600,
          background: '#161616',
          border: '1px solid #1f1f1f',
          borderRadius: '8px',
          color: '#fafafa',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#22c55e';
          e.currentTarget.style.color = '#22c55e';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#1f1f1f';
          e.currentTarget.style.color = '#fafafa';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
        Share
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: '200px',
            background: '#111111',
            border: '1px solid #2a2a2a',
            borderRadius: '12px',
            padding: '6px',
            zIndex: 50,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Twitter / X */}
          <button
            type="button"
            onClick={shareToTwitter}
            style={btnBase}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Post on X
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={shareToLinkedIn}
            style={btnBase}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share on LinkedIn
          </button>

          {/* Divider */}
          <div style={{ height: '1px', background: '#1f1f1f', margin: '4px 0' }} />

          {/* Download */}
          {imageUrl && (
            <button
              type="button"
              onClick={downloadImage}
              style={btnBase}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Image
            </button>
          )}

          {/* Copy Link */}
          <button
            type="button"
            onClick={copyLink}
            style={btnBase}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {copied ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </>
              )}
            </svg>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      )}
    </div>
  );
}
