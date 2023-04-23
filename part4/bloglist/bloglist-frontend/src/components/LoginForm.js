import { useState } from 'react'
import loginService from '../services/login'
const LoginForm = ({ changeUser }) => {
	const initialState = {
		username: '',
		password: ''
	}
	const	[fields, setFields] = useState(initialState)
	const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login(fields)
      console.log(`loginform handleLogin`)
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      setFields({...initialState})
			changeUser(user)
    } catch (exception) {
      
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