module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // 自定义解析器需要与Eslint兼容
  parserOptions: {
    ecmaVersion: 2020, //es版本
    sourceType: 'module', // script
    ecmaFeatures: {
      jsx: true, // 额外语言特性
    },
  },
  // 共享设置，提供信息给规则
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  // 可用的环境变量
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  // 继承核心规则
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // Make sure this is always the last element in the array.
  ],
  // 插件，名字可以省略eslint-plugin-前缀
  plugins: ['simple-import-sort', 'prettier'],
  // 规则：off，warn、error
  rules: {
    // 定义插件中的规则——插件名/规则名
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
};
