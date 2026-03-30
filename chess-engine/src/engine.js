/**
 * engine.js — Stockfish WASM Engine Wrapper
 * Manages Stockfish worker lifecycle, skill levels, and move computation.
 */

const STOCKFISH_CDN = 'https://cdn.jsdelivr.net/npm/stockfish.wasm@0.10.0/stockfish.js';

// Age → Stockfish skill level mapping
const AGE_SKILL_MAP = {
  4: 0, 5: 1, 6: 2, 7: 3, 8: 5, 9: 7,
  10: 9, 11: 11, 12: 13, 13: 15, 14: 17,
  15: 18, 16: 19, 17: 20, 18: 20,
};

export class StockfishEngine {
  constructor(options = {}) {
    this.worker = null;
    this.ready = false;
    this.skill = options.skill ?? this._ageToSkill(options.age || 10);
    this.thinkTimeMs = options.thinkTimeMs || 1000;
    this._resolveMove = null;
    this._initPromise = null;
  }

  _ageToSkill(age) {
    const clamped = Math.max(4, Math.min(18, age));
    return AGE_SKILL_MAP[clamped] ?? 10;
  }

  async init() {
    if (this._initPromise) return this._initPromise;
    this._initPromise = new Promise((resolve, reject) => {
      try {
        // Try Web Worker with Stockfish WASM
        if (typeof Worker !== 'undefined') {
          this.worker = new Worker(STOCKFISH_CDN);
          this.worker.onmessage = (e) => this._onMessage(e.data);
          this.worker.onerror = (e) => {
            console.warn('[Engine] Worker error, falling back to random moves:', e.message);
            this.worker = null;
            this.ready = true;
            resolve();
          };
          this._send('uci');
          // Wait for uciok
          const timeout = setTimeout(() => {
            console.warn('[Engine] Stockfish timeout, using random moves');
            this.ready = true;
            resolve();
          }, 5000);
          this._onReady = () => {
            clearTimeout(timeout);
            this._send(`setoption name Skill Level value ${this.skill}`);
            this._send('isready');
            this.ready = true;
            resolve();
          };
        } else {
          this.ready = true;
          resolve();
        }
      } catch (err) {
        console.warn('[Engine] Init failed:', err.message);
        this.ready = true;
        resolve();
      }
    });
    return this._initPromise;
  }

  _send(cmd) {
    if (this.worker) this.worker.postMessage(cmd);
  }

  _onMessage(line) {
    if (typeof line !== 'string') return;
    if (line === 'uciok' && this._onReady) {
      this._onReady();
      this._onReady = null;
    }
    if (line.startsWith('bestmove') && this._resolveMove) {
      const move = line.split(' ')[1];
      this._resolveMove(move);
      this._resolveMove = null;
    }
  }

  async getBestMove(fen) {
    await this.init();

    if (!this.worker) {
      // Fallback: return null (caller should handle random move)
      return null;
    }

    return new Promise((resolve) => {
      this._resolveMove = resolve;
      this._send(`position fen ${fen}`);
      this._send(`go movetime ${this.thinkTimeMs}`);
      // Timeout safety
      setTimeout(() => {
        if (this._resolveMove) {
          this._resolveMove(null);
          this._resolveMove = null;
        }
      }, this.thinkTimeMs + 2000);
    });
  }

  setSkill(level) {
    this.skill = Math.max(0, Math.min(20, level));
    if (this.worker) {
      this._send(`setoption name Skill Level value ${this.skill}`);
    }
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.ready = false;
    this._initPromise = null;
  }
}
