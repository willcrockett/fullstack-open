import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => setGood(good + 1)
  const handleNeutralClick = () => setNeutral(neutral + 1)
  const handleBadClick = () => setBad(bad + 1)

  return (
    <div>
      <Header text='Give feedback'/>
      <Button onClick={handleGoodClick} text='Good'/>
      <Button onClick={handleNeutralClick} text='Neutral'/>
      <Button onClick={handleBadClick} text='Bad'/>
      <Header text='Statistics'/>
      <Stats good={good} neutral={neutral} bad={bad}/>
      <p></p>
    </div>
  )
}

const Header = ({text}) => <h1>{text}</h1>
const Stats = ({good, neutral, bad}) => {
  return (
    <div>
      <li>Good {good}</li>
      <li>Neutral {neutral}</li>
      <li>Bad {bad}</li>
    </div>
  )
}
const Button = ({onClick, text}) =>  <button onClick={onClick}>{text}</button>
export default App