'use client';

interface Testimonial {
  name: string;
  username: string;
  role: string;
  content: string;
  avatar?: string;
}

interface SocialProofProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    name: 'Alex Developer',
    username: 'alexdev',
    role: 'Full Stack Developer',
    content: 'GitSkins made my GitHub profile stand out. The themes are beautiful and the setup was super easy!',
  },
  {
    name: 'Sarah Coder',
    username: 'sarahcode',
    role: 'Open Source Maintainer',
    content: 'Love the variety of themes. My profile looks professional and gets way more attention now.',
  },
  {
    name: 'Mike Builder',
    username: 'mikebuild',
    role: 'DevOps Engineer',
    content: 'Free, fast, and beautiful. This is exactly what I needed for my README. Highly recommend!',
  },
];

export function SocialProof({ testimonials = defaultTestimonials }: SocialProofProps) {
  return (
    <section
      style={{
        padding: '80px 20px',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 100%)',
        position: 'relative',
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
            background: 'linear-gradient(135deg, #ffffff 0%, #888888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Trusted by Developers
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
          Join thousands of developers who are making their GitHub profiles shine
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginTop: '48px',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{
                background: '#161616',
                border: '1px solid #2a2a2a',
                borderRadius: '16px',
                padding: '32px',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#ff4500';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#2a2a2a';
              }}
            >
              <p
                style={{
                  color: '#cccccc',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                  fontStyle: 'italic',
                }}
              >
                "{testimonial.content}"
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff4500 0%, #ff6b35 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '18px',
                    }}
                  >
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div
                    style={{
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '16px',
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    style={{
                      color: '#888888',
                      fontSize: '14px',
                    }}
                  >
                    @{testimonial.username} • {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
