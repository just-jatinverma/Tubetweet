import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2021,
    },
    extends: ['js/recommended'],
  },
]);
