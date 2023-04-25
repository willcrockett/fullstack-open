import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
const App = () => {
  const [user, setUser] = useState(null)
  const [alert, setAlert] = useState(null)

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
  
  const changeUser = (u) => {
    setUser((u === null ? null : {...u}))
  }

  const notify = (message, type) => {
    setAlert({ message, type })
    setTimeout(() => {
      setAlert(null)
    }, 5000)
  }

  const renderBlogs = () => {
    return (
      <div>
        <BlogForm notify={notify} changeUser={changeUser} username={user.name}/>
      </div>
    )
  }
  
  return (
    <div>
      <Notification alert={alert}/>
      { user !== null ?
        renderBlogs() :
        <LoginForm changeUser={changeUser} notify={notify} />
      }
    </div>
  )
}

export default App