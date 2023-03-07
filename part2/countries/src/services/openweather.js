import axios from 'axios'

const baseURL = 'https://api.openweathermap.org/data/2.5/weather?'
const api_key = process.env.REACT_APP_OW_API_KEY
const getCapital = capital => {
  console.log('open weather call')

  return ( 
    axios
      .get(`${baseURL}q=${capital}&appid=${api_key}&units=imperial`)
      .then(response => response.data)
  )
}

export default { getCapital }