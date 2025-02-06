module.exports = {
  "extends": [
    "eslint-config-core3"
  ],
  rules: {
    'no-plusplus': 'off',
    'no-restricted-globals': 'off',
    'no-unused-expressions': 'off',
    'default-case': 'off',

  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@Shared', './src/shared'],
          ['@Constants', './src/constants.js'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json']
      }
    }
  }
}

