import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages, set base to your repo name.
// Example: if your repo is github.com/yourname/ai-ethics-toolkit
// then base should be '/ai-ethics-toolkit/'
//
// For a custom domain (e.g., aiethics.duke.edu), set base to '/'
// For Vercel or Netlify, set base to '/'

export default defineConfig({
  plugins: [react()],
  base: '/ai-ethics-toolkit/',
})
