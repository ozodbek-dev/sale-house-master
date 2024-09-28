import { TableDrawerContext } from "context"
import { useContext } from "react"

const useTableDrawerToggle = () => {
	return useContext(TableDrawerContext)
}

export default useTableDrawerToggle
