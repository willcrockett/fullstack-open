const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	username: String,
	name: String,
	passwordHash: String
})

userSchema.set('toJson', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

const User = mongoose.model('User', userSchema)

module.exports = User
/**
 * TODO: 4.16: Add a feature which adds the following restrictions to creating new users: Both username and password must be given. Both username and password must be at least 3 characters long. The username must be unique. The operation must respond with a suitable status code and some kind of an error message if an invalid user is created.
 */
