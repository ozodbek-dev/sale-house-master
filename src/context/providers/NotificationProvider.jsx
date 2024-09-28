import { NotificationContext } from "context/index"
import { useState } from "react"

const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([])

	return (
		<NotificationContext.Provider value={{ notifications, setNotifications }}>
			{children}
		</NotificationContext.Provider>
	)
}

export default NotificationProvider
