import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  plugins: [react()],
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
