import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'PUBLIC_')

  return {
    plugins: [sveltekit()],
    server: {
      port: env.PUBLIC_PORT,
      strictPort: true
    }
  }
})
