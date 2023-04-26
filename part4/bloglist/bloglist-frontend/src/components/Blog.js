import { useState } from 'react'
const Blog = ({blog, update}) => {
  const [visible, setVisible] = useState(false) 
	const showWhenVisible = { display: visible ? '' : 'none'}
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    blog = { 
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id 
    }
    update(blog)
  }
  return (
    <div style={blogStyle}>
      <p>
        {blog.title} - {blog.author + ' '}
        <button onClick={() => setVisible(!visible)}>{ visible ? 'hide' : 'view' }</button>
      </p>
      <div style={showWhenVisible}>
        <p>{blog.url}</p> 
        <p>{blog.likes} likes <button onClick={handleLike}>like</button></p>
        <p>{blog.user.name}</p>
      </div>  
    </div>  
  )
}

export default Blog