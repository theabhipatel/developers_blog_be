import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["node_modules", "dist", "package-lock.json"],
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "warn",
      "no-console": "error",
      eqeqeq: "error",
    },
  },
];
