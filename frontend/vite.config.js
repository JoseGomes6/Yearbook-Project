import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".", // indica que a raiz do frontend é esta pasta
  server: {
    port: 5173, // podes usar outra porta se quiseres
  },
});
