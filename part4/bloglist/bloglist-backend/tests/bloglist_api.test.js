const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

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
	})

	afterAll(async () => {
		await mongoose.connection.close()
	})
})
