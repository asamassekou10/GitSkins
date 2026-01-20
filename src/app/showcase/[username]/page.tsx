'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';
import type { PremiumThemeName } from '@/types/premium-theme';
import { analytics } from '@/components/AnalyticsProvider';

const themes: PremiumThemeName[] = ['satan', 'neon', 'zen', 'github-dark', 'dracula'];

const themeLabels: Record<PremiumThemeName, string> = {
  'satan': '🔥 Satan',
  'neon': '⚡ Neon',
  'zen': '🍃 Zen',
  'github-dark': '💼 GitHub Dark',
  'dracula': '🦇 Dracula',
};

export default function ShowcasePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  // Remove @ symbol if present (e.g., @octocat -> octocat)
  const rawUsername = params.username as string;
  const username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;
  const initialTheme = (searchParams.get('theme') || 'satan') as PremiumThemeName;

  const [selectedTheme, setSelectedTheme] = useState<PremiumThemeName>(initialTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const productionUrl = 'https://gitskins.com';

  const copyMarkdown = async () => {
    // Always use production URL for markdown
    const markdown = `![GitSkins Card](${productionUrl}/api/premium-card?username=${username}&theme=${selectedTheme})`;
    await navigator.clipboard.writeText(markdown);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    
    // Track markdown copy event
    analytics.trackMarkdownCopy('premium-card', selectedTheme, username, 'showcase');
  };

  const shareUrl = `${baseUrl}/showcase/${username}?theme=${selectedTheme}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            GitSkins Showcase
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-400"
          >
            @{username} • Interactive Profile Experience
          </motion.p>
        </motion.div>

        {/* Theme Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {themes.map((theme, index) => (
            <motion.button
              key={theme}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedTheme(theme);
                analytics.trackThemeSelection(theme, 'showcase', username);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedTheme === theme
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              {themeLabels[theme]}
            </motion.button>
          ))}
        </motion.div>

        {/* Card Display */}
        <motion.div
          layout
          className="max-w-4xl mx-auto mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTheme}
              initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="relative group"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Card */}
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800">
                {isLoading ? (
                  <div className="aspect-[800/600] flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full"
                    />
                  </div>
                ) : (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    src={`/api/premium-card?username=${username}&theme=${selectedTheme}`}
                    alt={`${username}'s GitSkins card`}
                    className="w-full h-auto rounded-xl"
                    loading="eager"
                    fetchPriority="high"
                    onError={(e) => {
                      const target = e.currentTarget;
                      console.error('Image failed to load for:', username, selectedTheme);
                      target.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect fill='%23111' width='800' height='400'/><text x='50%' y='50%' text-anchor='middle' fill='%23888' font-size='18' font-family='system-ui'>Card generation failed</text><text x='50%' y='55%' text-anchor='middle' fill='%23666' font-size='14' font-family='system-ui'>Try: ${username}</text></svg>`;
                    }}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyMarkdown}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-semibold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/70 transition-all flex items-center gap-2"
          >
            {showCopied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Markdown
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              analytics.track('share_link_copied', { username, theme: selectedTheme });
            }}
            className="px-8 py-4 bg-gray-800/80 border border-gray-700 rounded-xl font-semibold hover:bg-gray-700/80 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Link
          </motion.button>

          {/* Social Share Buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const twitterUrl = `https://twitter.com/intent/tweet?text=Check out my GitHub profile!&url=${encodeURIComponent(shareUrl)}`;
              window.open(twitterUrl, '_blank');
              analytics.track('share_twitter', { username, theme: selectedTheme });
            }}
            className="px-6 py-4 bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 rounded-xl font-semibold hover:bg-[#1DA1F2]/30 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
              window.open(linkedInUrl, '_blank');
              analytics.track('share_linkedin', { username, theme: selectedTheme });
            }}
            className="px-6 py-4 bg-[#0077B5]/20 border border-[#0077B5]/30 rounded-xl font-semibold hover:bg-[#0077B5]/30 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </motion.button>

          <motion.a
            href="https://gitskins.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gray-800/80 border border-gray-700 rounded-xl font-semibold hover:bg-gray-700/80 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Create Your Own
          </motion.a>
        </motion.div>

        {/* Code Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-4 text-center">Use in Your README</h3>
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Markdown</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={copyMarkdown}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </motion.button>
            </div>
            <code className="text-amber-400 text-sm break-all block">
              ![GitSkins Card]({productionUrl}/api/premium-card?username={username}&theme={selectedTheme})
            </code>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-16 text-gray-500"
        >
          <p>Made with 🔥 by <a href="https://gitskins.com" className="text-amber-400 hover:text-amber-300 transition-colors">GitSkins</a></p>
        </motion.div>
      </div>
    </div>
  );
}
