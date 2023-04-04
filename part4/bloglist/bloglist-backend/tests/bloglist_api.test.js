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
		const res = await api.get('/api/blogs')

		res.body.forEach((blog) => {
			expect(blog.id).toBeDefined()
			expect(blog._id).not.toBeDefined()
		})
	})

	afterAll(async () => {
		await mongoose.connection.close()
	})
})
