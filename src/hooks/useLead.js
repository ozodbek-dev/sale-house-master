import { LeadContext } from "context"
import { useContext } from "react"

const useLead = () => {
	return useContext(LeadContext)
}

export default useLead
