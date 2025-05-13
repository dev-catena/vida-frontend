module.exports = {
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@babel/eslint-parser',
      requireConfigFile: false,
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    extends: [
      'plugin:vue/vue3-recommended',
      'eslint:recommended'
    ],
    env: {
      node: true,
      browser: true,
      es2020: true,
      'vue/setup-compiler-macros': true
    },
    globals: {
      process: 'readonly',
      __dirname: 'readonly',
      require: 'readonly',
      module: 'readonly'
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-undef': 'off',
      'vue/no-v-model-argument': 'off'
    }
  }
  