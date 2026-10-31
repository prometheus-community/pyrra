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
    },
  },
  // Must stay last so it can switch off formatting rules from the configs above.
  { ...prettier, files: ['src/**/*.{ts,tsx,js}'] },
]
