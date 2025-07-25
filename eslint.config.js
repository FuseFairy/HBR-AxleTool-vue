import eslintPluginVue from 'eslint-plugin-vue';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: ["dist/*", "node_modules/*", "minify-json.js", ".git/*", ".vscode/*"],
  },
  js.configs.recommended,
  ...eslintPluginVue.configs['flat/recommended'],
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        'browser': true,
        'node': true,
        'es2021': true,
        'process': 'readonly',
        'console': 'readonly',
        'window': 'readonly',
        'document': 'readonly',
        'navigator': 'readonly',
        'localStorage': 'readonly',
        'sessionStorage': 'readonly',
        'fetch': 'readonly',
        'URLSearchParams': 'readonly',
        'setTimeout': 'readonly',
        'clearTimeout': 'readonly',
        'IntersectionObserver': 'readonly',
        'ClipboardItem': 'readonly',
        'Blob': 'readonly',
        'FileReader': 'readonly',
        'AbortController': 'readonly',
        'alert': 'readonly'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'warn'
    }
  }
];
