import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended"
  ),
  {
    settings: {
      react: {
        version: "detect",
      },
    },

    plugins: {
      react,
      "@typescript-eslint": typescriptEslint,
      "jsx-a11y": jsxA11Y,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "arrow-body-style": ["error", "as-needed"],
      "class-methods-use-this": 0,
      eqeqeq: [2, "smart"],
      "filenames/match-exported": 0,
      quotes: ["error", "double"],
      "jsx-quotes": ["error", "prefer-double"],

      "keyword-spacing": [
        "error",
        {
          after: true,
        },
      ],

      "no-case-declarations": 0,
      "no-invalid-this": 0,
      "no-nested-ternary": "error",
      "no-shadow": 0,

      "no-trailing-spaces": [
        "error",
        {
          ignoreComments: true,
        },
      ],

      "object-curly-spacing": ["error", "always"],

      "arrow-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],

      "prefer-destructuring": 0,
      semi: ["error", "always"],
      "space-infix-ops": "error",
      "import/extensions": 0,
      "react/function-component-definition": 0,
      "react/no-unstable-nested-components": 0,
      "import/no-extraneous-dependencies": 0,
      "import/no-named-as-default": 0,
      "import/no-unresolved": 0,
      "import/prefer-default-export": 0,
      "react/display-name": 0,

      "react/jsx-filename-extension": [
        1,
        {
          extensions: [".jsx", ".tsx"],
        },
      ],

      "react/jsx-key": 0,
      "react/no-multi-comp": 0,
      "react/sort-comp": 0,
      "react/jsx-indent-props": 0,
      "react/state-in-constructor": 0,
      "react/no-unused-prop-types": 1,
      "react/no-unknown-property": 0,
      "jsx-a11y/label-has-associated-control": 0,
      "jsx-a11y/label-has-for": 0,
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["clickHandler"],
        },
      ],

      "global-require": 0,
    },
  },
  {
    ignores: ["webpack.dev.js", "webpack.common.js", "webpack.prod.js"],
  },
];
