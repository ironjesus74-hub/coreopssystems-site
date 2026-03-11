import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Security — block dangerous code-execution sinks
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      // Code quality
      "no-undef": "warn",
      "no-unused-vars": "warn",
    },
  },
];
