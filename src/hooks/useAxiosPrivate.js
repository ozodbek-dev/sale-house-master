import { useEffect } from "react"
import useAuth from "./useAuth"
import axios from "api/axios"
import useNotification from "./useNotification"
import { useTranslation } from "react-i18next"

const axiosPrivate = axios.create({
	baseURL: process.env.REACT_APP_API_URL
})

const useAxiosPrivate = () => {
	const sendNotification = useNotification()
	const [{ user, logout }] = useAuth()
	const { t } = useTranslation()

	useEffect(() => {
		const requestIntercept = axiosPrivate.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${user?.access_token}`
				}
				return config
			},
			(err) => Promise.reject(err)
		)

		const responseIntercept = axiosPrivate.interceptors.response.use(
			(response) => response,
			async (error) => {
				if (error?.response?.status === 401) {
					logout()
				}
				if (error?.code === "ERR_NETWORK") {
					sendNotification({
						msg: t("common.alerts.error.noConnection"),
						variant: "error"
					})
				}
				return Promise.reject(error)
			}
		)

		return () => {
			axiosPrivate.interceptors.request.eject(requestIntercept)
			axiosPrivate.interceptors.response.eject(responseIntercept)
		}
	}, [user])

	return axiosPrivate
}

export default useAxiosPrivate
