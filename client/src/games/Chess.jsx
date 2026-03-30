/**
 * Chess.jsx — BrindaWorld Chess Game Wrapper
 * Thin React wrapper around the @simonova/chess-engine embed.
 */

import React, { useEffect, useRef } from 'react';

export default function ChessGame({ childAge = 10, childPublicId, onSessionEnd, theme = 'brindaworld' }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load BrindaChess dynamically (heavy WASM dependency)
    const loadEngine = async () => {
      try {
        await import('/chess/embed.js');
        if (!containerRef.current || !window.BrindaChess) return;
        gameRef.current = window.BrindaChess.init(containerRef.current, {
          age: childAge,
          theme,
          playerColor: 'white',
          soundEnabled: true,
          showTips: true,
          apiUrl: '/api',
          authToken: localStorage.getItem('brinda_token'),
          childPublicId: childPublicId || null,
          onGameEnd: (result) => {
            if (onSessionEnd) onSessionEnd(result);
          },
        });
      } catch (e) {
        console.warn('[Chess] Could not load engine:', e);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="text-align:center;padding:2rem;color:#d63384;">
              <p style="font-size:2rem;margin-bottom:0.5rem;">♛</p>
              <p style="font-weight:700;">Chess engine loading...</p>
              <p style="color:#888;font-size:0.85rem;margin-top:0.5rem;">If this persists, try refreshing the page.</p>
            </div>
          `;
        }
      }
    };

    loadEngine();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy();
        gameRef.current = null;
      }
    };
  }, [childAge, childPublicId, theme]);

  return (
    <div
      ref={containerRef}
      style={{ maxWidth: 560, margin: '0 auto', padding: 20 }}
      aria-label="Chess game board"
      role="application"
    />
  );
}
