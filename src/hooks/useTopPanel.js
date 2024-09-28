import { TopPanelContext } from "context"
import { useContext } from "react"

const useTopPanel = () => {
	return useContext(TopPanelContext)
}

export default useTopPanel
