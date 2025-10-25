import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Server-only modules or packages that should never be bundled in the browser
const serverOnly = [
  "sharp",
  // Node built-ins that may be referenced by transitive deps or optional code paths
  "fs",
  "path",
  "os",
  "crypto",
  "stream",
  "util",
  "net",
  "tls",
  "zlib",
  "http",
  "https",
  // Common server SDKs that are sometimes imported dynamically
  "@netlify/functions",
  "openai",
  "stripe",
  "resend",
];

export default defineConfig(({ mode }) => ({
  server: {
    port: 3001,
    host: "0.0.0.0",
    // Disable HMR overlay to avoid Vite dev-client overlay errors in preview/proxy hosts
    // Keep HMR disabled where necessary by setting overlay: false instead of disabling the entire HMR system.
    hmr: {
      overlay: false,
    },
    fs: {
      allow: [".."],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Ensure any process.env checks in client code are safely inlined at build time
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
    // Prevent accidental runtime access to process.env in the browser
    "process.env": {},
    __DEV__: mode === "development",
  },
  optimizeDeps: {
    entries: ["./src/main.tsx"],
    // Avoid pre-bundling server-only modules
    exclude: serverOnly,
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "@supabase/supabase-js",
    ],
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    cssCodeSplit: false,
    target: "es2018",
    chunkSizeWarningLimit: 1500,
    reportCompressedSize: false,
    minify: "esbuild",
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        const msg = (warning && warning.message) || "";
        if (
          (warning && warning.plugin === "vite:import-analysis") ||
          msg.includes("is not statically analyzable") ||
          msg.includes("Dynamic import")
        ) {
          return;
        }
        defaultHandler(warning);
      },
      plugins: [
        {
          name: "suppress-warnings",
          renderChunk(code) {
            return { code: code.replace(/\/\*#__PURE__\*\//g, ""), map: null };
          },
        },
      ],
      // Externalize anything that must not be included in the browser bundle
      external: (id) => {
          const cleanId = id.split("?")[0];
          // Only externalize true server-only modules and native/node built-ins
          if (serverOnly.includes(cleanId)) return true;
          // Otherwise bundle local source modules so the client won't attempt to request filesystem paths
          return false;
        },
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'assets/app-[hash].js',
        chunkFileNames: 'assets/app-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      },
    },
  },
}));
