import useAuth from "hooks/useAuth"
import { useLocation, Navigate, Outlet } from "react-router-dom"

const RequireAuth = ({ allowedRoles = [] }) => {
	const location = useLocation()
	const [{ user }] = useAuth()
	let userRole = user?.user?.role

	return allowedRoles.includes(userRole) ? (
		<Outlet />
	) : (
		<Navigate to="/not-found" state={{ from: location }} replace />
	)
}

export default RequireAuth
