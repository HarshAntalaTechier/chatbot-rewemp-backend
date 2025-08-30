import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["public/**/*.js"], // 👈 all files inside public folder
    languageOptions: {
      globals: globals.browser, // 👈 allow document, window, etc.
      sourceType: "module",
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);
