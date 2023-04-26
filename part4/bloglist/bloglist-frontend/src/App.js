import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Toggleable from './components/Toggleable'
const App = () => {
  /* ------------------------------- State Hooks ------------------------------ */
	const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [alert, setAlert] = useState(null)
  const blogFormRef = useRef()
  /* ------------------------------ Effect Hooks ------------------------------ */
	useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {    
    console.log('get token effect')
    
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
  } else {
    setUser(null)
  }
  }, [])
  
 /* ------------------------------ Blog Handlers ----------------------------- */
  const addBlog = async (blog) => {
    const savedBlog = await blogService.create(blog)
    savedBlog.user = user
    setBlogs(blogs.concat(savedBlog))
    notify(`${savedBlog.title} by ${savedBlog.author} succesfully created`, 'success')
  }

  const updateBlog = async (blog) => {
    console.log(blog)
    try {
      const savedBlog = await blogService.update(blog.id, blog)
      console.log(`update blog: ${savedBlog}`)
      
      setBlogs(blogs.map(b => b.id !== blog.id ? b : savedBlog))
    } catch {
      notify('update error', 'error')
    }

  }

  /* ------------------------------ User Handlers ----------------------------- */
	const login = async (u) => {
			
    console.log(`app handleLogin`)
    try {
      const user = await loginService.login(u)
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
			setUser(user)
    } catch (e) {
			if (e.response.status === 401) {
				notify('wrong username and/or password', "error")
			}
    }
  }

	const handleLogout = async (e) => {
		e.preventDefault()
		try {
			console.log('blogform handlelogut')
			window.localStorage.removeItem('loggedBloglistUser')
			setUser(null)
		} catch {
			console.log('probmlem with loggint out')
		}
	}
  /* ---------------------------- Rendering Helpers --------------------------- */
  
  const notify = (message, type) => {
    setAlert({ message, type })
    setTimeout(() => {
      setAlert(null)
    }, 5000)
  }
  blogs.sort((b1, b2) => b2.likes - b1.likes)
  const renderBlogs = () => {
    return (
      <div>
        <h2>blogs</h2>
        <form onSubmit={handleLogout}>
          {user.name} logged in {' '}
          <button type="submit">logout</button>
        </form>	
        <Toggleable buttonLabel={'Create New Blog'} ref={blogFormRef}>
          <BlogForm addBlog={addBlog} />
        </Toggleable>
        <br></br>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} update={updateBlog} />
      )}
      </div>
    )
  }
  
  return (
    <div>
      <Notification alert={alert}/>
      { user !== null ?
        renderBlogs() :
        <LoginForm login={login}/>
      }
      
    </div>
  )
}

export default App