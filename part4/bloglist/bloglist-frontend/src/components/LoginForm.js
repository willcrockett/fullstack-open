import { useState } from 'react'
const LoginForm = ({ login }) => {
	const initialFields = {
		username: '',
		password: ''
	}
	const	[fields, setFields] = useState(initialFields)

	const handleChange = (e) => {
		const { name, value } = e.target
		
		setFields((prevState) => ({
				...prevState,
				[name]: value
			})
		)
	}
	const handleLogin = (e) => {
		e.preventDefault()
		login(fields)
		setFields({
			...initialFields
		})


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