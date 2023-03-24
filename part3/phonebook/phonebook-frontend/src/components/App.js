
import { useState, useEffect } from 'react'
import Persons from './Persons'
import PersonForm from './PersonForm'
import Filter from './Filter'
import Notification from './Notification'
import phonebookService from '../services/phonebook'
const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchPattern, setSearchPattern] = useState('')
  const [displayMessage, setDisplayMessage] = useState({})
  const hook = () => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  useEffect(hook, [])
  const cleanupAdd = (message, className) => {
    setNewName('')
    setNewNumber('')
    setDisplayMessage({message, className})
    console.log(message, className)
    
    setTimeout(() => setDisplayMessage(null), 5000)
  }
  const addPerson = (event) => {
    event.preventDefault()
    let foundPerson = persons.find(p => p.name.toUpperCase() === newName.toUpperCase())
    if (!foundPerson) {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      phonebookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        .catch(error => {
          cleanupAdd(error.response.data.error, 'error')
        })
      cleanupAdd(`${newName} has been added to the phonebook.`, 'success')
      
    } else if (window.confirm(`${foundPerson.name} is already in the phonebook. Replace the old number?`)) {
      const personObject = { ...foundPerson, number: newNumber }
      phonebookService
        .update(personObject.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== personObject.id ? p : returnedPerson))
        })
        .catch(error => {
          cleanupAdd(error.response.data.error, 'error')
        })
      cleanupAdd(`${foundPerson.name}'s number has been updated in the phonebook.`, 'success')
    }
  }

  const handleNameChange = event => setNewName(event.target.value)
  const handleNumberChange = event => setNewNumber(event.target.value)
  const handleFilterChange = event => setSearchPattern(event.target.value)
  const handleDeleteOf = id => {
    if (window.confirm(`Delete ${id}?`)) {
      phonebookService.remove(id)
      setPersons(persons.filter(p => p.id !== id))
    }
  }
  const formProps = {
    addPerson: addPerson,
    newName: newName,
    newNumber: newNumber,
    handleNameChange: handleNameChange,
    handleNumberChange: handleNumberChange,
  }
  return (
    <div>
      <Notification {...displayMessage}/>
      <Filter value={searchPattern} onChange={handleFilterChange} />
      <h2>Phonebook</h2>
      <PersonForm {...formProps} />
      <h2>Numbers</h2>
      <Persons
        persons={persons.filter(person => person.name.toUpperCase().includes(searchPattern.toUpperCase()))}
        handleDeleteOf={handleDeleteOf}
      />
    </div>
  )
}



export default App