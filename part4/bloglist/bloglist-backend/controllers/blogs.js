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
blogRouter.delete('/:id', async (req, res, next) => {
	await Blog.findByIdAndDelete(req.params.id)
	res.status(204).end()
})

blogRouter.put('/:id', async (req, res, next) => {
	const body = req.body
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}
	await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
	res.status(200).json(body)
})
module.exports = blogRouter
