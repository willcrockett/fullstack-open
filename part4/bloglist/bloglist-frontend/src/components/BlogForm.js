/* eslint-disable import/no-anonymous-default-export */
import { useState } from 'react'
const BlogForm = ({ addBlog }) => {
	const initialFields = {
		username: '',
		password: ''
	}
	const [fields, setFields] = useState(initialFields)
	
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
		addBlog(fields)
		setFields({...initialFields})
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
		</div>
	)
}

export default BlogForm