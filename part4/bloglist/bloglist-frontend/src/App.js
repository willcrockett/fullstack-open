import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'

const App = () => {
  const [user, setUser] = useState(null)
  
  useEffect(() => {    
    console.log('get token effect')
    
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')    
    if (loggedUserJSON) {      
      const user = JSON.parse(loggedUserJSON)      
      setUser(user)      
      blogService.setToken(user.token)    
  }}, [])

  
  
  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const changeUser = (u) => {
    debugger
    console.log(`change user: ${u}`)
    
    setUser({...u})
  }

  const renderBlogs = () => {
    return (
      <div>
        <h2>blogs</h2>
        <form onSubmit={handleLogout}>
          {user.name} logged in {' '}
          <button type="submit">logout</button>
        </form>
        <BlogForm changeUser={changeUser}/>
      </div>
    )
  }
  return (
    <div>
     { user !== null ?
       renderBlogs() :
      <LoginForm changeUser={changeUser} />
     }
    </div>
  )
}

export default App