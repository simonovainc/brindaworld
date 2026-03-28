import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>404 – Page not found</h1>
      <p><Link to="/">Go back home</Link></p>
    </main>
  );
}

export default NotFound;
