import { CurrencyContext } from "context/index"
import { useState } from "react"
import { useQuery } from "react-query"
import useAxiosPrivate from "hooks/useAxiosPrivate"

const CurrencyProvider = ({ children }) => {
	const [hasError, setHasError] = useState(false)
	const axiosPrivate = useAxiosPrivate()

	const { data: currencyData } = useQuery({
		queryKey: "dailyCurrency",
		queryFn: async function () {
			const response = await axiosPrivate.get("/dictionary/valute")
			return response?.data?.data || {}
		},
		enabled: !hasError,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	return (
		<CurrencyContext.Provider value={{ currencyData }}>
			{children}
		</CurrencyContext.Provider>
	)
}

export default CurrencyProvider
