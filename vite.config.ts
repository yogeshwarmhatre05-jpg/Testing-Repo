import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxies /api requests to the local backend during development so the
// frontend never needs to know the backend's real origin, and never
// touches a secret API key directly.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});