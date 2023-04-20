import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  useEffect(() => {    
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
  }}, [])
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      console.log(user)
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      
    }
  }
  
  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
            type="text"
            name="username"
            value={username} 
            onChange={({ target }) => setUsername(target.value)}
        />  
      </div>
      <div>
        password
         <input
            type="password"
            name="password"
            value={password} 
            onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  
  if (user === null) {
    return loginForm()
  }

  return (
    <div>
      <h2>blogs</h2>
      <form onSubmit={handleLogout}>
            {user.name} logged in {' '}
            <button type="submit">logout</button>
      </form>
      <BlogForm handleLogout={handleLogout} user={user} />
    </div>
  )
  }

export default App