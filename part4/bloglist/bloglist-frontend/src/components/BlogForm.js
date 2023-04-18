/* eslint-disable import/no-anonymous-default-export */
const BlogForm = ({ handleLogout, user }) => {
	return (
		<div>
			<h2>blogs</h2>
			<form onSubmit={handleLogout}>
					{user.name} logged in {' '}
					<button type="submit">logout</button>
			</form>
		</div>
	)
}

export default { BlogForm }