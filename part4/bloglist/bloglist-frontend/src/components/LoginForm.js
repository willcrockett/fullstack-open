import { useState } from 'react'
import loginService from '../services/login'
const LoginForm = ({ changeUser, notify }) => {
	const initialState = {
		username: '',
		password: ''
	}
	const	[fields, setFields] = useState(initialState)
	const handleLogin = async (e) => {
			
    console.log(`loginform handleLogin`)
    e.preventDefault()
    try {
      const user = await loginService.login(fields)
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setFields({...initialState})
			changeUser(user)
    } catch (e) {
			if (e.response.status === 401) {
				notify('wrong username and/or password', "error")
			}
    }
  }
	const handleChange = (e) => {
		const { name, value } = e.target
		
		setFields((prevState) => ({
				...prevState,
				[name]: value
			})
		)
	}
	return (
		<form onSubmit={handleLogin}>
				<div>
					username
					<input
							type="text"
							name="username"
							value={fields.username} 
							onChange={handleChange}
					/>  
				</div>
				<div>
					password
					<input
							type="password"
							name="password"
							value={fields.password} 
							onChange={handleChange}
					/>
				</div>
				<button type="submit">login</button>
			</form>
	)
}

export default LoginForm