import love from 'eslint-config-love'
import prettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  {
    // Mirrors the old .eslintignore; flat config no longer reads that file.
    // Test files are also outside tsconfig.json, so typed linting can't parse them.
    ignores: [
      'build/**',
      'public/**',
      'src/client/**',
      '**/*.scss',
      '**/*.spec.{ts,tsx}',
      '**/*.test.{ts,tsx}',
      // Generated; their bare `/* eslint-disable */` header trips love's eslint-comments rules.
      'src/proto/**',
    ],
  },
  {
    ...love,
    files: ['src/**/*.{ts,tsx,js}'],
  },
  {
    files: ['src/**/*.{ts,tsx,js}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        // love defaults to projectService; keep the explicit tsconfig the old config used.
        projectService: false,
        project: './tsconfig.json',
      },
    },
    // Only the two classic hooks rules. The v7 `recommended` preset adds React
    // Compiler rules, which are out of scope for this migration.
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '_', argsIgnorePattern: '_' },
      ],

      'no-labels': ['error', { allowLoop: true }],
      // console.error/warn stay allowed: errors from failed fetches still need reporting.
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // props: false because labelColor's shared colour counter and the yaml
      // visitor mutate their arguments by design; rebinding a parameter itself
      // is the pattern worth catching.
      'no-param-reassign': ['error', {props: false}],
      'no-void': 'off',
      // TODO fix these in follow ups
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',

      // Style and size rules from eslint-config-love 158 that this codebase does not follow.
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      'no-negated-condition': 'off',
      'require-unicode-regexp': 'off',
      'arrow-body-style': 'off',
      'prefer-named-capture-group': 'off',
      'no-plusplus': 'off',
      'complexity': 'off',
      '@typescript-eslint/max-params': 'off',
      'max-lines': 'off',
      'max-nested-callbacks': 'off',
      '@typescript-eslint/init-declarations': 'off',
      'prefer-template': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
    },
  },
  // Must stay last so it can switch off formatting rules from the configs above.
  { ...prettier, files: ['src/**/*.{ts,tsx,js}'] },
]
