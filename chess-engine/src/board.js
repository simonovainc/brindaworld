/**
 * board.js — Chessground Board Wrapper
 * Renders the interactive chess board with themes and move handling.
 */

const CHESSGROUND_CSS = 'https://unpkg.com/@lichess/chessground@9.1.6/assets/chessground.base.css';
const CHESSGROUND_PIECES = 'https://unpkg.com/@lichess/chessground@9.1.6/assets/chessground.cburnett.css';
const CHESSGROUND_JS = 'https://unpkg.com/@lichess/chessground@9.1.6/chessground.min.js';

// ── Theme definitions ────────────────────────────────────────────────────────
export const THEMES = {
  brindaworld: {
    name: 'BrindaWorld',
    lightSquare: '#fff0f5',
    darkSquare: '#d63384',
    accent: '#e91e8c',
    moveHighlight: 'rgba(214,51,132,0.35)',
    lastMoveHighlight: 'rgba(214,51,132,0.25)',
  },
  classic: {
    name: 'Classic',
    lightSquare: '#f0d9b5',
    darkSquare: '#b58863',
    accent: '#769656',
    moveHighlight: 'rgba(155,199,0,0.41)',
    lastMoveHighlight: 'rgba(155,199,0,0.25)',
  },
  ocean: {
    name: 'Ocean',
    lightSquare: '#dee3e6',
    darkSquare: '#8ca2ad',
    accent: '#4a90d9',
    moveHighlight: 'rgba(74,144,217,0.35)',
    lastMoveHighlight: 'rgba(74,144,217,0.25)',
  },
  midnight: {
    name: 'Midnight',
    lightSquare: '#4a3b6b',
    darkSquare: '#2d1b69',
    accent: '#7b2ff7',
    moveHighlight: 'rgba(123,47,247,0.35)',
    lastMoveHighlight: 'rgba(123,47,247,0.25)',
  },
};

export class ChessBoard {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.theme = THEMES[options.theme] || THEMES.brindaworld;
    this.orientation = options.playerColor || 'white';
    this.onMove = options.onMove || null;
    this.cg = null;
    this._cssLoaded = false;
  }

  async init() {
    await this._loadCSS();
    await this._loadChessground();
    this._createBoard();
    this._applyTheme();
  }

  async _loadCSS() {
    if (this._cssLoaded) return;
    const loadLink = (href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };
    loadLink(CHESSGROUND_CSS);
    loadLink(CHESSGROUND_PIECES);
    this._cssLoaded = true;
  }

  async _loadChessground() {
    if (window.Chessground) return;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CHESSGROUND_JS;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load Chessground'));
      document.head.appendChild(script);
    });
  }

  _createBoard() {
    // Create board container
    this.boardEl = document.createElement('div');
    this.boardEl.className = 'brinda-chess-board';
    this.boardEl.style.cssText = 'width:100%;max-width:560px;aspect-ratio:1;margin:0 auto;';
    this.container.appendChild(this.boardEl);

    this.cg = window.Chessground(this.boardEl, {
      orientation: this.orientation,
      movable: {
        free: false,
        color: this.orientation,
        events: {
          after: (orig, dest) => {
            if (this.onMove) this.onMove(orig, dest);
          },
        },
      },
      animation: { duration: 200 },
      highlight: { lastMove: true, check: true },
      draggable: { showGhost: true },
    });
  }

  _applyTheme() {
    if (!this.boardEl) return;
    const style = document.createElement('style');
    style.textContent = `
      .brinda-chess-board cg-board {
        background-color: ${this.theme.lightSquare};
      }
      .brinda-chess-board cg-board square.dark {
        background-color: ${this.theme.darkSquare};
      }
      .brinda-chess-board cg-board square.last-move {
        background-color: ${this.theme.lastMoveHighlight};
      }
      .brinda-chess-board cg-board square.move-dest {
        background: radial-gradient(${this.theme.moveHighlight} 22%, transparent 22%);
      }
    `;
    this.boardEl.appendChild(style);
  }

  setPosition(fen, lastMove) {
    if (!this.cg) return;
    this.cg.set({
      fen,
      lastMove: lastMove ? [lastMove.substring(0, 2), lastMove.substring(2, 4)] : undefined,
    });
  }

  setMovable(dests, color) {
    if (!this.cg) return;
    this.cg.set({
      movable: { dests, color },
    });
  }

  flip() {
    if (!this.cg) return;
    this.orientation = this.orientation === 'white' ? 'black' : 'white';
    this.cg.set({ orientation: this.orientation });
  }

  setTheme(themeName) {
    this.theme = THEMES[themeName] || THEMES.brindaworld;
    this._applyTheme();
  }

  destroy() {
    if (this.cg) this.cg.destroy();
    if (this.boardEl && this.boardEl.parentNode) {
      this.boardEl.parentNode.removeChild(this.boardEl);
    }
  }
}
