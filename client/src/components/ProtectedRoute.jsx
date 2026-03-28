import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — redirects to /login if the user is not authenticated.
 * Shows a full-screen spinner while the session is being restored.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#fff0f5',
        fontFamily: "'Segoe UI', sans-serif", color: '#d63384', fontSize: '1.1rem',
      }}>
        <span style={{ marginRight: 10, fontSize: '1.8rem' }}>👑</span>
        Loading BrindaWorld…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
