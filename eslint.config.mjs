import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  vue: true,

  ignores: [
    '_apps/**',
    'node_modules/**',
    'dist/**',
    'logs/**',
    'runtime/**',
    '**/assets/**',
    '**/public/**',
  ],
}, {
  rules: {
    // 'vue/multi-word-component-names': 'off',
    // 'unused-imports/no-unused-imports': 'off',
    // 'unused-imports/no-unused-vars': 'off',
  },
})
