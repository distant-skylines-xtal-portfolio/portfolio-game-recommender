module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier' // Add prettier as a plugin
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // Integrate prettier
  ],
  rules: {
    // Your custom ESLint rules here
  }
};