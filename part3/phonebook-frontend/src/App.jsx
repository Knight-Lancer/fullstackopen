import React from 'react'
import React, { useEffect, useRef, useState } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import Notification from './components/Notification.jsx'
import personService from './services/persons.js'
import './style.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const notificationTimer = useRef(null)

  const showNotification = (message, type = 'success') => {
    clearTimeout(notificationTimer.current)
    setNotification({ message, type })
    notificationTimer.current = setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => {
        console.error('Failed to load phonebook:', error)
        showNotification('Could not load contacts. Check that the Express backend is running on port 3001.', 'error')
      })
    return () => clearTimeout(notificationTimer.current)
  }, [])

  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const addPerson = async event => {
    event.preventDefault()
    const name = newName.trim()
    const number = newNumber.trim()
    if (!name || !number) return

    const existingPerson = persons.find(
      person => person.name.toLowerCase() === name.toLowerCase()
    )

    if (existingPerson && !window.confirm(
      `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
    )) return

    try {
      if (existingPerson) {
        const updatedPerson = await personService.update(existingPerson.id, { name: existingPerson.name, number })
        setPersons(current => current.map(person => person.id === existingPerson.id ? updatedPerson : person))
        showNotification(`Updated ${existingPerson.name}`)
      } else {
        const createdPerson = await personService.create({ name, number })
        setPersons(current => current.concat(createdPerson))
        showNotification(`Added ${name}`)
      }
      clearForm()
    } catch (error) {
      console.error('Failed to save contact:', error)
      if (error.response?.status === 404 && existingPerson) {
        setPersons(current => current.filter(person => person.id !== existingPerson.id))
        showNotification(`Information of ${existingPerson.name} has already been removed from the server`, 'error')
      } else {
        showNotification(error.response?.data?.error || 'Could not save this contact. Please try again.', 'error')
      }
    }
  }

  const deletePerson = async person => {
    if (!window.confirm(`Delete ${person.name}?`)) return
    try {
      await personService.remove(person.id)
      setPersons(current => current.filter(item => item.id !== person.id))
      showNotification(`Deleted ${person.name}`)
    } catch (error) {
      console.error('Failed to delete contact:', error)
      if (error.response?.status === 404) {
        setPersons(current => current.filter(item => item.id !== person.id))
        showNotification(`${person.name} was already removed from the server`, 'error')
      } else {
        showNotification(`Could not delete ${person.name}. Please try again.`, 'error')
      }
    }
  }

  const visiblePersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={event => setFilter(event.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={event => setNewName(event.target.value)}
        newNumber={newNumber}
        onNumberChange={event => setNewNumber(event.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={visiblePersons} onDelete={deletePerson} />
    </div>
  )
}

export default App
