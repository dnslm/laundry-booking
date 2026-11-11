import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.yarn/**',
    '**/generated/**',
    '**/prisma/migrations/**',
  ]),

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    rules: {
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Backend and config files run in Node
  {
    files: ['backend/**/*.{js,mjs,cjs,ts}', '*.config.{js,mjs,cjs,ts}', 'scripts/**'],
    languageOptions: { globals: globals.node },
  },

  // Frontend runs in the browser and uses React
  {
    files: ['frontend/**/*.{js,jsx,ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Must be last: turns off rules that conflict with Prettier
  prettier,
]);
