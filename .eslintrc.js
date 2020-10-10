module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-mutating-props': 0,
    'handle-callback-err': 0
  }
}
