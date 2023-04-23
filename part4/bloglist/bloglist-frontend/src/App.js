import { useState, useEffect } from 'react'
import BlogForm from './components/BlogForm'
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
  
  const changeUser = (u) => {
    debugger
    console.log(`change user: ${u}`)
    
    setUser({...u})
  }

  const renderBlogs = () => {
    return (
      <div>
     
        <BlogForm changeUser={changeUser} username={user.name}/>
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