/* TODO 1.3:
1.2: course information, step2
Refactor the Content component so that it does not render any names of parts
 or their number of exercises by itself. Instead, it only renders three Part
  components of which each renders the name and number of exercises of one part.

  const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
*/
const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
     <p><Part part={props.parts[0]} /></p>
     <p><Part part={props.parts[1]} /></p>
     <p><Part part={props.parts[2]} /></p>
    </div>
  )
}
const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.parts[0].exercises +
                              props.parts[1].exercises +
                              props.parts[2].exercises}</p>
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part.name}, {props.part.exercises}</p>
    </div>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default App