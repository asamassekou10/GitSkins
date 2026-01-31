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
  { label: 'Features', href: '/#features', isHashLink: true },
  { label: 'Themes', href: '/#themes', isHashLink: true },
  { label: 'AI Features', href: '/ai', isHashLink: false },
  { label: 'README Generator', href: '/readme-generator', isHashLink: false },
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        padding: scrolled ? '12px 24px' : '16px 24px',
        background: scrolled ? 'rgba(5, 5, 5, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '20px',
            fontWeight: 700,
            color: '#fafafa',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="4" fill="#22c55e" />
            <path d="M7 12h10M12 7v10" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          GitSkins
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) =>
            link.isHashLink ? (
              <a
                key={link.label}
                href={link.href}
                style={{
                  color: '#a1a1a1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '8px 14px',
                  borderRadius: '8px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fafafa';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#a1a1a1';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  color: '#a1a1a1',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  padding: '8px 14px',
                  borderRadius: '8px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fafafa';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#a1a1a1';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {link.label}
              </Link>
            )
          )}

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#111',
              border: '1px solid #1f1f1f',
              borderRadius: '8px',
              color: '#a1a1a1',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fafafa';
              e.currentTarget.style.borderColor = '#2a2a2a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a1a1a1';
              e.currentTarget.style.borderColor = '#1f1f1f';
            }}
            aria-label="Search themes and pages"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Search
            <kbd style={{ fontSize: '10px', padding: '2px 4px', background: '#1a1a1a', borderRadius: '4px' }}>⌘K</kbd>
          </button>

          <div style={{ width: '1px', height: '20px', background: '#1f1f1f', margin: '0 8px' }} />

          {/* Auth Section */}
          {status === 'loading' ? (
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#111' }} />
          ) : session ? (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px 6px 6px',
                  background: '#111',
                  border: '1px solid #1f1f1f',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#2a2a2a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1f1f1f';
                }}
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '6px',
                  }}
                />
                <span style={{ color: '#fafafa', fontSize: '13px', fontWeight: 500 }}>
                  {displayName}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                    background: '#111',
                    border: '1px solid #1f1f1f',
                    borderRadius: '12px',
                    padding: '6px',
                    minWidth: '200px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    animation: 'scaleIn 0.15s ease-out',
                  }}
                >
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid #1f1f1f', marginBottom: '6px' }}>
                    <div style={{ color: '#fafafa', fontSize: '14px', fontWeight: 600 }}>{displayName}</div>
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
                      color: '#a1a1a1',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#161616';
                      e.currentTarget.style.color = '#fafafa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#a1a1a1';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
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
                      color: '#a1a1a1',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#161616';
                      e.currentTarget.style.color = '#fafafa';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#a1a1a1';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                    My Showcase
                  </Link>
                  
                  <div style={{ height: '1px', background: '#1f1f1f', margin: '6px 0' }} />
                  
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
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
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
            <Link
              href="/auth"
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #1f1f1f',
                borderRadius: '8px',
                color: '#a1a1a1',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.color = '#fafafa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1f1f1f';
                e.currentTarget.style.color = '#a1a1a1';
              }}
            >
              Sign In
            </Link>
          )}

          {/* Primary CTA */}
          <Link
            href="/readme-generator"
            style={{
              padding: '8px 18px',
              background: '#22c55e',
              borderRadius: '8px',
              color: '#050505',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4ade80';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#22c55e';
              e.currentTarget.style.transform = 'translateY(0)';
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
            color: '#fafafa',
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
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
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
            background: 'rgba(5, 5, 5, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid #1f1f1f',
            padding: '16px 24px 24px',
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          {session && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                marginBottom: '12px',
                borderBottom: '1px solid #1f1f1f',
              }}
            >
              <img
                src={avatarUrl}
                alt={displayName}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                }}
              />
              <div>
                <div style={{ color: '#fafafa', fontSize: '15px', fontWeight: 600 }}>{displayName}</div>
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
                  color: '#a1a1a1',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '14px 0',
                  borderBottom: '1px solid #1f1f1f',
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
                  color: '#a1a1a1',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '14px 0',
                  borderBottom: '1px solid #1f1f1f',
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
                  color: '#a1a1a1',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 500,
                  padding: '14px 0',
                  borderBottom: '1px solid #1f1f1f',
                }}
              >
                Dashboard
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
                  padding: '14px',
                  background: 'transparent',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
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
                padding: '14px',
                background: 'transparent',
                border: '1px solid #1f1f1f',
                borderRadius: '10px',
                color: '#a1a1a1',
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
              padding: '14px',
              background: '#22c55e',
              borderRadius: '10px',
              color: '#050505',
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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 900px) {
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
