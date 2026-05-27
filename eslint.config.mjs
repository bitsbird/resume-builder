import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import tailwind from 'eslint-plugin-tailwindcss';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    plugins: {
      unicorn,
    },
    rules: {
      // TypeScript Strictness Rules
      '@typescript-eslint/no-explicit-any': 'error', // Completely bans 'any' types
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error', // Forces optimized type imports

      // Enforce PascalCase for components/types and camelCase for standard utilities
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: ['typeLike', 'class'], format: ['PascalCase'] },
        {
          selector: ['variable', 'function'],
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
      ],
    },
  },

  // 3. Tailwind Class Correctness Auditing
  {
    files: ['src/**/*.tsx'],
    plugins: { tailwind },
    rules: {
      'tailwind/classnames-order': 'warn',
      'tailwind/no-custom-classname': 'error',
      'tailwind/no-contradicting-classname': 'error',
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // 5. Turn off all conflicting style rules so Prettier can take over layout completely
  prettierConfig,
]);

export default eslintConfig;
