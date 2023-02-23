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
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

const Header = ({text}) => <h1>{text}</h1>

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad
  const average = (good - bad)/total
  const percentPos =  '' + (good/total)*100 + ' %'
  if (total > 0) {
    return (
      <table>
        <tbody>
          <StatisticLine value={good} text='Good'/>
          <StatisticLine value={neutral} text='Neutral'/>
          <StatisticLine value={bad} text='Bad'/>
          <StatisticLine value={total} text='Total'/>
          <StatisticLine value={average} text='Average'/>
          <StatisticLine value={percentPos} text='Percent positive'/>
        </tbody>
      </table>
    )
  }
  return <p>No feedback given yet</p>
}

const StatisticLine = ({value, text}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}
const Button = ({onClick, text}) =>  <button onClick={onClick}>{text}</button>
export default App