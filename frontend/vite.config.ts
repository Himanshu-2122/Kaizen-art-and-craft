import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api/v1/uploads': {
        target: 'http://localhost:5000', // Assuming backend runs on port 5000
        changeOrigin: true,
        rewrite: (path) => path, // No rewrite needed, path is already /api/v1/uploads
      },
    },
  },
  plugins: [
    react(),
    // mode === "development" && componentTagger(), // Temporarily removed for debugging
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
