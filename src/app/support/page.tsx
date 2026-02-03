'use client';

import Link from 'next/link';

const faqs = [
  {
    question: 'How do I add a widget to my GitHub profile?',
    answer: 'Copy the markdown code from the widget generator and paste it into your GitHub profile README.md file. The widget will automatically update with your latest GitHub stats.',
  },
  {
    question: 'Are the widgets free to use?',
    answer: 'Yes! GitSkins is completely free. All features and themes are available at no cost.',
  },
  {
    question: 'How often do the widgets update?',
    answer: 'Widgets are cached for 24 hours to ensure fast loading. Your stats will update automatically within 24 hours of any changes to your GitHub activity.',
  },
  {
    question: 'Can I customize the themes?',
    answer: 'Currently, we offer 5 pre-built themes: Satan, Neon, Zen, GitHub Dark, and Dracula. Custom theme creation is coming soon!',
  },
  {
    question: 'What widgets are available?',
    answer: 'We offer Profile Cards (with contribution graph), Stats, Languages, Streak, Repos, and Animated Cards. Each widget can be customized with different themes.',
  },
  {
    question: 'Do I need a GitHub account?',
    answer: 'No account needed! Just enter any GitHub username to generate widgets. However, to use widgets in your own profile, you\'ll need a GitHub account.',
  },
  {
    question: 'Why is my widget not showing?',
    answer: 'Make sure you\'ve saved your README.md file and that the markdown syntax is correct. Also check that the username in the URL matches your GitHub username.',
  },
  {
    question: 'Can I use multiple widgets?',
    answer: 'Absolutely! You can add as many widgets as you want to your README. Mix and match different widget types and themes to create your perfect profile.',
  },
];

export default function SupportPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '100px 20px 60px',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '60px',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(40px, 8vw, 64px)',
              fontWeight: 800,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Help & Support
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#888888',
            }}
          >
            Find answers to common questions and get help
          </p>
        </div>

        {/* FAQ Section */}
        <div
          style={{
            marginBottom: '60px',
          }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '32px',
            }}
          >
            Frequently Asked Questions
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {faqs.map((faq, index) => (
              <details
                key={index}
                style={{
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  padding: '24px',
                  cursor: 'pointer',
                }}
              >
                <summary
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '12px',
                    listStyle: 'none',
                  }}
                >
                  {faq.question}
                </summary>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#888888',
                    lineHeight: 1.6,
                    marginTop: '12px',
                  }}
                >
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)',
            border: '1px solid rgba(255, 69, 0, 0.2)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            Still Need Help?
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#888888',
              marginBottom: '32px',
            }}
          >
            Check out our resources or get in touch
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="https://github.com/gitskins/gitskins"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 24px',
                background: '#161616',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 600,
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ff4500';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
              }}
            >
              GitHub Repository
            </a>
            <Link
              href="/getting-started"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 600,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Getting Started Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
