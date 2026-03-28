import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const T = {
  primary:   '#d63384',
  secondary: '#7b2ff7',
  bg:        '#fff0f5',
  card:      '#ffffff',
  text:      '#2d1b69',
  light:     '#888',
  border:    '#f0c0d8',
};

const AVATARS = ['🧒', '👧', '🧒‍♀️', '👱‍♀️', '🌟', '💎', '👑', '🦋'];

const inputStyle = {
  width: '100%', padding: '0.62rem 0.8rem',
  border: `1.5px solid ${T.border}`, borderRadius: 8,
  fontSize: '0.93rem', boxSizing: 'border-box',
  outline: 'none', fontFamily: 'inherit', color: T.text,
};

function Dashboard() {
  const { user, children, loading, logout, addChild, removeChild, fetchChildren } = useAuth();
  const navigate = useNavigate();

  const [planType,     setPlanType]     = useState('free');
  const [showAddForm,  setShowAddForm]  = useState(false);
  const [newChild,     setNewChild]     = useState({ name: '', age: '', avatar: '🧒' });
  const [addLoading,   setAddLoading]   = useState(false);
  const [addError,     setAddError]     = useState('');

  // Fetch children + subscription info on mount
  useEffect(() => {
    if (!user) return;
    fetchChildren().catch(console.error);
    api.get('/auth/me')
      .then(res => setPlanType(res.data.user.planType || 'free'))
      .catch(console.error);
  }, [user]);

  const handleAddChild = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!newChild.name.trim() || !newChild.age) {
      setAddError('Name and age are required.');
      return;
    }
    setAddLoading(true);
    try {
      await addChild(newChild.name.trim(), parseInt(newChild.age, 10), newChild.avatar);
      setNewChild({ name: '', age: '', avatar: '🧒' });
      setShowAddForm(false);
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add child.');
    } finally {
      setAddLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading || !user) return null;

  const planLabel = planType.charAt(0).toUpperCase() + planType.slice(1);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(135deg, ${T.primary} 0%, ${T.secondary} 100%)`,
        padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 3px 16px rgba(214,51,132,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.9rem' }}>👑</span>
          <span style={{ color: 'white', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.3px' }}>
            BrindaWorld
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.18)',
            color: 'white',
            border: '1.5px solid rgba(255,255,255,0.4)',
            borderRadius: 9, padding: '0.45rem 1.2rem',
            cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '2.25rem 1.25rem' }}>

        {/* ── Welcome ── */}
        <h1 style={{ color: T.text, fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.35rem', letterSpacing: '-0.5px' }}>
          Welcome back, {user.firstName}! 👑
        </h1>
        <p style={{ color: T.light, margin: '0 0 2rem', fontSize: '0.95rem' }}>
          Manage your children's learning adventures below.
        </p>

        {/* ── Stats row ── */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.25rem', flexWrap: 'wrap' }}>
          {[
            { icon: '💎', label: 'Plan',     value: planLabel },
            { icon: '👧', label: 'Children', value: children.length },
            { icon: '🎮', label: 'Role',     value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
          ].map(stat => (
            <div key={stat.label} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 14, padding: '1rem 1.4rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              minWidth: 130, boxShadow: '0 2px 10px rgba(214,51,132,0.07)',
            }}>
              <span style={{ fontSize: '1.9rem' }}>{stat.icon}</span>
              <div>
                <div style={{ color: T.light, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  {stat.label}
                </div>
                <div style={{ color: T.text, fontWeight: 700, fontSize: '1.1rem' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Children section ── */}
        <div style={{
          background: T.card, borderRadius: 18,
          border: `1px solid ${T.border}`,
          padding: '1.75rem',
          boxShadow: '0 3px 18px rgba(214,51,132,0.08)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: T.text, margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Your Children</h2>
            <button
              onClick={() => { setShowAddForm(!showAddForm); setAddError(''); }}
              style={{
                background: `linear-gradient(135deg, ${T.primary}, ${T.secondary})`,
                color: 'white', border: 'none', borderRadius: 9,
                padding: '0.5rem 1.25rem', cursor: 'pointer',
                fontSize: '0.88rem', fontWeight: 700,
              }}
            >
              {showAddForm ? '✕ Cancel' : '+ Add Child'}
            </button>
          </div>

          {/* ── Add child form ── */}
          {showAddForm && (
            <div style={{
              background: T.bg, borderRadius: 13, padding: '1.5rem',
              marginBottom: '1.75rem', border: `1px solid ${T.border}`,
            }}>
              <h3 style={{ color: T.text, margin: '0 0 1.1rem', fontSize: '1rem', fontWeight: 700 }}>
                Add New Child
              </h3>

              {addError && (
                <div style={{
                  color: T.primary, background: '#fff0f5', border: `1px solid ${T.border}`,
                  borderRadius: 8, padding: '0.7rem 0.9rem', marginBottom: '1rem', fontSize: '0.86rem',
                }}>
                  {addError}
                </div>
              )}

              <form onSubmit={handleAddChild}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', color: T.text, fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                      Name *
                    </label>
                    <input
                      type="text" placeholder="Child's name"
                      value={newChild.name}
                      onChange={e => setNewChild(p => ({ ...p, name: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: T.text, fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                      Age (3 – 14) *
                    </label>
                    <input
                      type="number" min={3} max={14} placeholder="Age"
                      value={newChild.age}
                      onChange={e => setNewChild(p => ({ ...p, age: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Avatar picker */}
                <div style={{ marginBottom: '1.1rem' }}>
                  <label style={{ display: 'block', color: T.text, fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Avatar
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {AVATARS.map(emoji => (
                      <button
                        key={emoji} type="button"
                        onClick={() => setNewChild(p => ({ ...p, avatar: emoji }))}
                        style={{
                          fontSize: '1.75rem', width: 52, height: 52,
                          border: `2.5px solid ${newChild.avatar === emoji ? T.primary : T.border}`,
                          borderRadius: 12, cursor: 'pointer',
                          background: newChild.avatar === emoji ? '#fff0f5' : 'white',
                          transition: 'border-color 0.15s',
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit" disabled={addLoading}
                  style={{
                    background: addLoading ? '#ccc' : `linear-gradient(135deg, ${T.primary}, ${T.secondary})`,
                    color: 'white', border: 'none', borderRadius: 9,
                    padding: '0.62rem 1.6rem', cursor: addLoading ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: '0.92rem',
                  }}
                >
                  {addLoading ? 'Adding…' : 'Add Child ✓'}
                </button>
              </form>
            </div>
          )}

          {/* ── Children cards ── */}
          {children.length === 0 && !showAddForm ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: T.light }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.6rem' }}>👧</div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                No children added yet. Click <strong style={{ color: T.primary }}>+ Add Child</strong> to get started!
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
              gap: '1rem',
            }}>
              {children.map(child => (
                <div key={child.id} style={{
                  background: T.bg, border: `1px solid ${T.border}`,
                  borderRadius: 15, padding: '1.35rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(214,51,132,0.06)',
                  transition: 'box-shadow 0.2s',
                }}>
                  <div style={{ fontSize: '3.2rem', marginBottom: '0.5rem' }}>
                    {child.avatar || '🧒'}
                  </div>
                  <div style={{ color: T.text, fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>
                    {child.name}
                  </div>
                  <div style={{ color: T.light, fontSize: '0.82rem', marginBottom: '1rem' }}>
                    Age {child.age}
                  </div>
                  <button style={{
                    background: `linear-gradient(135deg, ${T.primary}, ${T.secondary})`,
                    color: 'white', border: 'none', borderRadius: 8,
                    padding: '0.42rem 0', cursor: 'pointer',
                    fontSize: '0.84rem', fontWeight: 700, width: '100%',
                  }}>
                    Play Now 🎮
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
