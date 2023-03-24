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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))
app.use(cors())

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

/* ------------------------------ GET All Notes ----------------------------- */
app.get('/api/notes/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

/* ------------------------------ POST new note ----------------------------- */
app.post('/api/notes/', (request, response) => {
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

/* ---------------------------- GET Specific note --------------------------- */
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end() // no matching id
    }
  })
  .catch(error => next(error)) // malformed id
})

/* ------------------------------- DELETE Note ------------------------------ */
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
      .then(result => response.status(204).end())
      .catch(error => next(error))
})

/* ------------------------------- Update Note ------------------------------ */
app.put('/api/notes/:id', (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important,
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
      .then(updatedNote => res.json(updatedNote))
      .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

/* -------------------------------------------------------------------------- */
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})