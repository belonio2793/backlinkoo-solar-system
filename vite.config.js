import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

// Compute __dirname in ESM context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    // Disable HMR websocket to avoid invalid frame header errors through the preview proxy
    hmr: false,
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
      // Externalize only true server-only modules. Bundle all local source files so the browser never requests filesystem paths.
      external: (id) => {
          const cleanId = id.split("?")[0];
          if (serverOnly.includes(cleanId)) return true;
          return false;
        },
      output: {
        manualChunks: {
          // Core React chunks
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],

          // Database and external services
          supabase: ["@supabase/supabase-js"],
          query: ["@tanstack/react-query"],

          // UI components (chunked by usage)
          "radix-core": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-popover",
          ],
          "radix-form": [
            "@radix-ui/react-label",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-select",
            "@radix-ui/react-switch",
          ],
          "radix-data": [
            "@radix-ui/react-tabs",
            "@radix-ui/react-accordion",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-scroll-area",
          ],

          // Form handling
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],

          // Charts and data visualization
          charts: ["recharts"],

          // Date handling
          dates: ["date-fns", "react-day-picker"],

          // Icons
          icons: ["lucide-react"],

          // Utilities
          utils: ["clsx", "tailwind-merge", "class-variance-authority"],
        },
      },
    },
  },
}));
