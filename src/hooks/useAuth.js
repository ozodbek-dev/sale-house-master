import { useContext } from "react"
import { AuthContext } from "context/index"

const useAuth = () => {
	return useContext(AuthContext)
}

export default useAuth