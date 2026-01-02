'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';
import type { PremiumThemeName } from '@/types/premium-theme';

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
  const username = params.username as string;
  const initialTheme = (searchParams.get('theme') || 'satan') as PremiumThemeName;

  const [selectedTheme, setSelectedTheme] = useState<PremiumThemeName>(initialTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const copyMarkdown = async () => {
    const markdown = `![GitSkins Card](https://gitskins.com/api/premium-card?username=${username}&theme=${selectedTheme})`;
    await navigator.clipboard.writeText(markdown);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const shareUrl = `https://gitskins.com/showcase/${username}?theme=${selectedTheme}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
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
            className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
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
              onClick={() => setSelectedTheme(theme)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedTheme === theme
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
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
                className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000"
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
                      className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                    />
                  </div>
                ) : (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    src={`https://gitskins.com/api/premium-card?username=${username}&theme=${selectedTheme}&v=1`}
                    alt={`${username}'s GitSkins card`}
                    className="w-full h-auto rounded-xl"
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
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all flex items-center gap-2"
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
            }}
            className="px-8 py-4 bg-gray-800/80 border border-gray-700 rounded-xl font-semibold hover:bg-gray-700/80 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Link
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
            <code className="text-purple-400 text-sm break-all block">
              ![GitSkins Card](https://gitskins.com/api/premium-card?username={username}&theme={selectedTheme})
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
          <p>Made with 🔥 by <a href="https://gitskins.com" className="text-purple-400 hover:text-purple-300 transition-colors">GitSkins</a></p>
        </motion.div>
      </div>
    </div>
  );
}
