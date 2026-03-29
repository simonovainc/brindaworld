/**
 * About.jsx — BrindaWorld About Page
 */
import { Link } from 'react-router-dom';

function About() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 720, width: '100%', background: '#fff', borderRadius: 20, padding: '3rem 2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.09)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <span style={{ fontSize: '2.5rem' }}>👑</span>
          <h1 style={{ color: '#2D1B69', fontSize: '2rem', fontWeight: 900, lineHeight: 1.1 }}>About BrindaWorld</h1>
        </div>

        <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
          BrindaWorld is a New Brunswick, Canada edtech platform dedicated to empowering girls aged 6–14
          through engaging games and activities in chess, coding, geography, wellness, creativity, and leadership.
          We believe every girl deserves to see herself as a future judge, astronaut, engineer, or prime minister —
          and we build the tools to make that vision feel real, fun, and achievable.
        </p>

        <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
          Founded by Simonova Inc., BrindaWorld is fully COPPA and PIPEDA compliant, curriculum-aligned with
          Ontario and New Brunswick standards, and free forever for families. Our mission is simple:
          where girls learn to lead.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/register">
            <button style={{
              background: '#FF1493', color: '#fff', border: 'none',
              borderRadius: 50, padding: '0.8rem 2rem', fontSize: '1rem',
              fontWeight: 700, cursor: 'pointer',
            }}>
              Start Free Today
            </button>
          </Link>
          <Link to="/">
            <button style={{
              background: 'transparent', color: '#2D1B69',
              border: '2px solid #2D1B69', borderRadius: 50,
              padding: '0.8rem 2rem', fontSize: '1rem',
              fontWeight: 700, cursor: 'pointer',
            }}>
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
