import { TopPanelContext } from "context/index"
import { useState } from "react"

const TopPanelProvider = ({ children }) => {
	const [component, setComponent] = useState("")

	return (
		<TopPanelContext.Provider value={{ component, setComponent }}>
			{children}
		</TopPanelContext.Provider>
	)
}

export default TopPanelProvider
