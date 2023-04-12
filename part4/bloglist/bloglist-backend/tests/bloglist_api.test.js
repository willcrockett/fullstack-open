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
describe('when there is initially some saved blogs', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await Blog.insertMany(helper.initialBlogs)
	})

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
	})

	describe('viewing a specific blog', () => {
		test('blog uid property named id', async () => {
			const res = await helper.blogsInDb()

			res.forEach((blog) => {
				expect(blog.id).toBeDefined()
				expect(blog._id).not.toBeDefined()
			})
		})
	})

	describe('when there is a logged in user', () => {
		let savedUser
		beforeEach(async () => {
			const rootUser = {
				username: 'root',
				password: 'secretpass'
			}

			await User.deleteMany({})

			const passwordHash = await bcrypt.hash('secretpass', 10)
			const user = new User({
				username: 'root',
				name: 'root user',
				passwordHash
			})
			savedUser = await user.save()
		}, 100000)

		describe('adding a new blog', () => {
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

		describe('deletion of a blog', () => {
			test.skip('succeeds with status code 204 if id is valid', async () => {
				const blogsAtStart = await helper.blogsInDb()
				const blogToDelete = blogsAtStart[0]

				await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

				const blogsAtEnd = await helper.blogsInDb()
				expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
				expect(blogsAtEnd).not.toContainEqual(blogToDelete)
			})
		})
		describe('updating a blog', () => {
			test.skip('should succeed with status 200 if valid data', async () => {
				const blogsAtStart = await helper.blogsInDb()
				const blogToUpdate = blogsAtStart[0]
				let updatedBlog = { ...blogToUpdate }
				updatedBlog.likes += 1

				await api
					.put(`/api/blogs/${blogToUpdate.id}`)
					.send(updatedBlog)
					.expect(200)

				const blogsAtEnd = await helper.blogsInDb()
				expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
				expect(blogsAtEnd).not.toContainEqual(blogToUpdate)
				expect(blogsAtEnd).toContainEqual(updatedBlog)
			})
		})
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
