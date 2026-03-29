import { Routes, Route } from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import ProtectedRoute     from './components/ProtectedRoute';

import Home      from './pages/Home';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import About     from './pages/About';
import Contact   from './pages/Contact';
import NotFound  from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/about"   element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*"        element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
