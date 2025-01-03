const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

const log = morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.data(req, res)
    ].join(' ')
  })

app.use(log)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const qtyRecords = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${qtyRecords} ${qtyRecords > 1 ? 'people' : 'person'} </p><p> ${date} </p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id )
    if (person) {
        response.json(person)
    } else {
        response.status(404).send(`Person with id ${id} not found`)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id )
    if (person) {
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    } else {
        response.status(404).send(`Person with id ${id} not found`)
    }
})

const generateId = () => {
    return String(Math.floor(Math.random() * 999999999999))
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'Name or number missing' 
        })
    }    

    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({ 
          error: 'Name must be unique' 
        })
    }

    const person = {
        id: generateId(),        
        name: body.name,
        number: body.number,
    }
  
    persons = persons.concat(person)  
    console.log(person)
  
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})