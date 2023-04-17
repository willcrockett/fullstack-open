const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
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

const getTokenFrom = (req) => {
	const auth = req.get('authorization')
	if (auth && auth.toLowerCase().startsWith('bearer ')) {
		return auth.substring(7)
	}
	return null
}

const tokenExtractor = (req, res, next) => {
	req.token = getTokenFrom(req)
	next()
}

const userExtractor = async (req, res, next) => {
	const token = getTokenFrom(req)
	if (token) {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!decodedToken.id) {
			return res.status(401).json({ error: 'token invalid' })
		}
		req.user = await User.findById(decodedToken.id)
	}
	next()
}
module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor
}
