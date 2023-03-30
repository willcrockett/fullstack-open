const examplesRouter = require('express').Router()
const example = require('../models/example')

examplesRouter.get('/', (request, response) => {
	example.find({}).then(examples => {
		response.json(examples)
	})
})

examplesRouter.get('/:id', (request, response, next) => {
	example.findById(request.params.id)
		.then(example => {
			if (example) {
				response.json(example)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

// more routes

module.exports = examplesRouter