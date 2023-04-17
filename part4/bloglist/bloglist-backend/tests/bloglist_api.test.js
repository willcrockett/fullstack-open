const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const { application } = require('express')

beforeEach(async () => {
	// Create a root user
	await User.deleteMany({})

	// Create blogs without user
	await Blog.deleteMany({})
	const noteObjects = helper.initialBlogs.map((blog) => new Blog(blog))
	const promiseArray = noteObjects.map((blog) => blog.save())
	await Promise.all(promiseArray)
}, 1000000)
describe('when there is initially some saved blogs by dummy user', () => {
	describe('viewing all blogs', () => {
		test('all blogs returned in json format', async () => {
			await api
				.get('/api/blogs')
				.expect(200)
				.expect('Content-Type', /application\/json/)
		})

		test('all blogs are returned', async () => {
			const res = await api.get('/api/blogs')

			expect(res.body).toHaveLength(helper.initialBlogs.length)
		})

		test('blog uid property named id', async () => {
			const res = await helper.blogsInDb()

			res.forEach((blog) => {
				expect(blog.id).toBeDefined()
				expect(blog._id).not.toBeDefined()
			})
		})
	})

	describe('viewing a specific blog', () => {
		test('should succeed with valid id', async () => {
			const blogs = await helper.blogsInDb()
			let blogToFind = blogs[0]

			const resBlog = await api
				.get(`/api/blogs/${blogToFind.id}`)
				.expect(200)
				.expect('Content-Type', /application\/json/)

			expect(resBlog.body).toEqual(blogToFind)
		})

		test('should 404 if blog does not exist', async () => {
			const validNonexistingId = await helper.nonExistingBlogId()
			await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
		})

		test('should 400 if id is invalid', async () => {
			const invalidId = 'notarealid123456789'
			await api.get(`/api/blogs/${invalidId}`).expect(400)
		})
	})

	describe('adding a new blog', () => {
		let savedUser
		beforeEach(async () => {
			await User.deleteMany({})

			const passwordHash = await bcrypt.hash('secretpass', 10)
			const user = new User({
				username: 'root',
				name: 'root user',
				passwordHash
			})
			savedUser = await user.save()
		}, 100000)
		test('succeeds with valid data and token', async () => {
			const newBlog = {
				title: 'New blog test',
				author: 'Jest test',
				url: 'www.wbr!.com',
				likes: 3
			}

			const userForToken = {
				username: savedUser.username,
				id: savedUser._id
			}

			const token = jwt.sign(userForToken, process.env.SECRET)

			const res = await api
				.post('/api/blogs')
				.send(newBlog)
				.set('Authorization', 'Bearer ' + token)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

			const blogsFiltered = blogsAtEnd.map(({ user }) => {
				return user
			})
			expect(blogsFiltered).toContainEqual(savedUser._id)
		})

		test('should fail with proper status and error when token is forged', async () => {
			const newBlog = {
				title: 'New blog test',
				author: 'Jest test',
				url: 'www.wbr!.com',
				likes: 3
			}

			const userForToken = {
				username: savedUser.username,
				id: savedUser._id
			}

			const token = jwt.sign(userForToken, 'nottherealsecretkey')

			const res = await api
				.post('/api/blogs')
				.send(newBlog)
				.set('Authorization', 'Bearer ' + token)
				.expect(400)
				.expect('Content-Type', /application\/json/)

			expect(res.body.error).toBe('invalid signature')

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		})

		test('should fail with proper status and error when token not found', async () => {
			const newBlog = {
				title: 'New blog test',
				author: 'Jest test',
				url: 'www.wbr!.com',
				likes: 3
			}

			const userForToken = {
				username: 'randomname'
			}

			const token = jwt.sign(userForToken, process.env.SECRET)

			const res = await api
				.post('/api/blogs')
				.send(newBlog)
				.set('Authorization', 'Bearer ' + token)
				.expect(401)
				.expect('Content-Type', /application\/json/)

			expect(res.body.error).toBe('token invalid')

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		}, 100000)

		test('like default value 0', async () => {
			const newBlog = {
				title: 'New blog test',
				author: 'Jest test',
				url: 'www.wbr!.com'
			}

			const userForToken = {
				username: savedUser.username,
				id: savedUser._id
			}

			const token = jwt.sign(userForToken, process.env.SECRET)

			const res = await api
				.post('/api/blogs')
				.send(newBlog)
				.set('Authorization', 'Bearer ' + token)

			expect(res.body).toHaveProperty('likes', 0)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
		})

		test('fails with status code 400 if no url', async () => {
			const noUrlBlog = {
				title: 'New blog test',
				author: 'Jest test',
				likes: 3
			}

			const userForToken = {
				username: savedUser.username,
				id: savedUser._id
			}

			const token = jwt.sign(userForToken, process.env.SECRET)

			await api
				.post('/api/blogs')
				.send(noUrlBlog)
				.expect(400)
				.set('Authorization', 'Bearer ' + token)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		}, 100000)

		test('fails with status code 400 if no title', async () => {
			const noTitleBlog = {
				author: 'Jest test',
				url: 'www.wbr!.com',
				likes: 3
			}

			const userForToken = {
				username: savedUser.username,
				id: savedUser._id
			}

			const token = jwt.sign(userForToken, process.env.SECRET)

			await api
				.post('/api/blogs')
				.send(noTitleBlog)
				.set('Authorization', 'Bearer ' + token)
				.expect(400)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		})
	})
	afterAll(async () => {
		await Blog.deleteMany({})
		await User.deleteMany({})
	})
})
describe('deletion of a blog', () => {
	let headers

	beforeEach(async () => {
		const newUser = {
			username: 'root',
			name: 'root',
			password: 'password'
		}

		logger.info(await api.post('/api/users').send(newUser))

		const result = await api.post('/api/login').send({
			username: 'root',
			password: 'password'
		})

		headers = {
			Authorization: `Bearer ${result.body.token}`
		}
	}, 1000000)
	test('succeeds with status code 204 if id and token are valid', async () => {
		const newBlog = {
			title: 'New blog test',
			author: 'Jest test',
			url: 'www.wbr!.com',
			likes: 3
		}

		await api.post('/api/blogs').send(newBlog).set(headers).expect(201)

		const allBlogs = await helper.blogsInDb()
		const blogToDelete = allBlogs.find((blog) => blog.title === newBlog.title)

		await api.delete(`/api/blogs/${blogToDelete.id}`).set(headers).expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
		expect(blogsAtEnd).not.toContainEqual(blogToDelete)
	}, 100000)

	test('should fail if blog does not belong to requesting user', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const fakeUserForToken = {
			username: 'fakeuser',
			id: helper.nonExisitingUserId
		}

		const token = jwt.sign(fakeUserForToken, process.env.SECRET)

		const res = await api
			.delete(`/api/blogs/${savedBlog._id}`)
			.set('Authorization', 'Bearer ' + token)
			.expect(401)
			.expect('Content-Type', /application\/json/)

		expect(res.body.error).toBe(`Not authorized for ${blogToDelete}`)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})
}, 100000)

describe('updating a blog', () => {
	test.skip('should succeed with status 200 if valid data', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		let updatedBlog = { ...blogToUpdate }
		updatedBlog.likes += 1

		await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog).expect(200)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		expect(blogsAtEnd).not.toContainEqual(blogToUpdate)
		expect(blogsAtEnd).toContainEqual(updatedBlog)
	})
})

describe('Deletion of a blog', () => {
	let headers

	beforeEach(async () => {
		const newUser = {
			username: 'root',
			name: 'root',
			password: 'password'
		}

		await api.post('/api/users').send(newUser)

		const result = await api.post('/api/login').send(newUser)

		headers = {
			Authorization: `Bearer ${result.body.token}`
		}
	}, 100000)

	test('succeeds with status code 204 if id is valid', async () => {
		const newBlog = {
			title: 'The best blog ever',
			author: 'Me',
			url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
			likes: 12
		}

		await api.post('/api/blogs').send(newBlog).set(headers).expect(201)

		const allBlogs = await helper.blogsInDb()
		const blogToDelete = allBlogs.find((blog) => blog.title === newBlog.title)

		await api.delete(`/api/blogs/${blogToDelete.id}`).set(headers).expect(204)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

		const contents = blogsAtEnd.map((r) => r.title)

		expect(contents).not.toContain(blogToDelete.title)
	})
}, 1000000)

afterAll(async () => {
	await mongoose.connection.close()
}, 1000000)
