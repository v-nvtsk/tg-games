import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import reactX from 'eslint-plugin-react-x'
import reactPlugin from 'eslint-plugin-react'
import stylistic from '@stylistic/eslint-plugin'


export default tseslint.config(
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  { ignores: ['dist', 'src/public'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-x': reactX,
      'react': reactPlugin,
      '@stylistic': stylistic,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.flat.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...reactX.configs['recommended-typescript'].rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-indent": ['error', 2],
      "indent": ["warn", 2],
      "semi": ["error"],
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
      "eol-last": 1,
      "@stylistic/space-infix-ops": "error",
      "@stylistic/function-call-spacing": ["error", "never"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "function", "next": "function" },
        { "blankLine": "always", "prev": "*", "next": "export" }
      ],
      "@stylistic/indent": ["error", 2, { "ignoredNodes": ["ConditionalExpression"] }],
      "@stylistic/keyword-spacing": "error",
      "@stylistic/newline-per-chained-call": ["error", { "ignoreChainWithDepth": 2 }],
      "@stylistic/type-annotation-spacing": "error",
      "@stylistic/key-spacing": ["error", { "afterColon": true }],
      "@stylistic/comma-spacing": ["error", { "before": false, "after": true }],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/no-multi-spaces": "error",
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/space-in-parens": ["error", "never"],
      "@stylistic/jsx-equals-spacing": [2, "never"],
      "@stylistic/arrow-parens": ["error", "always"],
      "@stylistic/arrow-spacing": "error",
      "@stylistic/quotes": ["error", "double"],
      "@typescript-eslint/no-unused-vars": "error",
    },
    settings: {
      "react": {
        "pragma": "React",
        "fragment": "Fragment",
        "version": "detect",
        "defaultVersion": "18",
      },
    },
  },
  {
    "files": ["**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
)
