const Persons = ({persons, handleDeleteOf}) => {
  return (
    <table>
      <tbody>
        {persons.map(person => 
          <Person 
          key={person.name} 
          name={person.name} 
          number={person.number}
          handleDelete={() => handleDeleteOf(person.id)}
          />
        )}
      </tbody>
    </table>
  )
}

const Person = ({name, number, handleDelete}) => {
  return (
    <tr>
      <td>
        {name}
      </td>
      <td>
        {number}
      </td>
      <td>
        <button onClick={handleDelete}>delete</button>
      </td>
    </tr>
  )
}
export default Persons