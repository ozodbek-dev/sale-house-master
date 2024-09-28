import React, { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import { Button, CircularProgress } from "@mui/material"
import { SectionTitleText } from "components/ui/CustomText"
import { motion } from "framer-motion"
import { fadeUp } from "utils/motion"
import axios from "api/axios"
import useAuth from "hooks/useAuth"
import useNotification from "hooks/useNotification"
import FormTextField from "components/ui/form/FormTextField"
import FormPasswordField from "components/ui/form/FormPasswordField"
import { useTranslation } from "react-i18next"

const validationSchema = yup.object({
	login: yup.string().required("login.validation.loginRequired"),
	password: yup
		.string()
		.min(5, { label: "login.validation.passwordMin", value: 5 })
		.required("login.validation.passwordRequired")
})

const LogIn = () => {
	const [{ login }] = useAuth()
	const { t } = useTranslation()
	const [loading, setLoading] = useState(false)
	const sendNotification = useNotification()

	const formik = useFormik({
		initialValues: {
			login: "",
			password: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setLoading(true)
				const response = await axios.post("/login", values)
				if (response && response.data && response.data.access_token) {
					setLoading(false)
					login(response?.data)
				} else {
					setLoading(false)
				}
			} catch (error) {
				setLoading(false)

				sendNotification({
					msg: error?.response?.data?.message || error?.message,
					variant: "error"
				})
			}
		}
	})

	return (
		<div className="login-wrapper">
			<SectionTitleText
				title={t("login.title")}
				textStyles={"login-sign-up-title login-title text-4xl font-medium mb-4"}
				duration={0.8}
			/>
			<form onSubmit={formik.handleSubmit}>
				<FormTextField
					delay={0.1}
					label={t("common.fields.login")}
					fieldName="login"
					formik={formik}
				/>

				<FormPasswordField
					delay={0.2}
					label={t("common.fields.password")}
					fieldName="password"
					formik={formik}
				/>

				<div className="login-sign-up-action-btn text-center mt-3">
					<Button
						color="primary"
						variant="contained"
						type="submit"
						component={motion.button}
						variants={fadeUp(30, "tween", 0.6, 0.5)}
						initial="hidden"
						animate="show"
						disabled={loading}
					>
						{loading && (
							<CircularProgress size={15} color="inherit" className="mr-1" />
						)}
						{t("login.button")}
					</Button>
				</div>
			</form>
		</div>
	)
}

export default LogIn
