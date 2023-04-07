const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

/* ----------------------------- Fetch all users ---------------------------- */
userRouter.get('/', async (req, res) => {
	const users = await User.find({}).populate('blogs', {
		title: 1,
		author: 1,
		url: 1
	})
	res.json(users)
})

/* ----------------------------- Create new user ---------------------------- */
userRouter.post('/', async (req, res) => {
	const { username, name, password } = req.body
	if (password === undefined) {
		res.status(400).json({ error: '`password` is required' })
	} else if (password.length < 3) {
		res.status(400).json({
			error: `(\`${password}\`) is shorter than the minimum allowed length (3)`
		})
	}
	const passwordHash = await bcrypt.hash(password, 10)

	const user = new User({
		username,
		name,
		passwordHash
	})

	const savedUser = await user.save()

	res.status(201).json(savedUser)
})

module.exports = userRouter
/**
 * TODO: 4.16: Add a feature which adds the following restrictions to creating new users: Both username and password must be given. Both username and password must be at least 3 characters long. The username must be unique. The operation must respond with a suitable status code and some kind of an error message if an invalid user is created.
 */
