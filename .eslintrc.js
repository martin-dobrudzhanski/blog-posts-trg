module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: ['standard', 'plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-tabs': 0,
    'semi': 0
  },
  globals: {},
  parserOptions: {
    parser: 'babel-eslint'
  }
}
