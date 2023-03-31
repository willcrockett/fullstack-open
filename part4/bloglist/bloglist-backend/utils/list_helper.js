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

const mostLikes = (blogs) => {
	let ans = _.reduce(
		blogs,
		(result, blog) => {
			let auth = blog.author
			result[auth] = {
				author: auth,
				likes: blog.likes + (result[auth] ? result[auth].likes : 0)
			}
			return result
		},
		{}
	)
	ans = _.maxBy(_.flatMap(ans), 'likes')
	return ans
}

module.exports = {
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}
