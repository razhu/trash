import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { files: ['**/*.ts'] },
  { ignores: ['dist', 'coverage', '**/*.{js,mjs,cjs}'] },
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  eslintConfigPrettier,
];
