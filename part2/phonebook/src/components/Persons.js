const Persons = ({persons}) => {
  return (
    <table>
      <tbody>
        {persons.map(person => 
          <Person key={person.name} name={person.name} number={person.number}/>
        )}
      </tbody>
    </table>
  )
}

const Person = ({name, number}) => {
  return (
    <tr>
      <td>
        {name}
      </td>
      <td>
        {number}
      </td>
    </tr>
  )
}
export default Persons