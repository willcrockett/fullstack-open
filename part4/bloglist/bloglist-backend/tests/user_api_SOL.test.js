const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

const { initialUsers, usersInDb } = require('./test_helper')

let authHeader

describe('creation of a user', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		// create a test user and save the corresponding auth header
		const user = initialUsers[0]
		await api.post('/api/users').send(user)
		const response = await api.post('/api/login').send(user)
		authHeader = `Bearer ${response.body.token}`
	}, 100000)
	test('succeeds with valid username and password', async () => {
		const user = {
			username: 'mluukkai',
			password: 'secret'
		}

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const users = await usersInDb()

		expect(users).toHaveLength(initialUsers.length + 1)
		const usernames = users.map((u) => u.username)
		expect(usernames).toContain(user.username)
	})

	test('fails with a proper error if username is too short', async () => {
		const user = {
			username: 'ml',
			password: 'secret'
		}

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toContain(
			'`username` (`ml`) is shorter than the minimum allowed length (3)'
		)
	})

	test('fails with a proper error if password is too short', async () => {
		const user = {
			username: 'mluukka',
			password: 'se'
		}

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toContain(
			'`password` is shorter than the minimum allowed length (3)'
		)
	})

	test('fails with a proper error if username not unique', async () => {
		const user = initialUsers[0]

		const response = await api
			.post('/api/users')
			.send(user)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(response.body.error).toContain('expected `username` to be unique.')
	})
})
22
