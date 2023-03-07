import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1/name'
const search = query => {
  console.log('rest countires call')
  
  return (
    axios
      .get(`${baseUrl}/${query}`)
      .then(response => response.data)
  )
}




export default { search }