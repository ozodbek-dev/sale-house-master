import { CurrencyContext } from "context"
import { useContext } from "react"

const useCurrency = () => {
	return useContext(CurrencyContext)
}

export default useCurrency
