const Countries = ({ countries, handleShowOf, weather }) => {
  console.log('countries 1')
  
  if (countries) {    
    if (countries.length > 10) {
      return <p>Too many results. Try another filter.</p>
    } else if (countries.length > 1) {
      console.log('countries 3')
        return (
          <CountryList countries={countries} handleShowOf={handleShowOf} />
        )
    } else {
      console.log('countries 4, weather:', weather)
        return <Country 
        country={countries[0]}
        weatherInfo={weather} />
    }
  }
}

const Country = ({
  country,
  weatherInfo
}) => {
  const {
    capital,
    area,
    languages,
    name: { common: name},
    flags: { png: flag }
  } = country
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
        <Weather capital={capital} weatherInfo={weatherInfo} />
    </div>
  
      
  )
  // const name = country.name.official
  // const [capital, area, languages, flags, ...rest] = country
}

const CountryList = ({countries, handleShowOf}) => {
  console.log('country list')
  return ( countries.map(({name: {official, common}}, index) => {
      
      return (
         <li key={index}>
          {`${common}  `}
          <button onClick={() => handleShowOf(official)}>show</button>
         </li>
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
      weather,
      wind: { speed } 
    } = weatherInfo
    const weatherIcon = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>Temperature: {temp}&deg; F</p>
        <img src={weatherIcon} />
        <p>Wind: {speed} mph</p>
      </div> 
    )
  }
  console.log('weather 3 ')
  return null
}

export default Countries