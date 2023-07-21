import globals from "globals";

import eslint from "@eslint/js/src/configs/eslint-recommended.js";
import ava from "eslint-plugin-ava";
import prettier from "eslint-plugin-prettier";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

import unicorn from "eslint-plugin-unicorn/configs/recommended.js";
import promise from "eslint-plugin-promise";

//TODO: unify package json scripts
export default [
  eslint,
  typescript.configs.recommended,
  unicorn,
  unsanitized,
  promise.configs.recommended,
  ava.configs.recommended,
  prettier.configs.recommended,
  {
    plugins: {
      ava,
      unicorn,
    },
    rules: {
      "ava/assertion-arguments": "error",
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "off",
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
      },
    },
  },
];
