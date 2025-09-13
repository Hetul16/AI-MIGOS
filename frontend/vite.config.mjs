import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tagger from "@dhiwise/component-tagger";
import path from 'path'; // Import path module

// https://vitejs.dev/config/
export default defineConfig({
  // This changes the out put dir from dist to build
  // comment this out if that isn't relevant for your project
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [react(), tagger()], // Temporarily removed tsconfigPaths()
  resolve: {
    alias: {
      // Use path.resolve to ensure absolute paths
      'components': path.resolve(__dirname, './src/components'),
      'contexts': path.resolve(__dirname, './src/contexts'),
      'pages': path.resolve(__dirname, './src/pages'),
      'services': path.resolve(__dirname, './src/services'),
      'utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
    allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
  }
});
