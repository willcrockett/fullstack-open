const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

describe('when there is initially one user at db', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash('secretpass', 10)
		const user = new User({ username: 'root', name: 'root user', passwordHash })

		await user.save()
	})

	test('should succeed when creating with fresh username', async () => {
		const usersAtStart = await helper.usersInDb()
		const newUser = {
			username: 'newuser',
			name: 'New User',
			password: 'newuserpass'
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map((u) => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('should 400 when username is taken', async () => {
		const usersAtStart = await helper.usersInDb()
		const takenUsernameUser = {
			username: 'root',
			name: 'bad user',
			password: 'baduserpass'
		}

		const res = await api
			.post('/api/users')
			.send(takenUsernameUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(res.body.error).toContain('expected `username` to be unique')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	test('should 400 with proper error message if request missing username', async () => {
		const usersAtStart = await helper.usersInDb()

		const noUsernameUser = {
			name: 'No Username',
			password: 'nousername'
		}

		const res = await api
			.post('/api/users')
			.send(noUsernameUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(res.body.error).toContain('`username` is required')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	test('should 400 with proper error message if request missing password', async () => {
		const usersAtStart = await helper.usersInDb()

		const noPasswordUser = {
			username: 'Nopassword',
			name: 'No Password'
		}

		const res = await api
			.post('/api/users')
			.send(noPasswordUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(res.body.error).toContain('`password` is required')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	test('should 400 with proper error message if username too short', async () => {
		const usersAtStart = await helper.usersInDb()

		const shortUsernameUser = {
			username: 'su',
			name: 'Short username',
			password: 'shortusename'
		}

		const res = await api
			.post('/api/users')
			.send(shortUsernameUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(res.body.error).toContain(
			`(\`${shortUsernameUser.username}\`) is shorter than the minimum allowed length (3)`
		)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	test('should 400 with proper error message if password too short', async () => {
		const usersAtStart = await helper.usersInDb()

		const shortPasswordUser = {
			username: 'Shortpassword',
			name: 'Short username',
			password: 'sp'
		}

		const res = await api
			.post('/api/users')
			.send(shortPasswordUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(res.body.error).toContain(
			`(\`${shortPasswordUser.password}\`) is shorter than the minimum allowed length (3)`
		)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})

	describe('handling logins', () => {
		test('should succeed with proper token on good login', async () => {
			const user = {
				username: 'root',
				password: 'secretpass'
			}

			await api
				.post('/api/login')
				.send(user)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			// TODO: implement testing the token returned
		})

		test('should fail with proper status and error on bad password', async () => {
			const user = {
				username: 'root',
				password: 'badsecretpass'
			}

			const res = await api
				.post('/api/login')
				.send(user)
				.expect(401)
				.expect('Content-Type', /application\/json/)

			expect(res.body.error).toEqual('invalid username and/or password')
		})

		test('should fail with proper status and error on bad username', async () => {
			const user = {
				username: 'badroot',
				password: 'secretpass'
			}

			const res = await api
				.post('/api/login')
				.send(user)
				.expect(401)
				.expect('Content-Type', /application\/json/)

			expect(res.body.error).toEqual('invalid username and/or password')
		})
	})
})
