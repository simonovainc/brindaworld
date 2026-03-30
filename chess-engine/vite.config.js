import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/BrindaChess.js'),
      name: 'BrindaChess',
      formats: ['es', 'umd'],
      fileName: (format) => {
        if (format === 'umd') return 'embed.js';
        return `chess-engine.${format}.js`;
      },
    },
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        globals: {},
      },
    },
  },
  server: {
    port: 3002,
    open: true,
  },
});
