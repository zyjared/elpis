import { defineRouter } from '@elpis/core'

export default defineRouter((app, router) => {
  const { example } = app.controller
  router.get('/api/example/table', example.getTableRows.bind(example))
  router.get('/api/example/search', example.searchTableRows.bind(example))
  router.post('/api/example/add', example.addTableRow.bind(example))
  router.post('/api/example/edit', example.editTableRow.bind(example))
  router.post('/api/example/remove', example.removeTableRow.bind(example))
})
