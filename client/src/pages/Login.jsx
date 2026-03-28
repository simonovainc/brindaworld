import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const T = {
  primary:   '#d63384',
  secondary: '#7b2ff7',
  bg:        '#fff0f5',
  text:      '#2d1b69',
  light:     '#888',
  border:    '#f0c0d8',
};

const inputStyle = {
  width: '100%', padding: '0.68rem 0.85rem',
  border: `1.5px solid ${T.border}`, borderRadius: 9,
  fontSize: '0.95rem', boxSizing: 'border-box',
  outline: 'none', fontFamily: 'inherit', color: T.text,
};

function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: '3.2rem', lineHeight: 1 }}>👑</div>
          <h1 style={{ color: T.text, margin: '0.3rem 0 0', fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            BrindaWorld
          </h1>
          <p style={{ color: T.light, margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 18, padding: '2rem 2.2rem',
          boxShadow: '0 6px 32px rgba(214,51,132,0.13)',
          border: `1px solid ${T.border}`,
        }}>

          {error && (
            <div style={{
              color: T.primary, background: '#fff0f5',
              border: `1px solid ${T.border}`, borderRadius: 9,
              padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.88rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: T.text, fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Email
              </label>
              <input
                type="email" value={form.email} onChange={set('email')}
                required placeholder="you@example.com" style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ color: T.text, fontSize: '0.84rem', fontWeight: 600 }}>Password</label>
                <a href="#" style={{ color: T.primary, fontSize: '0.8rem', textDecoration: 'none' }}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password" value={form.password} onChange={set('password')}
                required style={inputStyle}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '0.82rem',
                background: loading ? '#ccc' : `linear-gradient(135deg, ${T.primary}, ${T.secondary})`,
                color: 'white', border: 'none', borderRadius: 10,
                fontSize: '1rem', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.3px', transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.4rem', fontSize: '0.88rem', color: T.light }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: T.primary, fontWeight: 600, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
