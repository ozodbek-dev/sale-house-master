import useLocalStorage from "hooks/useLocalStorage"
import useNotification from "hooks/useNotification"
import { useEffect, useMemo } from "react"
import {
	Outlet,
	useLocation,
	useNavigate,
	useSearchParams
} from "react-router-dom"
import { AuthContext } from "../index"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import { useTranslation } from "react-i18next"

const AuthProvider = ({ children }) => {
	const [user, setUser] = useLocalStorage("user", null)
	const { t } = useTranslation()
	const location = useLocation()
	const [searchParams, setSearchParams] = useSearchParams()
	const navigate = useNavigate()
	const sendNotification = useNotification()

	const login = async (data) => {
		sendNotification({
			msg: t("common.alerts.success.login"),
			variant: "success"
		})
		setUser(data)
		/* setUser({
			access_token:
				"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2JyYXZlZGV2LnV6L2FwaS9sb2dpbiIsImlhdCI6MTY4NzYzMjIwMSwiZXhwIjoxNjg3NjM1ODAxLCJuYmYiOjE2ODc2MzIyMDEsImp0aSI6IjB6VlZYQTBZeDh0YUJ6UEUiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.rmUXw_qWjtFvta-QMCzTMgxXL85aoL9CGC1NMAcrtvk",
			token_type: "bearer",
			expires_in: 86400,
			user: {
				id: 1,
				name: "Doniyorbek",
				login: "admin",
				password:
					"$2y$10$JYAvNs8XEqlVYQIoVEekYe/qOdpDvX40JTOuJ8htPfdV0UQVvplsm",
				role: "5",
				status: "1",
				created_at: null,
				updated_at: null
			}
		}) */
		// console.log("searchParams = ", searchParams.get("from"))
		// if (data && data?.user?.role) {
		// 	// if (searchParams.has("from")) {
		// 	// 	navigate(searchParams.get("from"), { replace: true })
		// 	// } else {
		// 	if (data?.user?.role === ROLE_TYPE_LIST.ADMIN.code) {
		// 		navigate("/admin/dashboard", { replace: true })
		// 	} else if (data?.user?.role === ROLE_TYPE_LIST.ACCOUNTER.code) {
		// 		navigate("/accounter/payment", { replace: true })
		// 	} else if (data?.user?.role === ROLE_TYPE_LIST.MANAGER.code) {
		// 		navigate("/manager/dashboard", { replace: true })
		// 	} else if (data?.user?.role === ROLE_TYPE_LIST.OPERATOR.code) {
		// 		navigate("/operator/lead", { replace: true })
		// 	} else {
		// 		navigate("/admin/dashboard", { replace: true })
		// 	}
		// 	// }
		// } else {
		// 	navigate("/admin/dashboard", { replace: true })
		// }
	}

	useEffect(() => {
		if (user && user.user) {
			// console.log("I'm here")
			if (user && user?.user?.role) {
				if (searchParams.has("from")) {
					navigate(searchParams.get("from"), { replace: true })
				} else {
					if (user?.user?.role === ROLE_TYPE_LIST.ADMIN.code) {
						// console.log("admin")
						if (location.pathname.includes("admin")) {
							// console.log("admin if")
							navigate(location.pathname, { replace: true })
						} else {
							// console.log("admin else")
							navigate("/admin/dashboard", { replace: true })
						}
					} else if (user?.user?.role === ROLE_TYPE_LIST.ACCOUNTER.code) {
						// console.log("accounter")
						if (location.pathname.includes("accounter")) {
							// console.log("accounter if")
							navigate(location.pathname, { replace: true })
						} else {
							// console.log("accounter else")
							navigate("/accounter/payment", { replace: true })
						}
					} else if (user?.user?.role === ROLE_TYPE_LIST.MANAGER.code) {
						// console.log("manager")
						if (location.pathname.includes("manager")) {
							// console.log("manager if")
							navigate(location.pathname, { replace: true })
						} else {
							// console.log("manager else")
							navigate("/manager/dashboard", { replace: true })
						}
					} else if (user?.user?.role === ROLE_TYPE_LIST.OPERATOR.code) {
						// console.log("operator")
						if (location.pathname.includes("operator")) {
							// console.log("operator if")
							navigate(location.pathname, { replace: true })
						} else {
							// console.log("operator else")
							navigate("/operator/lead", { replace: true })
						}
					} else {
						navigate("/admin/dashboard", { replace: true })
					}
				}
			} else {
				navigate("/admin/dashboard", { replace: true })
			}
		}
	}, [user])

	const logout = async () => {
		setUser(null)
		// setTableData({})
		navigate("/login", { replace: true })
	}

	const value = useMemo(
		() => ({
			user,
			login,
			logout
		}),
		[user]
	)

	return (
		<AuthContext.Provider value={[value, setUser]}>
			<Outlet />
		</AuthContext.Provider>
	)
}

export default AuthProvider
