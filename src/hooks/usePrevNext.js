import { useNavigate } from "react-router-dom"

const usePrevNext = () => {
	const navigate = useNavigate()

	const prev = (delta = -1) => navigate(delta)
	const next = (delta = 1) => navigate(delta)

	return { prev, next }
}

export default usePrevNext
