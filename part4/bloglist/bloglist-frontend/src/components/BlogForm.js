/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import Blog from './Blog'

const BlogForm = ({ handleLogout, user }) => {
	const [blogs, setBlogs] = useState([])
	const initialState = {
		title: '',
    author: '',
    url: '' 
	}
	const [blogFields, setBlogFields] = useState(initialState)

	useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

	const handleChange = (e) => {
		const { name, value } = e.target
		
		setBlogFields((prevState) => ({
				...prevState,
				[name]: value
			})
		)
	}

	const handleCreate = async (e) => {
		e.preventDefault()
		try {
			const newBlog = await blogService.create(blogFields)
			debugger
			setBlogFields({...initialState})
			
			setBlogs(blogs.concat(newBlog))
		} catch (exception) {
			
		}
	}
	return (
		<div>
			<h2>create new</h2>
			<form onSubmit={handleCreate}>
				<li>
					title:{' '}
					<input 
						type="text"
						name="title"
						value={blogFields.title}
						onChange={handleChange}
					/>
				</li>
				<li>
					author:{' '}
					<input 
						type="text"
						name="author"
						value={blogFields.author}
						onChange={handleChange}
					/>
				</li>
				<li>
					url:{' '}
					<input 
						type="text"
						name="url"
						value={blogFields.url}
						onChange={handleChange}
					/>
				</li>
				<button type="submit">create</button>
			</form>
			<br/>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
		</div>
	)
}

export default BlogForm