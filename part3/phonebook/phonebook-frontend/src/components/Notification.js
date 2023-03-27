const Notification = ({ message, className }) => {
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