import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // PORT isn't exposed to the app, read it from the .env files here
  const { PORT } = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    // keep the REACT_APP_ prefix of the env variables, see .env.development
    envPrefix: "REACT_APP_",
    // radium reads global.navigator, which webpack used to polyfill
    define: {
      global: "globalThis",
    },
    resolve: {
      alias: [
        // the ES build of react-virtualized imports a missing export
        {
          find: /^react-virtualized$/,
          replacement: "react-virtualized/dist/commonjs/index.js",
        },
      ],
    },
    server: {
      port: Number(PORT) || 3001,
    },
    preview: {
      port: Number(PORT) || 3001,
    },
    build: {
      outDir: "build",
    },
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["src/setupTests.js"],
      include: ["src/**/*.spec.{js,jsx}"],
      coverage: {
        include: ["src/**/*.{js,jsx}"],
        exclude: [
          "src/index.jsx",
          "src/setupTests.js",
          "src/test-utils.jsx",
          "src/__mocks__/**",
          "src/**/*.spec.{js,jsx}",
        ],
      },
    },
  };
});
