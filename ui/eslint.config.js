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
      'no-void': 'off',
      // TODO fix these in follow ups
      '@typescript-eslint/explicit-function-return-type': 'off',

      // eslint-config-love@158 is far stricter than the v43 we came from. These
      // are disabled only to land the ESLint 10 upgrade with a clean run; the
      // counts are findings at migration time. Re-enable one at a time, most
      // valuable first (see the tracking issue).
      '@typescript-eslint/no-magic-numbers': 'off', // 668
      '@typescript-eslint/no-unnecessary-condition': 'off', // 52
      '@typescript-eslint/no-import-type-side-effects': 'off', // 46
      '@typescript-eslint/prefer-destructuring': 'off', // 46
      'require-unicode-regexp': 'off', // 24
      'no-negated-condition': 'off', // 24
      'arrow-body-style': 'off', // 23
      'prefer-named-capture-group': 'off', // 22
      'no-plusplus': 'off', // 21
      '@typescript-eslint/no-unsafe-type-assertion': 'off', // 20
      'eqeqeq': 'off', // 18
      'complexity': 'off', // 13
      'no-param-reassign': 'off', // 11
      '@typescript-eslint/no-unsafe-assignment': 'off', // 8
      '@typescript-eslint/prefer-regexp-exec': 'off', // 8
      '@typescript-eslint/no-inferrable-types': 'off', // 6
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off', // 5
      'no-console': 'off', // 5
      '@typescript-eslint/no-explicit-any': 'off', // 4
      '@typescript-eslint/max-params': 'off', // 4
      '@typescript-eslint/init-declarations': 'off', // 3
      '@typescript-eslint/no-useless-default-assignment': 'off', // 3
      'radix': 'off', // 3
      'no-useless-assignment': 'off', // 2
      '@typescript-eslint/no-unnecessary-type-conversion': 'off', // 2
      '@typescript-eslint/no-unnecessary-template-expression': 'off', // 2
      'prefer-template': 'off', // 2
      '@typescript-eslint/switch-exhaustiveness-check': 'off', // 2
      '@typescript-eslint/no-unnecessary-type-assertion': 'off', // 1
      '@typescript-eslint/no-unsafe-member-access': 'off', // 1
      '@typescript-eslint/strict-void-return': 'off', // 1
      'max-lines': 'off', // 1
      'max-nested-callbacks': 'off', // 1
    },
  },
  // Must stay last so it can switch off formatting rules from the configs above.
  { ...prettier, files: ['src/**/*.{ts,tsx,js}'] },
]
