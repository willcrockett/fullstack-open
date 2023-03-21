require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')
const cors = require('cors')
/* -------------------------------------------------------------------------- */
/*                                 Middleware                                 */
/* -------------------------------------------------------------------------- */
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// middleware that catches requests made to nonexistent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))
app.use(cors())


/* -------------------------------------------------------------------------- */
/*                               Helper and Data                              */
/* -------------------------------------------------------------------------- */



const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n=>n.id)) // ?
  : 0
  /**
   * ? max finds the max of any amount of individual numbers passed into it, but it doesn't work on arrays
   * ? ...notes transforms notes array into individual numbers
   */
  return maxId + 1
}



/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------- GET Root -------------------------------- */
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>') 
  /** 
   * * Since send parameter is a string, express automatically
   * * sets Content-Type header to text/html. Status code defaults to 200
   */
})

/* ------------------------------ GET All Notes ----------------------------- */
app.get('/api/notes/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

/* ---------------------------- GET Specific note --------------------------- */
app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})
/* ------------------------------- DELETE Note ------------------------------ */
app.delete('/api/notes/:id', (request, response) => {
  Note.

  response.status(204).end() /* no clear precendent for status code for failed delete
                              only two options 204 and 404. using 204 for F&S for simpliciity */
})

/* ------------------------------ POST new note ----------------------------- */
app.post('/api/notes', (request, response) => {
  const body = request.body 
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => response.json(savedNote))

})

app.use(unknownEndpoint)
/* -------------------------------------------------------------------------- */
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})