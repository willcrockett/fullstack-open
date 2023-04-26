import { useState } from 'react'
const Blog = ({ blog, update, remove, curr_username }) => {
  const [visible, setVisible] = useState(false) 
	const showWhenVisible = { display: visible ? '' : 'none'}
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const showRemoveButton = { display: curr_username === blog.user.username ? '' : 'none' }
  const handleLike = () => {
    blog = { 
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id 
    }
    update(blog)
  }
  
  const handleRemove = () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      remove(blog.id)  
    }
  }
  return (
    <div style={blogStyle}>
      <p>
        {blog.title} - {blog.author + ' '}
        <button onClick={() => setVisible(!visible)}>{ visible ? 'hide' : 'view' }</button>
      </p>
      <div style={showWhenVisible}>
        <p>{blog.url}</p> 
        <p>{blog.likes} likes <button onClick={handleLike}>Like</button></p>
        <p>{blog.user.name}</p>
        <button style={showRemoveButton} onClick={handleRemove}>Remove</button>
      </div>  
    </div>  
  )
}

export default Blog