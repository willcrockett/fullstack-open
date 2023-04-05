const blogRouter = require('express').Router()
const Blog = require('../models/blog')

/* ----------------------------- Fetch all blogs ---------------------------- */
blogRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({})
	res.json(blogs)
})

/* ------------------------------ Add new blog ------------------------------ */
blogRouter.post('/', async (req, res) => {
	const blog = new Blog(req.body)
	const savedBlog = await blog.save()
	res.status(201).json(savedBlog)
})

/* ------------------------------ Delete a blog ----------------------------- */
blogRouter.delete('/:id', async (req, res) => {
	await Blog.findByIdAndDelete(req.params.id)
	res.status(204).end()
})
module.exports = blogRouter
