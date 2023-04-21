import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
  console.log('changed token')
  
}
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }
  const res = await axios.post(baseUrl, newBlog, config)
  return res.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { setToken, getAll, create }