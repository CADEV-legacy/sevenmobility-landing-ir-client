module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {},
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['**/*.ts', '**/*.tsx'],
    },
  },
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          ['sibling', 'parent', 'index'],
          'internal',
          'type',
          'unknown',
        ],
        pathGroups: [
          {
            pattern: '{react*,react*/**,vite*,vite*/**}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**/*',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '#/**/*',
            group: 'internal',
            position: 'after',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['internal'],
      },
    ],
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
};
