'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
  isHashLink?: boolean;
}

const navLinks: NavLink[] = [
  { label: 'Features', href: '#features', isHashLink: true },
  { label: 'Themes', href: '#themes', isHashLink: true },
  { label: 'README Generator', href: '/readme-generator', isHashLink: false },
  { label: 'Pricing', href: '/pricing', isHashLink: false },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkStyle = {
    color: '#888',
    textDecoration: 'none' as const,
    fontSize: '15px',
    fontWeight: 500,
    transition: 'color 0.2s',
  };

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

          {/* Sign In Button */}
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
