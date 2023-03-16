const express = require('express')
const cors = require('cors')
const app = express()


/**
 * * You can use multple middleware at the same time. They get run in the order express took them in.
 * * Express takes in middleware like so:
 *  app.use(middleWare)
 * * Middleware functions have to be taken into express before routes are defined for them to run
 * * before route event handlers are ran. However, sometimes the middleware should be ran after
 * * the route event handlers, in which case express should take them in after the routes.
 * * A middleware is a function with 3 parameters
 */
/* ------------------------------- Middleware ------------------------------- */
/**
 * requestLogger
 * * Prints info about every request sent to server
 * @param request The request sent to server
 * @param response The response sent to client
 * @param next Function that yields to the next middleware
 */
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
/** enables json-parser.
  * * json-parser transforms json data recieved in requets into javascript
  * * objects and attaches it to body property of request object before
  * * route handler is called
  * * json-parser is a 'middleware'. Middleware are functions that handle
  * * request and response objects
  */
app.use(requestLogger)
/** Express notes
 * Express is the most popular node library that aims
 * to make server-side development in Node easier than
 * working with node's built-in http module by providing
 * better abstractions
 * 
 * Its source code is found in node_modules directory, along with
 * any the source code for any other dependecies, including
 * dependencies express itself may have 
 * (called transiitve dependencies
 * 
 * dependecy listed in package.json like so:
 *  "express": "^4.18.2" (major.minor.patch)
 * the carat (^) means when dependencies of server
 * are installed, express version will be at least
 * 4.18.2, but the patch number (2) and minor number (18) can be
 * larger. However, the major number (4) must be exactly as listed
 * 
 * Update all dependencies with:
 *  npm update
 * When working on project in new environment, install all
 * dependencies needed with:
 *  npm install
 */
app.use(express.static('build'))
app.use(cors())
/* -------------------------------------------------------------------------- */
/*                               Helper and Data                              */
/* -------------------------------------------------------------------------- */
/** 
 * Primary purpose of the backend server in this course is to send
 * raw json data to the frontend, so we define the json here
 */


let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

const generateId = () => {
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n=>n.id)) // ?
  : 0
  /**
   * ? max finds the max of any amount of invididual numbers passed into it, but it doesnt work on arrays
   * ? ...notes transforms notes array into invidual numbers
   */
  return maxId + 1
}



/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------- GET Root -------------------------------- */
app.get('/', (request, response) => {
  /**¸
   * Event handler takes two params: request, response
   *  request: All of the information of the HTTP GET request
   *  response: used to define how the the request is responded to
   */
  response.send('<h1>Hello World!</h1>') 
  /** 
   * * Since send parameter is a string, express automatically
   * * sets Content-Type header to text/html. Status code defaults to 200
   */
})

/* ------------------------------ GET All Notes ----------------------------- */
app.get('/api/notes/', (request, response) => {
  response.json(notes) 
  /**
   * response.json(x) sends a json formatted string derived from object x with
   * Content-Type header automatically set to application/json
   * 
   * If we were still using base node, we'd have to do response.end(JSON.stringify(notes)) instead
   */
})

/* ---------------------------- GET Specific note --------------------------- */
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => {
    console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })
  console.log(note)
  if (note) {
    response.json(note)
  } else { // handle attempted retrieval of nonexistent note
    response.status(404).end()
    // end() responds to request without attaching any data
  }
})
/* ------------------------------- DELETE Note ------------------------------ */
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(n => n.id !== id)

  response.status(204).end() /* no clear precendent for status code for failed delete
                              only two options 204 and 404. using 204 for F&S for simpliciity */
})

/* ------------------------------ POST new note ----------------------------- */
app.post('/api/notes', (request, response) => {
  const note = request.body // only possible because of json-parser. body would be undefined otherwise
  console.log(note)
  response.json(note)
  
})

app.use(unknownEndpoint)
/* -------------------------------------------------------------------------- */

const PORT = process.env.PORT || 3001app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})