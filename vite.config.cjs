import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4300,
    proxy: {
      "/auth": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false
      },
      "/core": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false
      },
      "/storage": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false
      },
      "/api": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false
      }
    },
  },
  build: {
    outDir: 'dist',
  },
  preview: {
    proxy: {
      "/storage": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false
      },
      "/api": {
        target: "http://localhost:5555",
        changeOrigin: true,
        secure: false
      }
    }
  }
})
