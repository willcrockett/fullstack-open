
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


/* ---------------------------- Controllers ---------------------------- */
const update = (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
}

/* -------------------------------------------------------------------------- */
/*                               RESTful Routes                               */
/* -------------------------------------------------------------------------- */

/* ----------------------- 3.1 Route: GET all persons ----------------------- */
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

/* ------------------------ 3.2 Route: GET info page ------------------------ */
app.get('/info', (req, res) => {
  Person.count({})
        .then(personCount => {
                const infoBody = `<p>Phonebook has info for ${personCount} people</p>
                                  <p>${new Date()}</p>`
                res.send(infoBody)
  })
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
    app.put('/api/persons/:id', update)
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

/* ------------------------------ Update Person ----------------------------- */
app.put('/api/persons/:id', update)

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    res.status(400).send('malformed id')
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

/* -------------------------------------------------------------------------- */
/* ------------------------------- Server shit ------------------------------ */
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
