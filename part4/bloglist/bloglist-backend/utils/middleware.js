const logger = require('./logger')

const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path:  ', request.path)
	logger.info('Body:  ', request.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)
	// if (error.name === 'CastError') {
	// 	return response.status(400).send({ error: 'malformatted id' })
	// } else if (error.name === 'ValidationError') {
	// 	return response.status(400).json({ error: error.message })
	// } else if (error.name === 'JsonWebTokenError') {
	// 	return response.status(400)
	// }

	let errorMsg
	switch (error.name) {
	case 'CastError':
		errorMsg = 'malformatted id'
		break
	case 'ValidationError':
	case 'JsonWebTokenError':
		errorMsg = error.message
		break
	default:
		next(error)
	}
	return response.status(400).json({ error: errorMsg })
}

const tokenExtractor = (req, res, next) => {
	const auth = req.get('authorization')
	if (auth && auth.startsWith('Bearer ')) {
		req.token = auth.replace('Bearer ', '')
	}
	next()
}
module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor
}
