import { useState, useEffect } from 'react'
import noteService from  '../services/notes'
import Note from "./Note"

const App = (props) => {
  const [notes, setNotes] = useState([])  
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const hook = () => {
    //console.log('effect') // printed second
    noteService
      .getAll()
      .then(initialNotes => {
        //console.log('promise fulfilled') // printed third
        setNotes(initialNotes) 
      })
  }
  useEffect(hook, [])
  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      // omit the id property because its better to let the server handle id assignment 
    }
  
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  
  const handleNoteChange = (event) => {
    //console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(n => n.id !== id ? n : returnedNote))
      })
      .catch(error => {
        alert(
          `The note '${note.content}' was already deleted from the server'`
        )
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
         <Note 
          key={note.id}
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
          />

        )}
      </ul>
      <ul>
        <form onSubmit={addNote}>
          <input value={newNote} onChange={handleNoteChange}/>
          <button type="submit">save</button>
        </form>
      </ul>
    </div>
  )
}
export default App