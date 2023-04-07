const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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

	describe('addition of a new blog', () => {
		test('succeeds with valid data', async () => {
			const newBlog = {
				title: 'New blog test',
				author: 'Jest test',
				url: 'www.wbr!.com',
				likes: 3
			}

			await api
				.post('/api/blogs')
				.send(newBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

			const blogsFiltered = blogsAtEnd.map(({ title, author, url, likes }) => {
				return { title, author, url, likes }
			})
			expect(blogsFiltered).toContainEqual(newBlog)
		})

		test('like default value 0', async () => {
			const newBlog = {
				title: 'New blog test',
				author: 'Jest test',
				url: 'www.wbr!.com'
			}

			const res = await api.post('/api/blogs').send(newBlog)

			expect(res.body).toHaveProperty('likes', 0)
		})

		test('fails with status code 400 if no url', async () => {
			const noUrlBlog = {
				title: 'New blog test',
				author: 'Jest test',
				likes: 3
			}

			await api.post('/api/blogs').send(noUrlBlog).expect(400)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		})

		test('fails with status code 400 if no title', async () => {
			const noTitleBlog = {
				author: 'Jest test',
				url: 'www.wbr!.com',
				likes: 3
			}

			await api.post('/api/blogs').send(noTitleBlog).expect(400)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
		})
	})

	describe('deletion of a blog', () => {
		test('succeeds with status code 204 if id is valid', async () => {
			const blogsAtStart = await helper.blogsInDb()
			const blogToDelete = blogsAtStart[0]

			await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

			const blogsAtEnd = await helper.blogsInDb()
			expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
			expect(blogsAtEnd).not.toContainEqual(blogToDelete)
		})
	})
	describe('updating a blog', () => {
		test('should succeed with status 200 if valid data', async () => {
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

afterAll(async () => {
	await mongoose.connection.close()
})
