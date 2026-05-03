'use client';

import Link from 'next/link';

const faqs = [
  {
    question: 'How do I add a card to my GitHub profile?',
    answer: 'Open Card Studio, choose a card and theme, copy the Markdown, then paste it into the README.md file for your GitHub profile repository.',
  },
  {
    question: 'What is free and what requires Pro?',
    answer: 'Free users get the core card tools, the original free themes, and limited README generations. Pro unlocks all premium themes, premium avatars, AI profile tools, high-resolution exports, and unlimited README generations.',
  },
  {
    question: 'Why are some themes or avatar styles locked?',
    answer: 'Premium themes, character avatars, real character styles, project personas, and high-resolution downloads are Pro features. Locked controls should send you to Pricing with the correct upgrade options.',
  },
  {
    question: 'Why is my widget not showing on GitHub?',
    answer: 'Check that the username in the URL is correct, that the Markdown image syntax is complete, and that GitHub can access the image URL publicly. If GitHub cached a broken image, wait a few minutes and refresh.',
  },
  {
    question: 'How do billing and cancellations work?',
    answer: 'Payments are handled by Stripe. Pro subscribers can manage or cancel from Dashboard → Manage subscription. Lifetime Pro is a one-time purchase.',
  },
  {
    question: 'How do I get help with the GitSkins browser extension?',
    answer: 'Email gitskinspro@gmail.com with your browser, extension version, GitHub profile URL, and a short description of the issue. The extension only works on GitHub profile pages, not repository pages.',
  },
  {
    question: 'Does the extension change my GitHub profile for everyone?',
    answer: 'No. The extension adds GitSkins tools to your own browser while you use GitHub. To publish something other people can see, copy the generated README markdown or share your hosted GitSkins profile skin link.',
  },
  {
    question: 'How do I get support?',
    answer: 'Email gitskinspro@gmail.com for account or billing help. For bugs and feature requests, GitHub issues are the best place.',
  },
];

const contactCards = [
  {
    title: 'Account & billing',
    copy: 'Payment, subscription, login, and Pro access questions.',
    href: 'mailto:gitskinspro@gmail.com',
    label: 'Email support',
  },
  {
    title: 'Bugs & feature requests',
    copy: 'Report rendering issues, broken cards, or ideas for new themes.',
    href: 'https://github.com/asamassekou10/GitSkins/issues',
    label: 'Open GitHub issues',
  },
  {
    title: 'Browser extension',
    copy: 'Chrome or Edge extension install, popup, action bar, and copy-button issues.',
    href: 'mailto:gitskinspro@gmail.com?subject=GitSkins%20browser%20extension%20support',
    label: 'Email extension support',
  },
  {
    title: 'Get oriented',
    copy: 'Learn how to create cards, avatars, and README assets.',
    href: '/getting-started',
    label: 'Read the guide',
  },
];

export default function SupportPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <section style={{ maxWidth: 980, margin: '0 auto', padding: '120px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 20 }}>
            Support
          </div>
          <h1 style={{ margin: '0 auto 16px', maxWidth: 720, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.055em', fontWeight: 900 }}>
            Get unstuck fast.
          </h1>
          <p style={{ color: '#9b9b9b', fontSize: 18, lineHeight: 1.65, margin: '0 auto', maxWidth: 620 }}>
            Answers for cards, avatars, billing, Pro access, and GitHub README embeds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 16, marginBottom: 58 }}>
          {contactCards.map((card) => {
            const external = card.href.startsWith('http') || card.href.startsWith('mailto:');
            const styles = { minHeight: 190, padding: 22, borderRadius: 22, border: '1px solid #1d1d1d', background: '#0b0b0b', color: '#fafafa', textDecoration: 'none', display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between' };
            const content = (
              <>
                <div>
                  <h2 style={{ margin: '0 0 8px', fontSize: 21, letterSpacing: '-0.02em' }}>{card.title}</h2>
                  <p style={{ margin: 0, color: '#777', fontSize: 14, lineHeight: 1.55 }}>{card.copy}</p>
                </div>
                <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 850 }}>{card.label} →</span>
              </>
            );
            return external ? (
              <a key={card.title} href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined} rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined} style={styles}>
                {content}
              </a>
            ) : (
              <Link key={card.title} href={card.href} style={styles}>
                {content}
              </Link>
            );
          })}
        </div>

        <section>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1, letterSpacing: '-0.045em', margin: '0 0 24px' }}>
            Common questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {faqs.map((faq) => (
              <details key={faq.question} style={{ background: '#0b0b0b', border: '1px solid #1d1d1d', borderRadius: 16, padding: 22 }}>
                <summary style={{ fontSize: 16, fontWeight: 850, color: '#fff', cursor: 'pointer' }}>
                  {faq.question}
                </summary>
                <p style={{ fontSize: 15, color: '#888', lineHeight: 1.65, margin: '14px 0 0' }}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
