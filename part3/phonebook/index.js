/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

/* -------------------------------- Libraries ------------------------------- */
const express = require('express')
const app = express()
app.use(express.json())

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

const generatxeId = () => Math.floor(Math.random * 10000)
/* -------------------------------------------------------------------------- */
/*                               RESTful Routes                               */
/* -------------------------------------------------------------------------- */

/* ----------------------- 3.1 Route: GET all persons ----------------------- */
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

/* ------------------------ 3.2 Route: GET info page ------------------------ */
app.get('/info', (request, response) => {
  const infoBody = `<p>Phonebook has info for ${persons.length} people</p>
                    <p>${new Date()}</p>`
  response.send(infoBody)
})

/* ----------------------- 3.3: route GET person by id ---------------------- */
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(n => n.id === id)
  console.log(person)
  if (person) {
    response.json(person)
  } else{
    response.status(404).end()
  }
})

/* --------------------- 3.4 Route: DELETE person by id --------------------- */
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log('delete')
  
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

/* ----------------------- 3.5 Route: POST new person ----------------------- */
app.post('/api/persons/:id', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(404).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  } else if (persons.some(p => p.name.toUpperCase() == body.name.toUpperCase())) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const id = generateId()
  const person = {
    name: body.name,
    number: body.number
  }
  console.log(person)

})
/* -------------------------------------------------------------------------- */
/* ------------------------------- Server shit ------------------------------ */
const PORT = 3001
app.listen(PORT)
console.log('Server started');
