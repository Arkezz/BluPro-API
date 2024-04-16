import globals from "globals";

import eslint from "@eslint/js";
import ava from "eslint-plugin-ava";
import typescript from "typescript-eslint";
import typescriptParser from "@typescript-eslint/parser";

import unicorn from "eslint-plugin-unicorn";
import promise from "eslint-plugin-promise";

const ignores = ["node_modules/", "dist/"];

//TODO: unify package json scripts
/** @type { import("eslint").Linter.Config } */
export default [
  { ignores },
  eslint.configs.recommended,
  unicorn.configs["flat/recommended"],
  // unsanitized,
  // promise.configs.recommended,
  // ava.configs.recommended,
  ...typescript.configs.recommendedTypeChecked,
  ...typescript.configs.stylisticTypeChecked,
  {
    rules: {
      // "ava/assertion-arguments": "error",
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

