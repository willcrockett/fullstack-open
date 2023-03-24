const Notification = ({ message, className }) => {
  debugger
  if (message) {
    return (
      <div className={className}>
        {message}
      </div>
    )
  }
  return null
}

export default Notification