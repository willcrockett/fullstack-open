const _ = require('lodash')
const totalLikes = (blogs) => {
	return blogs.reduce((acc, currBlog) => {
		return acc + currBlog.likes
	}, 0)
}

/**
 * Finds out which blog has the most likes.
 *  If there are many top favorites, it is enough to return one of them.
 */
const favoriteBlog = (blogs) => {
	return (({ title, author, likes }) => ({ title, author, likes }))(
		// destructuring
		blogs.reduce((max, currBlog) =>
			currBlog.likes > max.likes ? currBlog : max
		)
	)
}

const mostBlogs = (blogs) => {
	// TODO: refactor to use lodash chaining
	let result = _.countBy(blogs, 'author')
	let maxAuth = _.maxBy(_.keys(result), (auth) => result[auth])
	return { author: maxAuth, blogs: result[maxAuth] }
}
module.exports = {
	totalLikes,
	favoriteBlog,
	mostBlogs
}
