import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const capital = country.capital?.[0]
  const coordinates = country.capitalInfo?.latlng
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    setWeather(null)
    setError('')
    if (!apiKey || !capital || !coordinates?.length) return

    const controller = new AbortController()
    axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { lat: coordinates[0], lon: coordinates[1], units: 'metric', appid: apiKey },
      signal: controller.signal
    })
      .then(response => setWeather(response.data))
      .catch(err => {
        if (err.code !== 'ERR_CANCELED') {
          setError('Weather data could not be loaded. Check your API key and connection.')
        }
      })
    return () => controller.abort()
  }, [country.cca3, capital, apiKey, coordinates?.[0], coordinates?.[1]])

  if (!capital) return null

  return (
    <section>
      <h2>Weather in {capital}</h2>
      {!apiKey && <p>Set VITE_OPENWEATHER_API_KEY in your .env file to enable weather.</p>}
      {apiKey && !coordinates?.length && <p>Capital coordinates are unavailable.</p>}
      {error && <p role="alert">{error}</p>}
      {apiKey && coordinates?.length && !weather && !error && <p>Loading weather...</p>}
      {weather && (
        <>
          <p>Temperature: {weather.main.temp} °C</p>
          {weather.weather?.[0]?.icon && (
            <img alt={weather.weather[0].description || 'Weather icon'}
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
          )}
          <p>Wind: {weather.wind.speed} m/s</p>
        </>
      )}
    </section>
  )
}

const CountryDetails = ({ country }) => (
  <article>
    <h2>{country.name.common}</h2>
    <p>Capital: {country.capital?.join(', ') || 'Unknown'}</p>
    <p>Area: {country.area?.toLocaleString() ?? 'Unknown'} km²</p>
    <h3>Languages</h3>
    <ul>
      {Object.entries(country.languages || {}).map(([code, language]) => (
        <li key={code}>{language}</li>
      ))}
    </ul>
    {country.flags?.png && <img className="flag" src={country.flags.png}
      alt={country.flags.alt || `Flag of ${country.name.common}`} />}
    <Weather country={country} />
  </article>
)

export default CountryDetails
