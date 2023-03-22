
/* -------------------------------- Imports and Constants ------------------------------- */
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./modules/person')
const morgan = require('morgan')
const cors = require('cors')

/* ------------------------------- Middleware ------------------------------- */

morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms \n:body\n'))
app.use(express.static('build'))


/* ---------------------------- Helpers and Data ---------------------------- */
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => Math.floor(Math.random() * 10000)
/* -------------------------------------------------------------------------- */
/*                               RESTful Routes                               */
/* -------------------------------------------------------------------------- */

/* ----------------------- 3.1 Route: GET all persons ----------------------- */
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

/* ------------------------ 3.2 Route: GET info page ------------------------ */
app.get('/info', (req, res) => {
  const infoBody = `<p>Phonebook has info for ${persons.length} people</p>
                    <p>${new Date()}</p>`
  res.send(infoBody)
})

/* ----------------------- 3.3: route GET person by id ---------------------- */
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
        .then(person => res.json(person))
        .catch(error => next(error))
})

/* --------------------- 3.4 Route: DELETE person by id --------------------- */
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
        .then(result => res.status(204).end())
        .catch(error => next(error))
})

/* ----------------------- 3.5 Route: POST new person ----------------------- */
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  } else if (persons.some(p => p.name.toUpperCase() == body.name.toUpperCase())) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
        .then(savedPerson => {
          console.log('Person saved to MongoDB')
          res.json(savedPerson)
        })
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    res.status(400).send('malformed id')
  }
  next(error)
}
app.use(errorHandler)

/* -------------------------------------------------------------------------- */
/* ------------------------------- Server shit ------------------------------ */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
