import { useState } from "react"
import useAxiosPrivate from "./useAxiosPrivate"
import useNotification from "./useNotification"
import usePrevNext from "./usePrevNext"
import { useTranslation } from "react-i18next"

const useFormSubmit = () => {
	const axiosPrivate = useAxiosPrivate()
	const sendNotification = useNotification()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { prev } = usePrevNext()
	const { t } = useTranslation()

	const parseToFormData = (values) => {
		let formData = new FormData()
		for (let key in values) {
			formData.append(key, values[key])
		}
		return formData
	}

	const handleResponse = (
		response,
		notificationMsg,
		requestType,
		formCloseFn
	) => {
		if (response.data && response.data.status) {
			if (requestType === "post") {
				sendNotification({
					msg:
						typeof notificationMsg === "object"
							? notificationMsg?.title
							: t("common.alerts.success.created", { value: notificationMsg }),
					variant: "success"
				})
			} else {
				sendNotification({
					msg:
						typeof notificationMsg === "object"
							? notificationMsg?.title
							: t("common.alerts.success.updated", { value: notificationMsg }),
					variant: "success"
				})
			}

			if (!formCloseFn) {
				prev()
			} else {
				formCloseFn()
			}
		}
		setIsSubmitting(false)
	}

	const submit = async (
		requestConfig = { type: "post", contentType: "simple" },
		values = {},
		path = "",
		notificationMsg = t("common.global.item"),
		itemId = null,
		customPath = false,
		formCloseFn = null
	) => {
		try {
			setIsSubmitting(true)
			switch (requestConfig.type) {
				case "post": {
					if (requestConfig.contentType === "formData") {
						const response = await axiosPrivate.post(
							customPath ? path : `${path}/store`,
							parseToFormData(values),
							{
								headers: { "Content-Type": "multipart/form-data" }
							}
						)
						handleResponse(response, notificationMsg, "post", formCloseFn)
					} else if (requestConfig.contentType === "simple") {
						const response = await axiosPrivate.post(
							customPath ? path : `${path}/store`,
							JSON.stringify(values),
							{
								headers: { "Content-Type": "application/json" }
							}
						)
						handleResponse(response, notificationMsg, "post", formCloseFn)
					}
					break
				}
				case "put": {
					if (requestConfig.contentType === "formData") {
						const response = await axiosPrivate.post(
							`${path}/update/${itemId}`,
							parseToFormData({ ...values, _method: "put" }),
							{
								headers: { "Content-Type": "multipart/form-data" }
							}
						)
						handleResponse(response, notificationMsg, "put", formCloseFn)
					} else if (requestConfig.contentType === "simple") {
						const response = await axiosPrivate.post(
							`${path}/update/${itemId}`,
							JSON.stringify({ ...values, _method: "put" }),
							{
								headers: { "Content-Type": "application/json" }
							}
						)
						handleResponse(response, notificationMsg, "put", formCloseFn)
					}
					break
				}
				case "postUpdate": {
					if (requestConfig.contentType === "formData") {
						const response = await axiosPrivate.post(
							`${path}/update/${itemId}`,
							parseToFormData(values),
							{
								headers: { "Content-Type": "multipart/form-data" }
							}
						)
						handleResponse(response, notificationMsg, "put", formCloseFn)
					} else if (requestConfig.contentType === "simple") {
						const response = await axiosPrivate.post(
							`${path}/update/${itemId}`,
							JSON.stringify(values),
							{
								headers: { "Content-Type": "application/json" }
							}
						)
						handleResponse(response, notificationMsg, "put", formCloseFn)
					}
					break
				}
				default: {
					break
				}
			}
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsSubmitting(false)
		}
	}

	return { submit, isSubmitting }
}

export default useFormSubmit
