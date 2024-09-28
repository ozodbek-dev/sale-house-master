import { Outlet } from "react-router-dom"
import { LeadContext } from "context/index"
import { useState } from "react"

const LeadProvider = () => {
	const [leadData, setLeadData] = useState({})

	return (
		<LeadContext.Provider value={{ leadData, setLeadData }}>
			<Outlet />
		</LeadContext.Provider>
	)
}

export default LeadProvider
