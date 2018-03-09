module.exports = {
  extends: 'airbnb-base',
  env: {
    mocha: true
  },
  rules: {
    'no-console': 'off',
    'arrow-parens': 0,
    'comma-dangle': 0,
    'prefer-destructuring': ['error', { object: false, array: false }],
    "no-shadow": [2, {"allow": ["err"]}]
  }
};
