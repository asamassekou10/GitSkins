'use client';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const benefits: Benefit[] = [
  {
    icon: '🎨',
    title: 'Beautiful Themes',
    description: 'Choose from multiple stunning themes that match your style',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized for speed with edge computing and smart caching',
  },
  {
    icon: '🆓',
    title: '100% Free',
    description: 'No credit card required. All features available for free',
  },
  {
    icon: '🔧',
    title: 'Easy Setup',
    description: 'Copy and paste one line of markdown. No configuration needed',
  },
  {
    icon: '📊',
    title: 'Real-time Data',
    description: 'Your stats update automatically from your GitHub activity',
  },
  {
    icon: '🚀',
    title: 'Always Available',
    description: 'Reliable hosting with global CDN for fast delivery worldwide',
  },
];

export function BenefitsSection() {
  return (
    <section
      style={{
        padding: '80px 20px',
        background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Why Choose GitSkins?
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: '#888888',
            fontSize: '18px',
            marginBottom: '48px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Everything you need to make your GitHub profile stand out
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginTop: '48px',
          }}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              style={{
                background: '#161616',
                border: '1px solid #2a2a2a',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'center',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#2a2a2a';
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                }}
              >
                {benefit.icon}
              </div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              >
                {benefit.title}
              </h3>
              <p
                style={{
                  color: '#888888',
                  fontSize: '16px',
                  lineHeight: 1.6,
                }}
              >
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
