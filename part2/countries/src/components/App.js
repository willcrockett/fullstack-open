import { useState, useEffect } from 'react'
import rc from '../services/restcountries'
import openweather from '../services/openweather'
import Countries from './Countries'
const App = () => {
  const [countries, setCountries] = useState(null)
  const [query, setQuery] = useState(null)
  const [searchVal, setSearchVal] = useState('')
  const [weather, setWeather] = useState(null)
  const onSearch = event => {
    event.preventDefault()
    setQuery(searchVal)
  }

  const handleShowOf = name  => {
    console.log('hso: ', name)
    
    setSearchVal(name)
    setQuery(name)
  }

  useEffect(() => {
    console.log('query effect: begin')
    
    if (query) { 
      console.log('query effect: query not null')    
      rc.search(query)
        .then(returnedCountries => {
          console.log('query effect: setCountries')
          setCountries(returnedCountries)
        })
    }
  }, [query])

  useEffect(() => {
    console.log('countries effect: begin')
    if (countries && countries.length == 1) {
      console.log('countries effect: single country')
      const capital = countries[0].capital[0]
      openweather
        .getCapital(capital)
        .then(returnedWeather => {         
          console.log('weather effect: setWeather:', returnedWeather);
          setWeather(returnedWeather)
      })
    } 
  }, [countries])
  

  return (
    
    <div>
      <form onSubmit = {onSearch} > 
        Find countries: <input 
        value={searchVal}
        onChange={event => setSearchVal(event.target.value)}/>
      </form>
      <Countries countries={countries} handleShowOf={handleShowOf} weather={weather} />
    </div>
  )
}

export default App