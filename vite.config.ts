import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./", // Usa rutas relativas para funcionar en cualquier subdirectorio
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
  },
})
