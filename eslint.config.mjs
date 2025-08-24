import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,

  ignores: [
    'public/**',
    'node_modules/**',
    'dist/**',
    'logs/**',
    'runtime/**',
    '**/static/**',
    '**/asserts/**',
    '**/*.d.ts',
    '.gitignore',
    'pnpm-lock.yaml',
    'package-lock.json',
    // FIXME: 需要支持
    '**/*.pug',
  ],
}, {
  rules: {
    'vue/multi-word-component-names': 'off',
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
})
