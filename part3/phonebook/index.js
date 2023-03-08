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


/* -------------------------------------------------------------------------- */
/*                               RESTful Routes                               */
/* -------------------------------------------------------------------------- */

/* ----------------------------- GET All Persons ---------------------------- */
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

/* -------------------------------- GET Info -------------------------------- */
app.get('/info', (request, response) => {
  const infoBody = `<p>Phonebook has info for ${persons.length} people</p>
                    <p>${new Date()}</p>`
  response.send(infoBody)
})

/* -------------------------------------------------------------------------- */
/* ------------------------------- Server shit ------------------------------ */
const PORT = 3001
app.listen(PORT)
console.log('Server started');
