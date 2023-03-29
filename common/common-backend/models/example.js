const mongoose = require('mongoose')

const exampleSchema = new mongoose.Schema({
	// TODO
})

exampleSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('example', exampleSchema)