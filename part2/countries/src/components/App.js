import { useState, useEffect } from 'react'
import rc from '../services/restcountries'
import openweather from '../services/openweather'
import Countries from './Countries'
const App = () => {
  const [countries, setCountries] = useState(null)
  const [query, setQuery] = useState(null)
  const [searchVal, setSearchVal] = useState('')

  const onSearch = event => {
    event.preventDefault()
    setQuery(searchVal)
  }

  const handleShowOf = ({ name, capital}) => {
    setSearchVal(name)
    setQuery(name)
  }

  useEffect(() => {
    console.log('effect: begin')
    
    if (query) { 
      console.log('effect: query not null')
      
      rc.search(query)
        .then(returnedCountries => {
          
          if (returnedCountries.length == 1) {
            console.log('effect: single country')

            const capital = returnedCountries[0].capital[0]
            openweather
              .getCapital(capital)
              .then(returnedWeather => {
                
                console.log('got weather:', returnedWeather);
                setWeather(returnedWeather)
            })
          }
          setCountries(returnedCountries)
        })
    }
  }, [query])
  

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