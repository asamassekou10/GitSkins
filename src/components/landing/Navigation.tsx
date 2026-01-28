'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface NavLink {
  label: string;
  href: string;
  isHashLink?: boolean;
}

const navLinks: NavLink[] = [
  { label: 'Features', href: '#features', isHashLink: true },
  { label: 'Themes', href: '#themes', isHashLink: true },
  { label: 'Career Mode', href: '#ai', isHashLink: true },
  { label: 'AI Features', href: '/ai', isHashLink: false },
  { label: 'README Generator', href: '/readme-generator', isHashLink: false },
  { label: 'Pricing', href: '/pricing', isHashLink: false },
];

export function Navigation() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkStyle = {
    color: '#888',
    textDecoration: 'none' as const,
    fontSize: '15px',
    fontWeight: 500,
    transition: 'color 0.2s',
  };

  const user = session?.user as { name?: string; email?: string; image?: string; username?: string; avatar?: string } | undefined;
  const avatarUrl = user?.avatar || user?.image || `https://github.com/${user?.username || 'ghost'}.png`;
  const displayName = user?.name || user?.username || 'User';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '16px 24px',
        background: scrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(42, 42, 42, 0.5)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: '24px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}
        >
          GitSkins
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) =>
            link.isHashLink ? (
              <a
                key={link.label}
                href={link.href}
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#888';
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                style={linkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#888';
                }}
              >
                {link.label}
              </Link>
            )
          )}

          {/* Auth Section */}
          {status === 'loading' ? (
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a1a' }} />
          ) : session ? (
            /* User Menu */
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 12px 6px 6px',
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a3a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                }}
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border: '2px solid #22c55e',
                  }}
                />
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                  {displayName}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: '#161616',
                    border: '1px solid #2a2a2a',
                    borderRadius: '12px',
                    padding: '8px',
                    minWidth: '180px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid #2a2a2a', marginBottom: '8px' }}>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{displayName}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>@{user?.username}</div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      color: '#888',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#888';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link
                    href={`/showcase/${user?.username}`}
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      color: '#888',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#888';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Showcase
                  </Link>
                  <Link
                    href="/readme-generator"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      color: '#888',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1a1a1a';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#888';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    README Generator
                  </Link>
                  <div style={{ height: '1px', background: '#2a2a2a', margin: '8px 0' }} />
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      color: '#ef4444',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#1a1a1a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Sign In Button */
            <Link
              href="/auth"
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                borderRadius: '24px',
                color: '#888',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3a3a3a';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.color = '#888';
              }}
            >
              Sign In
            </Link>
          )}

          {/* CTA Button */}
          <Link
            href="/readme-generator"
            style={{
              padding: '10px 24px',
              background: '#22c55e',
              borderRadius: '24px',
              color: '#000',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4ade80';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#22c55e';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '8px',
          }}
          className="mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid #2a2a2a',
            padding: '20px 24px',
          }}
        >
          {/* User Info (Mobile) */}
          {session && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                marginBottom: '12px',
                borderBottom: '1px solid #1a1a1a',
              }}
            >
              <img
                src={avatarUrl}
                alt={displayName}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  border: '2px solid #22c55e',
                }}
              />
              <div>
                <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{displayName}</div>
                <div style={{ color: '#666', fontSize: '13px' }}>@{user?.username}</div>
              </div>
            </div>
          )}

          {navLinks.map((link) =>
            link.isHashLink ? (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  color: '#888',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  padding: '12px 0',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  color: '#888',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  padding: '12px 0',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                {link.label}
              </Link>
            )
          )}

          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  color: '#888',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  padding: '12px 0',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                Dashboard
              </Link>
              <Link
                href={`/showcase/${user?.username}`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  color: '#888',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 500,
                  padding: '12px 0',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                My Showcase
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  marginTop: '16px',
                  padding: '14px 24px',
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  borderRadius: '12px',
                  color: '#ef4444',
                  fontSize: '15px',
                  fontWeight: 500,
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                marginTop: '16px',
                padding: '14px 24px',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                color: '#888',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Sign In
            </Link>
          )}

          <Link
            href="/readme-generator"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'block',
              marginTop: '12px',
              padding: '14px 24px',
              background: '#22c55e',
              borderRadius: '12px',
              color: '#000',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
            }}
          >
            Get Started
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
