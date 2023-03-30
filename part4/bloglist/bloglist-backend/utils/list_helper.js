const totalLikes = (blogs) => {
	return blogs.reduce(
		(acc, currBlog) => {
			return acc + currBlog.likes
		}, 0)
}

/**
 * Finds out which blog has the most likes.
 *  If there are many top favorites, it is enough to return one of them.
 */
const favoriteBlog = (blogs) => {

	return (
		(({title, author, likes}) => ({title, author, likes}))(  // destructuring
			blogs.reduce( 
				(max, currBlog) => currBlog.likes > max.likes ? currBlog : max
			))
	)
	
}
module.exports = {
	totalLikes,
	favoriteBlog
}