import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Both pages are deliberately self-contained files: the piano score ships
 * inside them as base64 so they work from anywhere, even a saved copy.
 * Keeping 2.5MB of base64 in the HTML made the source unreadable and
 * un-diffable, so the track lives in src/score.mp3 and is inlined here --
 * in dev and in build alike. What ships is unchanged.
 */
function inlineScore(): Plugin {
  const marker = '<!--SCORE_B64-->'
  const score = fileURLToPath(new URL('./src/score.mp3', import.meta.url))
  return {
    name: 'inline-score',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!html.includes(marker)) return html
        return html.replace(marker, readFileSync(score).toString('base64'))
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), inlineScore()],
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        story: fileURLToPath(new URL('./story.html', import.meta.url)),
      },
    },
  },
})
