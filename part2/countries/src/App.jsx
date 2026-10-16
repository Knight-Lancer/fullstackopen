import React, { useEffect, useState } from 'react'
import { getAll } from './services/countries.js'
import CountryDetails from './components/CountryDetails.jsx'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAll()
      .then(data => setCountries(data))
      .catch(() => setError('Unable to load countries. Check your internet connection.'))
      .finally(() => setLoading(false))
  }, [])

  const matches = countries.filter(country =>
    country.name.common.toLowerCase().includes(query.trim().toLowerCase())
  )
  const selectedCountry = selected
    ? matches.find(country => country.cca3 === selected)
    : null
  const countryToShow = selectedCountry || (matches.length === 1 ? matches[0] : null)

  const changeQuery = event => {
    setQuery(event.target.value)
    setSelected(null)
  }

  return (
    <main>
      <label htmlFor="search">Find countries </label>
      <input id="search" value={query} onChange={changeQuery} />
      {loading && <p>Loading countries...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && query.trim() && (
        countryToShow ? <CountryDetails country={countryToShow} /> :
        matches.length > 10 ? <p>Too many matches, specify another filter</p> :
        matches.length === 0 ? <p>No matching countries</p> :
        <div>{matches.map(country => (
          <div key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => setSelected(country.cca3)}>show</button>
          </div>
        ))}</div>
      )}
    </main>
  )
}

export default App
