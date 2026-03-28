import { useEffect, useState } from 'react';
import api from '../api';
import styles from './Home.module.css';

function Home() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get('/health')
      .then(res => setStatus(res.data.status))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>BrindaWorld Platform</h1>
      <p className={styles.tagline}>Fun educational games for girls aged 6–14</p>
      <div className={styles.badge}>
        API: <span className={status === 'ok' ? styles.online : styles.offline}>
          {status ?? 'checking…'}
        </span>
      </div>
    </main>
  );
}

export default Home;
