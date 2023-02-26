
import { useState, useRef, useEffect } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
import axios from 'axios'
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchPattern, setSearchPattern] = useState('')
  const namesRef = useRef(new Set())

  const hook = () => {
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
      response.data.map(
        person => namesRef.current = new Set(namesRef.current).add(person.name.toUpperCase())
      )
    })
  }
  useEffect(hook, [])
  const addPerson = (event) => {
    event.preventDefault()
    if (!namesRef.current.has(newName.toUpperCase())) {
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