const express = require('express')
const morgan = require('morgan')
const path = require('path')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('post-body', request => request.method === 'POST' ? JSON.stringify(request.body || {}) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-body'))

app.get('/api/persons', async (_request, response, next) => {
  try {
    response.json(await Person.find({}))
  } catch (error) { next(error) }
})

app.get('/info', async (_request, response, next) => {
  try {
    const count = await Person.countDocuments({})
    response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date().toString()}</p>`)
  } catch (error) { next(error) }
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    if (!person) return response.status(404).end()
    response.json(person)
  } catch (error) { next(error) }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) { next(error) }
})

app.post('/api/persons', async (request, response, next) => {
  try {
    const { name, number } = request.body || {}
    if (typeof name !== 'string' || !name.trim() || typeof number !== 'string' || !number.trim()) {
      return response.status(400).json({ error: 'name or number missing' })
    }
    const existing = await Person.findOne({ name: name.trim() })
    if (existing) return response.status(400).json({ error: 'name must be unique' })
    const saved = await new Person({ name: name.trim(), number: number.trim() }).save()
    response.status(201).json(saved)
  } catch (error) { next(error) }
})

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const { name, number } = request.body || {}
    const updated = await Person.findByIdAndUpdate(
      request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' }
    )
    if (!updated) return response.status(404).end()
    response.json(updated)
  } catch (error) { next(error) }
})

app.use((request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
})

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error)
  if (error.name === 'CastError') return response.status(400).json({ error: 'malformatted id' })
  if (error.name === 'ValidationError') return response.status(400).json({ error: error.message })
  console.error(error)
  response.status(500).json({ error: 'internal server error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
