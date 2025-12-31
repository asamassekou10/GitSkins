/**
 * GitSkins - Landing Page
 * 
 * Simple landing page that displays information about the API
 */

export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      lineHeight: '1.6'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        GitSkins
      </h1>
      <p style={{ fontSize: '20px', marginBottom: '30px', color: '#666' }}>
        Generate dynamic, custom-themed GitHub profile cards
      </p>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Usage</h2>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <code style={{ fontSize: '18px', display: 'block', marginBottom: '10px' }}>
            GET /api/card?username=YOUR_USERNAME
          </code>
          <code style={{ fontSize: '18px', display: 'block' }}>
            GET /api/card?username=YOUR_USERNAME&theme=neon
          </code>
        </div>
        
        <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Available Themes</h3>
        <ul style={{ fontSize: '18px', marginLeft: '20px' }}>
          <li>satan (default)</li>
          <li>neon</li>
          <li>zen</li>
        </ul>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Example</h2>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px'
        }}>
          <img 
            src="/api/card?username=octocat" 
            alt="Example GitHub profile card"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      </div>
    </div>
  );
}
