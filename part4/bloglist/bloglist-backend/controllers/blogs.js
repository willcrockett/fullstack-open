const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
//const logger = require('../utils/logger')

const getTokenFrom = (req) => {
	const authorizaiton = req.get('authorization')
	if (authorizaiton && authorizaiton.startsWith('Bearer ')) {
		return authorizaiton.replace('Bearer ', '')
	}

	return null
}
/* ----------------------------- Fetch all blogs ---------------------------- */
blogRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	res.json(blogs)
})

/* ------------------------------ Add new blog ------------------------------ */
blogRouter.post('/', async (req, res) => {
	const body = req.body
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)

	if (!decodedToken.id) {
		res.status(401).json({ error: 'token invalid' })
	}

	const user = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: body.title,
		url: body.url,
		likes: body.likes,
		author: body.author,
		user: user._id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

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
