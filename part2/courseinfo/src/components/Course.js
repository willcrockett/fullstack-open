import Content from './Content';

const Header = ({courseName}) => <h1>{courseName}</h1>

const Course = ({course}) => {
  return (
    <div>
      <Header courseName={course.name}/>
      <Content parts={course.parts}/>
    </div>
  )
}

export default Course
