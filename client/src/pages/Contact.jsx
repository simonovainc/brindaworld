/**
 * Contact.jsx — BrindaWorld Contact Page
 * Simple static contact form — sends via mailto for now.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Contact() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    // Open mail client as fallback — backend endpoint can be wired later
    const subject = encodeURIComponent(`BrindaWorld Contact from ${name.trim()}`);
    const body    = encodeURIComponent(`Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`);
    window.location.href = `mailto:hello@brindaworld.ca?subject=${subject}&body=${body}`;
    setSent(true);
    setError('');
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1.1rem',
    borderRadius: 10, border: '1.5px solid #ddd',
    fontSize: '1rem', outline: 'none',
    fontFamily: 'inherit', marginBottom: '1rem',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: 560, width: '100%', background: '#fff', borderRadius: 20, padding: '3rem 2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.09)' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>✉️</span>
          <h1 style={{ color: '#2D1B69', fontSize: '1.8rem', fontWeight: 900 }}>Contact Us</h1>
        </div>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '2rem' }}>
          We'd love to hear from you — parents, teachers, and partners welcome.
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💌</div>
            <p style={{ color: '#2D1B69', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Your message is ready to send!</p>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Your email app should have opened. If not, email us directly at <strong>hello@brindaworld.ca</strong>.</p>
            <Link to="/">
              <button style={{ background: '#FF1493', color: '#fff', border: 'none', borderRadius: 50, padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                Back to Home
              </button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <label style={{ color: '#2D1B69', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(''); }}
              placeholder="Jane Smith"
              style={inputStyle}
            />

            <label style={{ color: '#2D1B69', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="jane@example.com"
              style={inputStyle}
            />

            <label style={{ color: '#2D1B69', fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Message</label>
            <textarea
              value={message}
              onChange={e => { setMessage(e.target.value); setError(''); }}
              placeholder="Tell us how we can help..."
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
            />

            {error && (
              <p style={{ color: '#991b1b', background: '#fef2f2', borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.88rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                background: '#FF1493', color: '#fff', border: 'none',
                borderRadius: 50, padding: '0.85rem 2rem',
                fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                width: '100%', boxShadow: '0 4px 16px rgba(255,20,147,0.3)',
              }}
            >
              Send Message 📨
            </button>

            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <Link to="/" style={{ color: '#6B0057', fontSize: '0.88rem', fontWeight: 600 }}>
                ← Back to Home
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;
