
import { useState, useRef } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchPattern, setSearchPattern] = useState('')
  const namesRef = useRef(new Set())

  const addPerson = (event) => {
    event.preventDefault()
    if (!namesRef.current.has(newName)) {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      setPersons(persons.concat(personObject))
      namesRef.current = namesRef.current.add(newName)
      setNewName('')
      setNewNumber('')
    } else {
      alert(`${newName} is already in the phonebook.`)
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setSearchPattern(event.target.value)
  const formProps = {
    addPerson: addPerson,
    newName: newName,
    newNumber: newNumber,
    handleNameChange: handleNameChange,
    handleNumberChange: handleNumberChange,
  }
  return (
    <div>
      <Filter value={searchPattern} onChange={handleFilterChange}/>
      <h2>Phonebook</h2>   
      <PersonForm {...formProps}/>
      <h2>Numbers</h2>
      <Persons persons={persons.filter(person => 
        person.name.toUpperCase().includes(searchPattern.toUpperCase())
      )} />
    </div>
  )
}



export default App