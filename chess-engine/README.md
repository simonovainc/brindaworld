# @simonova/chess-engine

Embeddable chess engine — Stockfish WASM + Chessground. Powers BrindaWorld. Drop into any website in 2 lines.

## Quick Start

```html
<div id="chess"></div>
<script src="https://brindaworld.ca/chess/embed.js"></script>
<script>BrindaChess.init('#chess', { age: 10 });</script>
```

## Demo
https://brindaworld.ca/chess/

## npm
```bash
npm install @simonova/chess-engine
```

```js
import { BrindaChess } from '@simonova/chess-engine';
const game = BrindaChess.init('#board', { age: 10, theme: 'brindaworld' });
```

## Themes
- `brindaworld` — Pink accents (default)
- `classic` — Traditional brown
- `ocean` — Blue tones
- `midnight` — Dark purple

## Options
| Option | Default | Description |
|--------|---------|-------------|
| age | 10 | Child's age (4-18) — sets AI skill |
| skill | null | Override skill level (0-20) |
| playerColor | 'white' | 'white' or 'black' or 'random' |
| theme | 'brindaworld' | Board theme |
| thinkTimeMs | 1000 | AI think time (ms) |
| soundEnabled | true | Web Audio move sounds |
| onGameEnd | null | Callback: ({result, moves, duration}) |
| onMove | null | Callback: (move, fen) |
| apiUrl | null | BrindaWorld API for session tracking |
| authToken | null | JWT for session tracking |
| childPublicId | null | Child UUID for session tracking |

## Methods
```js
game.newGame()         // Start fresh
game.flip()            // Flip board
game.setSkill(8)       // Change AI strength
game.setTheme('ocean') // Switch theme
game.getFen()          // Get position FEN
game.getHistory()      // Move history
game.destroy()         // Cleanup
```

## Embedding on Other Websites
Works with React, Vue, Angular, WordPress, Webflow, plain HTML.
See full examples at https://brindaworld.ca/chess/

## Development
```bash
cd chess-engine
npm install
npm test        # Run tests
npm run dev     # Dev server
npm run build   # Build embed.js
```

## License
MIT — Simonova Inc.
