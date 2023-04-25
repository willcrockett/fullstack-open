const Notification = ({ alert }) => {
	console.log(`notifcation: ${alert}`)
	
	if (alert === null) return null
	
	return (
		<div className={alert.type}>
			{alert.message}
		</div>
	)
} 


export default Notification