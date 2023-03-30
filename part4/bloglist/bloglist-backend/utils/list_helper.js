const totalLikes = (blogs) => {
	return blogs.reduce(
		(acc, currBlog, ) => acc + currBlog.likes, 0
	)
}

module.exports = {
	totalLikes
}