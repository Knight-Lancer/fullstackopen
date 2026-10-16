import React from 'react'
const Persons = ({ persons, onDelete }) => (
  <div>
    {persons.map(person => (
      <div key={person.id}>
        {person.name} {person.number}{' '}
        <button type="button" onClick={() => onDelete(person)}>delete</button>
      </div>
    ))}
  </div>
)

export default Persons
