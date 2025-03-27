import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jest from "eslint-plugin-jest";
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
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/dist", "**/node_modules"]), {
    extends: compat.extends("neostandard", "plugin:jest/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        jest,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
            ...globals.node,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: "commonjs",
    },

    rules: {
        "no-unused-vars": 1,
        "comma-dangle": ["error", "always-multiline"],
        quotes: [2, "single"],
        "prefer-template": ["error"],
        "no-useless-concat": ["error"],

        "prefer-destructuring": ["error", {
            object: true,
        }],
    },
}]);