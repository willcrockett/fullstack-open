
const Content = ({parts}) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises}/>
      )}
      <p><b>Total of {total} exercises</b></p>
    </div>
  )
}



const Part = ({name, exercises}) => <p>{name}: {exercises}</p>

export default Content