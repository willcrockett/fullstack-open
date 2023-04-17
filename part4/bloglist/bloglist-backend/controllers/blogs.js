const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor, tokenExtractor } = require('../utils/middleware')
//const logger = require('../utils/logger')

// const getTokenFrom = (req) => {
// 	const authorization = req.get('authorization')
// 	if (authorization && authorization.startsWith('Bearer ')) {
// 		return authorization.replace('Bearer ', '')
// 	}

// 	return null
// }
/* ----------------------------- Fetch all blogs ---------------------------- */
blogRouter.get('/', async (req, res) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	res.json(blogs)
})

/* ---------------------------- Fetch blog by id ---------------------------- */
blogRouter.get('/:id', async (req, res, next) => {
	const blog = await Blog.findById(req.params.id)
	if (blog) {
		res.json(blog)
	} else {
		res.status(404).end()
	}
})

/* ------------------------------ Add new blog ------------------------------ */
blogRouter.post('/', userExtractor, async (req, res) => {
	const body = req.body

	//TODO add user extractor middleware
	const user = req.user

	if (!user) {
		return res.status(401).json({ error: 'operation not permitted' })
	}

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
blogRouter.delete('/:id', userExtractor, async (req, res, next) => {
	const user = req.user
	const blog = await Blog.findById(req.params.id)

	if (!user || user.id.toString() !== blog.user.toString()) {
		return res.status(401).json({ error: 'operation not permitted' })
	}
	user.blogs = user.blogs.filter((b) => b.toString() !== blog.id.toString())
	await user.save()
	await blog.remove()
	res.status(204).end()
})

blogRouter.put('/:id', async (req, res, next) => {
	// const decodedToken = jwt.verify(req.token, process.env.SECRET)

	// const blog = await Blog.findById(req.params.id)
	// if (!decodedToken.id || blog.user.toString() !== decodedToken.id.toString()) {
	// 	return res.status(401).json({ error: `Not authorized for ${blog.id}` })
	// }
	const updatedBlog = { ...req.body }
	await Blog.findByIdAndUpdate(req.params.id, updatedBlog, { new: true })
	res.status(200).json(updatedBlog)
})
module.exports = blogRouter
