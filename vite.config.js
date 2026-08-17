import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative base so built assets (JS/CSS) resolve correctly whether the
  // app is served from a domain root or a GitHub Pages subfolder like
  // https://username.github.io/repo-name/
  base: './FunBoy-Shop',
})
