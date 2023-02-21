const Hello = (props) => { // Component names must be capitalized
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old.</p>
    </div>
  )
}
const App = () => {
  const friends = [
    { name: 'Peter', age: 4},
    { name: 'Maya', age: 10},
  ]

  return ( // using <>  instead of <div> as root element removes additional element from DOM tree
    <> 
      <h1>Greetings</h1>
{/*   <p>{friends[0]}</p>  --- This does not work because in React the things 
                              rendered in braces must be primitive type 
*/}
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[1].name} {friends[1].age}</p>
      <Hello name='Steve' age={14} />
    </>
  )
}

export default App