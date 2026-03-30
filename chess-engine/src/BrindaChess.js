/**
 * BrindaChess.js — Main entry point
 * Combines Stockfish engine + Chessground board + game logic.
 *
 * Usage:
 *   import { BrindaChess } from '@simonova/chess-engine';
 *   const game = BrindaChess.init('#board', { age: 10, theme: 'brindaworld' });
 *
 * Or via script tag:
 *   <script src="embed.js"></script>
 *   <script>BrindaChess.init('#board', { age: 10 });</script>
 */

import { Chess } from 'chess.js';
import { StockfishEngine } from './engine.js';
import { ChessBoard, THEMES } from './board.js';

class BrindaChessGame {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      age: 10,
      skill: null,
      playerColor: 'white',
      theme: 'brindaworld',
      thinkTimeMs: 1000,
      soundEnabled: true,
      showTips: true,
      apiUrl: null,
      authToken: null,
      childPublicId: null,
      onGameEnd: null,
      onMove: null,
      ...options,
    };

    this.chess = new Chess();
    this.engine = new StockfishEngine({
      age: this.options.age,
      skill: this.options.skill,
      thinkTimeMs: this.options.thinkTimeMs,
    });
    this.board = null;
    this.moveCount = 0;
    this.startTime = Date.now();
    this.sessionId = null;
    this._destroyed = false;

    this._init();
  }

  async _init() {
    // Create UI wrapper
    this._createUI();

    // Initialize board
    this.board = new ChessBoard(this._boardContainer, {
      theme: this.options.theme,
      playerColor: this.options.playerColor,
      onMove: (orig, dest) => this._onPlayerMove(orig, dest),
    });
    await this.board.init();

    // Initialize engine
    await this.engine.init();

    // Update board with legal moves
    this._updateBoard();

    // Start session tracking
    this._startSession();

    // If AI plays first (player is black)
    if (this.options.playerColor === 'black') {
      setTimeout(() => this._aiMove(), 500);
    }
  }

  _createUI() {
    this.container.innerHTML = '';
    this.container.style.fontFamily = "'Segoe UI', sans-serif";

    // Status bar
    this._statusEl = document.createElement('div');
    this._statusEl.style.cssText = 'text-align:center;padding:8px;font-size:14px;font-weight:600;color:#2d1b69;';
    this._statusEl.textContent = 'Your turn! Make a move.';
    this.container.appendChild(this._statusEl);

    // Board container
    this._boardContainer = document.createElement('div');
    this.container.appendChild(this._boardContainer);

    // Controls
    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex;gap:8px;justify-content:center;padding:12px;flex-wrap:wrap;';

    const btnStyle = 'padding:8px 16px;border-radius:8px;border:1.5px solid #f0c0d8;background:white;color:#2d1b69;font-weight:600;font-size:13px;cursor:pointer;';

    const newGameBtn = document.createElement('button');
    newGameBtn.textContent = 'New Game';
    newGameBtn.style.cssText = btnStyle;
    newGameBtn.onclick = () => this.newGame();
    controls.appendChild(newGameBtn);

    const flipBtn = document.createElement('button');
    flipBtn.textContent = 'Flip Board';
    flipBtn.style.cssText = btnStyle;
    flipBtn.onclick = () => this.flip();
    controls.appendChild(flipBtn);

    // Theme selector
    const themeSelect = document.createElement('select');
    themeSelect.style.cssText = btnStyle + 'appearance:auto;';
    Object.entries(THEMES).forEach(([key, t]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = t.name;
      if (key === this.options.theme) opt.selected = true;
      themeSelect.appendChild(opt);
    });
    themeSelect.onchange = () => this.setTheme(themeSelect.value);
    controls.appendChild(themeSelect);

    this.container.appendChild(controls);

    // Tips area
    if (this.options.showTips) {
      this._tipEl = document.createElement('div');
      this._tipEl.style.cssText = 'text-align:center;padding:8px;font-size:12px;color:#888;font-style:italic;';
      this._tipEl.textContent = this._getRandomTip();
      this.container.appendChild(this._tipEl);
    }
  }

  _getRandomTip() {
    const tips = [
      'Control the center of the board with your pawns.',
      'Develop your knights and bishops early.',
      'Castle your king to keep it safe.',
      'Think ahead — what will your opponent do next?',
      'Every piece counts. Protect your pieces!',
      'Look for forks — attack two pieces at once.',
      'Pins and skewers are powerful tactics.',
      'In the endgame, activate your king.',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  _updateBoard() {
    if (!this.board || this._destroyed) return;

    // Build legal move destinations for Chessground
    const dests = new Map();
    const moves = this.chess.moves({ verbose: true });
    for (const m of moves) {
      if (!dests.has(m.from)) dests.set(m.from, []);
      dests.get(m.from).push(m.to);
    }

    this.board.setPosition(this.chess.fen());
    this.board.setMovable(dests, this.chess.turn() === 'w' ? 'white' : 'black');
  }

  async _onPlayerMove(orig, dest) {
    // Make the move in chess.js
    const move = this.chess.move({ from: orig, to: dest, promotion: 'q' });
    if (!move) return;

    this.moveCount++;
    if (this.options.onMove) this.options.onMove(move, this.chess.fen());
    this._playSound('move');

    this._updateBoard();
    this._updateStatus();

    if (this.chess.isGameOver()) {
      this._endGame();
      return;
    }

    // AI's turn
    this._statusEl.textContent = 'Thinking...';
    setTimeout(() => this._aiMove(), 300);
  }

  async _aiMove() {
    if (this._destroyed || this.chess.isGameOver()) return;

    const bestMove = await this.engine.getBestMove(this.chess.fen());

    if (bestMove && !this._destroyed) {
      const move = this.chess.move({
        from: bestMove.substring(0, 2),
        to: bestMove.substring(2, 4),
        promotion: bestMove[4] || 'q',
      });

      if (move) {
        this.moveCount++;
        if (this.options.onMove) this.options.onMove(move, this.chess.fen());
        this._playSound('move');
      }
    } else if (!this._destroyed) {
      // Fallback: random legal move
      const moves = this.chess.moves();
      if (moves.length > 0) {
        this.chess.move(moves[Math.floor(Math.random() * moves.length)]);
        this.moveCount++;
      }
    }

    this._updateBoard();
    this._updateStatus();

    if (this.chess.isGameOver()) {
      this._endGame();
    }
  }

  _updateStatus() {
    if (!this._statusEl) return;
    if (this.chess.isCheckmate()) {
      const winner = this.chess.turn() === 'w' ? 'Black' : 'White';
      this._statusEl.textContent = `Checkmate! ${winner} wins!`;
      this._statusEl.style.color = '#d63384';
    } else if (this.chess.isDraw()) {
      this._statusEl.textContent = 'Draw!';
    } else if (this.chess.isCheck()) {
      this._statusEl.textContent = 'Check!';
      this._statusEl.style.color = '#dc2626';
    } else {
      const turn = this.chess.turn() === 'w' ? 'White' : 'Black';
      this._statusEl.textContent = `${turn}'s turn`;
      this._statusEl.style.color = '#2d1b69';
    }
  }

  _playSound(type) {
    if (!this.options.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = type === 'capture' ? 300 : 520;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) { /* Audio not available */ }
  }

  async _startSession() {
    if (!this.options.apiUrl || !this.options.authToken || !this.options.childPublicId) return;
    try {
      const res = await fetch(`${this.options.apiUrl}/sessions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.options.authToken}`,
        },
        body: JSON.stringify({
          child_id: this.options.childPublicId,
          game_id: 'chess',
          game_category: 'chess',
        }),
      });
      const data = await res.json();
      this.sessionId = data.session_id;
    } catch (e) {
      console.warn('[BrindaChess] Session start failed:', e.message);
    }
  }

  async _endGame() {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    let result;
    if (this.chess.isCheckmate()) {
      result = this.chess.turn() === 'w' ? 'black_wins' : 'white_wins';
    } else {
      result = 'draw';
    }

    const playerWon = (this.options.playerColor === 'white' && result === 'white_wins') ||
                      (this.options.playerColor === 'black' && result === 'black_wins');

    // End session via API
    if (this.sessionId && this.options.apiUrl) {
      try {
        await fetch(`${this.options.apiUrl}/sessions/end`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.options.authToken}`,
          },
          body: JSON.stringify({
            session_id: this.sessionId,
            score: playerWon ? 100 : (result === 'draw' ? 50 : 0),
            max_score: 100,
            completion_status: 'completed',
          }),
        });
      } catch (_) {}
    }

    // Callback
    if (this.options.onGameEnd) {
      this.options.onGameEnd({
        result,
        playerWon,
        moves: this.moveCount,
        duration,
        fen: this.chess.fen(),
        pgn: this.chess.pgn(),
      });
    }

    this._playSound(playerWon ? 'move' : 'capture');
  }

  // ── Public API ─────────────────────────────────────────────
  newGame() {
    this.chess.reset();
    this.moveCount = 0;
    this.startTime = Date.now();
    this._updateBoard();
    this._statusEl.textContent = 'New game! Your turn.';
    this._statusEl.style.color = '#2d1b69';
    if (this._tipEl) this._tipEl.textContent = this._getRandomTip();
    this._startSession();
    if (this.options.playerColor === 'black') {
      setTimeout(() => this._aiMove(), 500);
    }
  }

  flip() {
    if (this.board) this.board.flip();
  }

  setSkill(level) {
    this.engine.setSkill(level);
  }

  setTheme(themeName) {
    if (this.board) this.board.setTheme(themeName);
  }

  getFen() {
    return this.chess.fen();
  }

  getHistory() {
    return this.chess.history({ verbose: true });
  }

  destroy() {
    this._destroyed = true;
    if (this.board) this.board.destroy();
    if (this.engine) this.engine.destroy();
    if (this.container) this.container.innerHTML = '';
  }
}

// ── Static factory (for script tag usage) ────────────────────────────────────
export const BrindaChess = {
  init(container, options) {
    return new BrindaChessGame(container, options);
  },
  themes: THEMES,
};

// Attach to window for script tag usage
if (typeof window !== 'undefined') {
  window.BrindaChess = BrindaChess;
}

export default BrindaChess;
