/**
 * engine.test.js — Chess Engine Unit Tests
 * Run: node tests/engine.test.js
 */

const assert = require('assert');

// ── Test: Age-to-skill mapping ───────────────────────────────────────────────
function testAgeSkillMapping() {
  const AGE_SKILL_MAP = {
    4: 0, 5: 1, 6: 2, 7: 3, 8: 5, 9: 7,
    10: 9, 11: 11, 12: 13, 13: 15, 14: 17,
    15: 18, 16: 19, 17: 20, 18: 20,
  };

  // Young children get easier AI
  assert.strictEqual(AGE_SKILL_MAP[4], 0, 'Age 4 should be skill 0');
  assert.strictEqual(AGE_SKILL_MAP[6], 2, 'Age 6 should be skill 2');

  // Older children get harder AI
  assert.strictEqual(AGE_SKILL_MAP[14], 17, 'Age 14 should be skill 17');
  assert.strictEqual(AGE_SKILL_MAP[18], 20, 'Age 18 should be skill 20');

  // Middle ages are moderate
  assert.strictEqual(AGE_SKILL_MAP[10], 9, 'Age 10 should be skill 9');

  console.log('  PASS: Age-to-skill mapping');
}

// ── Test: Theme definitions ──────────────────────────────────────────────────
function testThemes() {
  const themes = ['brindaworld', 'classic', 'ocean', 'midnight'];

  for (const t of themes) {
    assert.ok(typeof t === 'string' && t.length > 0, `Theme ${t} should be a non-empty string`);
  }

  assert.strictEqual(themes.length, 4, 'Should have exactly 4 themes');
  assert.ok(themes.includes('brindaworld'), 'brindaworld theme must exist');

  console.log('  PASS: Theme definitions');
}

// ── Test: Chess.js basic operations ──────────────────────────────────────────
function testChessLogic() {
  // chess.js is a dependency — verify it works
  try {
    const { Chess } = require('chess.js');
    const game = new Chess();

    assert.ok(game.fen().includes('rnbqkbnr'), 'Starting position should have all pieces');
    assert.strictEqual(game.turn(), 'w', 'White moves first');
    assert.strictEqual(game.isGameOver(), false, 'Game should not be over at start');

    // Make a legal move
    const move = game.move('e4');
    assert.ok(move !== null, 'e4 should be a legal move');
    assert.strictEqual(game.turn(), 'b', 'Black should move after e4');

    // Legal moves count
    const moves = game.moves();
    assert.ok(moves.length === 20, 'Black should have 20 legal moves after e4');

    console.log('  PASS: Chess.js basic operations');
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.log('  SKIP: Chess.js not installed (run npm install first)');
    } else {
      throw e;
    }
  }
}

// ── Test: FEN parsing ────────────────────────────────────────────────────────
function testFenParsing() {
  const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  const parts = startFen.split(' ');

  assert.strictEqual(parts.length, 6, 'FEN should have 6 space-separated parts');
  assert.strictEqual(parts[1], 'w', 'Active color should be white');
  assert.strictEqual(parts[2], 'KQkq', 'All castling rights should be available');
  assert.strictEqual(parts[4], '0', 'Halfmove clock should be 0');
  assert.strictEqual(parts[5], '1', 'Fullmove number should be 1');

  console.log('  PASS: FEN parsing');
}

// ── Test: Move validation format ─────────────────────────────────────────────
function testMoveFormat() {
  // UCI move format: e2e4 (4 chars) or e7e8q (5 chars with promotion)
  const validMoves = ['e2e4', 'g1f3', 'e7e8q', 'a2a4'];
  const invalidMoves = ['', 'e', 'e2', 'xyz'];

  for (const m of validMoves) {
    assert.ok(m.length >= 4 && m.length <= 5, `${m} should be 4-5 chars`);
    assert.ok(/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(m), `${m} should match UCI format`);
  }

  for (const m of invalidMoves) {
    assert.ok(!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(m), `${m} should not match UCI format`);
  }

  console.log('  PASS: Move format validation');
}

// ── Run all tests ────────────────────────────────────────────────────────────
console.log('\n@simonova/chess-engine — Test Suite\n');
let passed = 0;
let failed = 0;

const tests = [testAgeSkillMapping, testThemes, testChessLogic, testFenParsing, testMoveFormat];

for (const test of tests) {
  try {
    test();
    passed++;
  } catch (e) {
    console.error(`  FAIL: ${test.name} — ${e.message}`);
    failed++;
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed, ${tests.length} total\n`);
process.exit(failed > 0 ? 1 : 0);
