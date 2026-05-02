import { ImageResponse } from 'next/og';

export const alt = 'GitSkins - Premium GitHub profile cards, avatars, and README tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#050505',
          color: '#fafafa',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'radial-gradient(circle at 78% 20%, rgba(34,197,94,0.34), transparent 38%), radial-gradient(circle at 15% 84%, rgba(88,166,255,0.22), transparent 34%)' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', width: '100%', padding: 72, gap: 42, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 560 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 34 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: '#22c55e', color: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900 }}>
                G
              </div>
              <div style={{ display: 'flex', fontSize: 30, fontWeight: 850 }}>GitSkins</div>
            </div>
            <div style={{ display: 'flex', fontSize: 74, lineHeight: 0.94, letterSpacing: -4, fontWeight: 900 }}>
              Make your GitHub feel like a product.
            </div>
            <div style={{ display: 'flex', color: '#a1a1a1', fontSize: 26, lineHeight: 1.35, marginTop: 28 }}>
              Premium profile cards, avatars, themes, README assets, and AI profile tools.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 28, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(12,12,12,0.9)', padding: 30, boxShadow: '0 30px 90px rgba(0,0,0,0.42)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 94, height: 94, borderRadius: 24, background: 'linear-gradient(135deg, #22c55e, #58a6ff)', display: 'flex' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', fontSize: 35, fontWeight: 900 }}>octocat</div>
                  <div style={{ display: 'flex', fontSize: 20, color: '#22c55e', marginTop: 4 }}>@octocat · Product Builder</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 28 }}>
                {['Stars', 'Repos', 'Active'].map((label, index) => (
                  <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 18, borderRadius: 18, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', color: '#777', fontSize: 14, fontWeight: 800, letterSpacing: 1 }}>{label}</div>
                    <div style={{ display: 'flex', color: '#fff', fontSize: 34, fontWeight: 900, marginTop: 4 }}>{[128, 42, 365][index]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 18 }}>
              {['#22c55e', '#bd93f9', '#58a6ff'].map((color) => (
                <div key={color} style={{ width: 112, height: 112, borderRadius: 28, background: color, boxShadow: `0 0 38px ${color}66` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
