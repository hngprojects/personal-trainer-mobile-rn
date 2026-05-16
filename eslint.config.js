const expo = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  // Expo's opinionated React Native + TypeScript rules
  ...expo,
  // Disable ESLint rules that conflict with Prettier formatting
  prettierConfig,
  // Project-level overrides
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'warn',
      // @expo/vector-icons ships as a transitive expo dependency and is
      // resolved by the Metro bundler at runtime — not visible to the
      // Node-based ESLint resolver.
      'import/no-unresolved': ['error', { ignore: ['^@expo/vector-icons'] }],
    },
  },
  {
    ignores: ['dist/', 'android/', 'ios/', '.expo/', 'node_modules/'],
  },
];
