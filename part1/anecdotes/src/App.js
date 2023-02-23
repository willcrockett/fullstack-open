import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.', 
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))
  const [selected, setSelected] = useState(0)
  const [mostVoted, setMostVoted] = useState(0)

  const handleNextAnecdoteClick = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const handleVoteClick = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    if (votesCopy[selected] > votesCopy[mostVoted]) {
      setMostVoted(selected)
    }
    setVotes(votesCopy)
  }
  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <Anecdote quote={anecdotes[selected]} votes={votes[selected]}/>
      <Button onClick={handleNextAnecdoteClick} text="Next anecdote"/>
      <Button onClick={handleVoteClick} text={"Vote"}/>
      <h1>Anecdote with the most votes</h1>
      <Anecdote quote={anecdotes[mostVoted]} votes={votes[mostVoted]}/>
    </div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>
const Anecdote = ({quote, votes}) => {
  return (
    <>
      <p>{quote}</p>
      <p>Has {votes} votes</p>
    </>
  )
}
export default App