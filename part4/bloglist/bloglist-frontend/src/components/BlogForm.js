/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import Blog from './Blog'
const BlogForm = ({ notify, changeUser, username }) => {
	const [blogs, setBlogs] = useState([])
	const initialState = {
		title: '',
    author: '',
    url: '' 
	}
	const [fields, setFields] = useState(initialState)

	useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

	
	const handleChange = (e) => {
		const { name, value } = e.target
		
		setFields((prevState) => ({
				...prevState,
				[name]: value
			})
		)
	}

	const handleCreate = async (e) => {
		e.preventDefault()
		try {
			const newBlog = await blogService.create(fields)
			setFields({...initialState})	
			setBlogs(blogs.concat(newBlog))
			notify(`${newBlog.title} by ${newBlog.author} succesfully added`, 'success')
		} catch (e) {
			notify('unexpected create problem', 'error')
		}
	}

	const handleLogout = async (e) => {
		e.preventDefault()
		try {
			console.log('blogform handlelogut')
			window.localStorage.removeItem('loggedBloglistUser')
			changeUser(null)
		} catch {
			console.log('probmlem with loggint out')
		}
	}
	return ( 	
		<div>
			<h2>blogs</h2>
			<form onSubmit={handleLogout}>
				{username} logged in {' '}
				<button type="submit">logout</button>
			</form>	
			<h2>create new</h2>
			<form onSubmit={handleCreate}>
				<li>
					title:{' '}
					<input 
						type="text"
						name="title"
						value={fields.title}
						onChange={handleChange}
					/>
				</li>
				<li>
					author:{' '}
					<input 
						type="text"
						name="author"
						value={fields.author}
						onChange={handleChange}
					/>
				</li>
				<li>
					url:{' '}
					<input 
						type="text"
						name="url"
						value={fields.url}
						onChange={handleChange}
					/>
				</li>
				<button type="submit">create</button>
			</form>
			<br></br>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
		</div>
	)
}

export default BlogForm