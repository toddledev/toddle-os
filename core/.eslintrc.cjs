module.exports = {
  rules: {
    'no-restricted-imports': 'off',
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['**/worker/**'], allowTypeImports: true },
          { group: ['**/runtime/**'], allowTypeImports: true },
        ],
      },
    ],
  },
}
