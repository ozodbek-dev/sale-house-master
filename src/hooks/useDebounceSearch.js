import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

export default function useDebounceSearch(
	key = "name",
	initialValue,
	milliSeconds
) {
	const [debouncedValue, setDebouncedValue] = useState(initialValue)
	const [searchParams, setSearchParams] = useSearchParams()

	useEffect(() => {
		if (key && searchParams.get(key)) {
			setDebouncedValue(searchParams.get(key))
		}
	}, [searchParams])

	useEffect(() => {
		const handler = setTimeout(() => {
			if (debouncedValue) {
				searchParams.set(key, debouncedValue)
				setSearchParams(searchParams)
			} else {
				searchParams.delete(key)
				setSearchParams(searchParams)
			}

			if (searchParams.get("page") && searchParams.get(key)) {
				searchParams.set("page", 1)
				setSearchParams(searchParams)
			}
		}, milliSeconds)

		return () => {
			clearTimeout(handler)
		}
	}, [debouncedValue])

	return [debouncedValue, setDebouncedValue]
}
