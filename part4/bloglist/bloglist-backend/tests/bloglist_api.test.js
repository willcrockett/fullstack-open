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
	await User.deleteMany({})

	// Create blogs without user
	await Blog.deleteMany({})
	await Blog.insertMany(helper.initialBlogs)
}, 100000)
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
		let headers
		beforeEach(async () => {
			const passwordHash = await bcrypt.hash('secretpass', 10)
			const user = new User({
				username: 'root',
				name: 'root user',
				passwordHash
			})

			const savedUser = await user.save()

			const userForToken = {
				username: savedUser.username,
				id: savedUser._id
			}

			const token = jwt.sign(userForToken, process.env.SECRET)

			headers = {
				Authorization: `Bearer ${token}`
			}
		}, 100000)

		test('succeeds with valid data and token', async () => {
			const newBlog = {
				title: 'New blog test',
				author: 'Jest test',
				url: 'www.wbr!.com',
				likes: 3
			}

			const res = await api
				.post('/api/blogs')
				.send(newBlog)
				.set(headers)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

			const titles = blogsAtEnd.map(({ title }) => {
				return title
			})
			expect(titles).toContain(newBlog.title)
		})

		test('like default value 0', async () => {
			const newBlog = {
				title: 'New blog test',
				author: 'Jest test',
				url: 'www.wbr!.com'
			}

			const res = await api
				.post('/api/blogs')
				.send(newBlog)
				.set(headers)
				.expect(201)
				.expect('Content-Type', /application\/json/)

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

			await api.post('/api/blogs').send(noUrlBlog).set(headers).expect(400)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		}, 100000)

		test('fails with status code 400 if no title', async () => {
			const noTitleBlog = {
				author: 'Jest test',
				url: 'www.wbr!.com',
				likes: 3
			}

			const res = await api
				.post('/api/blogs')
				.send(noTitleBlog)
				.set(headers)
				.expect(400)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		})
	})
})
describe('deletion of a blog', () => {
	let headers
	let savedUserId
	let user
	beforeEach(async () => {
		const passwordHash = await bcrypt.hash('secretpass', 10)
		user = new User({
			username: 'root',
			name: 'root user',
			passwordHash
		})

		let savedUser = await user.save()
		savedUserId = savedUser._id
		const userForToken = {
			username: savedUser.username,
			id: savedUserId
		}

		const token = jwt.sign(userForToken, process.env.SECRET)

		headers = {
			Authorization: `Bearer ${token}`
		}
	}, 100000)

	test('succeeds with status code 204 if id and token are valid', async () => {
		// Add blog as logged in user
		const newBlog = new Blog({
			title: 'Delete blog test',
			author: 'Jest test',
			url: 'www.wbr!.com',
			likes: 3,
			user: savedUserId
		})

		const savedBlog = await newBlog.save()
		user.blogs.concat(savedBlog._id)
		await user.save()

		// Delete previously added blog
		const blogsAtStart = await helper.blogsInDb()
		expect(blogsAtStart).toHaveLength(helper.initialBlogs.length + 1)
		await api.delete(`/api/blogs/${savedBlog.id}`).set(headers).expect(204)

		//FIXME failing every third run. suspect missing await somewhere
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
		expect(blogsAtEnd).not.toContainEqual(savedBlog)
	}, 100000)

	test('should 401 if blog does not belong to requesting user', async () => {
		const passwordHash = await bcrypt.hash('secretpass', 10)
		const dummyUser = new User({
			username: 'dummy',
			name: 'dummy user',
			passwordHash
		})

		let savedDummyUser = await dummyUser.save()

		const userForToken = {
			username: savedDummyUser.username,
			id: savedDummyUser._id
		}

		const dummyBlog = {
			title: 'dummy blog',
			author: 'dummy author',
			url: 'dummyurl.org',
			likes: 2
		}

		const dummyToken = jwt.sign(userForToken, process.env.SECRET)

		const dummyPostRes = await api
			.post('/api/blogs')
			.send(dummyBlog)
			.set('Authorization', 'Bearer ' + dummyToken)
			.expect(201)

		const savedDummyBlog = dummyPostRes.body
		const blogsAtStart = await helper.blogsInDb()

		const res = await api
			.delete(`/api/blogs/${savedDummyBlog.id}`)
			.set(headers)
			.expect(401)
			.expect('Content-Type', /application\/json/)

		expect(res.body.error).toBe(`Not authorized for ${savedDummyBlog.id}`)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})

	test('should 400 if blog does not exist', async () => {
		const nonexistingId = helper.nonExistingBlogId()

		await api.delete(`/api/blogs/${nonexistingId}`).set(headers).expect(400)
	})
}, 100000)

describe('updating a blog', () => {
	let headers
	let savedUserId
	let user
	beforeEach(async () => {
		const passwordHash = await bcrypt.hash('secretpass', 10)
		user = new User({
			username: 'root',
			name: 'root user',
			passwordHash
		})

		let savedUser = await user.save()
		savedUserId = savedUser._id
		const userForToken = {
			username: savedUser.username,
			id: savedUserId
		}

		const token = jwt.sign(userForToken, process.env.SECRET)

		headers = {
			Authorization: `Bearer ${token}`
		}
	}, 100000)

	test('should succeed on update with status 200 if valid data', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const newBlog = {
			title: 'Update blog test',
			author: 'Jest test',
			url: 'www.wbr!.com',
			likes: 3,
			user: savedUserId
		}

		const savedBlog = await new Blog(newBlog).save()
		user.blogs.concat(savedBlog._id)
		await user.save()

		const updatedBlog = {
			...newBlog,
			likes: newBlog.likes + 1
		}

		await api
			.put(`/api/blogs/${savedBlog.id}`)
			.send(updatedBlog)
			.set(headers)
			.expect(200)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).not.toContainEqual(newBlog)
		expect(blogsAtEnd).toContainEqual({ ...updatedBlog, id: savedBlog.id })
	})

	test('should 401 on update if blog does not belong to requesting user', async () => {
		const passwordHash = await bcrypt.hash('secretpass', 10)
		const dummyUser = new User({
			username: 'dummy',
			name: 'dummy user',
			passwordHash
		})

		let savedDummyUser = await dummyUser.save()

		const userForToken = {
			username: savedDummyUser.username,
			id: savedDummyUser._id
		}

		const dummyBlog = {
			title: 'dummy blog',
			author: 'dummy author',
			url: 'dummyurl.org',
			likes: 2
		}

		const dummyToken = jwt.sign(userForToken, process.env.SECRET)

		const dummyPostRes = await api
			.post('/api/blogs')
			.send(dummyBlog)
			.set('Authorization', 'Bearer ' + dummyToken)
			.expect(201)

		const savedDummyBlog = dummyPostRes.body
		const blogsAtStart = await helper.blogsInDb()
		const updatedBlog = {
			...dummyBlog,
			likes: dummyBlog.likes + 1
		}
		const res = await api
			.put(`/api/blogs/${savedDummyBlog.id}`)
			.send(updatedBlog)
			.set(headers)
			.expect(401)
			.expect('Content-Type', /application\/json/)

		expect(res.body.error).toBe(`Not authorized for ${savedDummyBlog.id}`)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
}, 1000000)
