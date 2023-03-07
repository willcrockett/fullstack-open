const Countries = ({ countries, handleShowOf, weather }) => {
  console.log('countries 1')
  
  if (countries) {    
    console.log('countries 2')
    if (countries.length > 10) {
      return <p>Too many results. Try a different filter.</p>
    } else if (countries.length > 1) {
      console.log('countries 3')
        return (
          <CountryList countries={countries} handleShowOf={handleShowOf} />
        )
    } else {
      console.log('countries 4')
        return <Country 
        {...countries[0]}
        weatherInfo={weather} />
    }
  }
}

const Country = ({
  capital,
  area,
  languages,
  name: { common: name},
  flags: {png: flag},
  weather
}) => {
  console.log('COUNTRY 1')
  return (
    <div>
      <h1>{name}</h1>
      <p>{`Capital: ${capital}`}</p>
      <p>{`Area: ${area}`}</p>
      <h3>Languages</h3>
      {Object.keys(languages).map(key =>
         <li key={key}>{languages[key]}</li>
      )}
      <br></br>
      <img src={flag}/>
        <Weather capital={capital} weather={weather} />
    </div>
  
      
  )
  // const name = country.name.official
  // const [capital, area, languages, flags, ...rest] = country
}

const CountryList = ({countries, handleShowOf}) => {
  console.log('country list')
  return ( countries.map(({name: {official, common}}, index) => {
      return (
         <div key={index}>
          {`${common}  `}
          <button onClick={() => handleShowOf(official)}>show</button>
         </div>
      );
    })
  )
}

const Weather = ({ capital, weatherInfo }) => {
  console.log('weather 1')
  
  if (weatherInfo) {
    console.log('weather 2')
    const { 
      main: { temp },
      weather: { icon },
      wind: { speed } 
    } = weatherInfo
    const weatherIcon = `http://openweathermap.org/img/wn/${icon}@2x.png`
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>Temperature: {temp}&deg; F</p>
        <img src={weatherIcon} />
        <p>Wind: {speed} mph</p>
      </div> 
    )
  }
  console.log('weather 3')
  return null
}

export default Countries