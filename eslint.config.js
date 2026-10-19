import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettierConfig from 'eslint-config-prettier'

export default [
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            '.vitepress/dist/**',
            '.vitepress/cache/**',
            'coverage/**',
            'posts/**',
            'pages/**',
            'test-results.xml'
        ]
    },
    ...pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.{ts,vue}'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue']
            }
        },
        plugins: {
            '@typescript-eslint': tsPlugin
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/no-v-html': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    prettierConfig
]
