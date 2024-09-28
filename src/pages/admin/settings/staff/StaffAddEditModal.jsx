import {
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormAutocompleteField from "components/ui/form/FormAutocompleteField"
import FormPasswordField from "components/ui/form/FormPasswordField"
import FormSwitchField from "components/ui/form/FormSwitchField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useFormSubmit from "hooks/useFormSubmit"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import * as yup from "yup"

const validationSchema = yup.object({
	name: yup
		.string()
		.min(4, { label: "settings.staff.validation.nameMin", value: 4 })
		.required("settings.staff.validation.name"),
	login: yup.string().required("settings.staff.validation.login"),
	password: yup
		.string()
		.min(6, { label: "settings.staff.validation.passwordMin", value: 6 })
		.required("settings.staff.validation.password"),
	role_id: yup.number().required("settings.staff.validation.role")
})

const editValidationSchema = yup.object({
	name: yup
		.string()
		.min(4, { label: "settings.staff.validation.nameMin", value: 4 }),
	login: yup.string().required("settings.staff.validation.login"),
	password: yup
		.string()
		.min(6, { label: "settings.staff.validation.passwordMin", value: 6 }),
	status: yup.number().required("settings.staff.validation.status")
})

const StaffAddEditModal = (props) => {
	const { open, setOpen, setRefetch, itemId, setItemId } = props
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const { submit, isSubmitting } = useFormSubmit()

	const formik = useFormik({
		initialValues: {
			name: "",
			login: "",
			password: "",
			role_id: ""
		},
		validationSchema: itemId ? editValidationSchema : validationSchema,
		onSubmit: async (values) => {
			if (itemId) {
				let newValues = {
					name: values.name,
					login: values.login,
					status: values.status
				}
				if (values.password.length > 0) newValues.password = values.password
				submit(
					{ type: "put", contentType: "simple" },
					newValues,
					"/admin/staff",
					values.name,
					itemId,
					false,
					handleFinishRequest
				)
			} else
				submit(
					{ type: "post", contentType: "simple" },
					values,
					"/admin/staff",
					values.name,
					null,
					false,
					handleFinishRequest
				)
		}
	})

	const { isLoading, isFetching } = useQuery({
		queryKey: "staffSingle",
		queryFn: async function () {
			const response = await axiosPrivate.get(`/admin/staff/edit/${itemId}`)
			return response.data.data
		},
		onSuccess: (data) => {
			formik.setValues({
				name: data.name,
				login: data.login,
				password: "",
				status: data.status
			})
		},
		enabled: !hasError && !!itemId,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	const handleFinishRequest = () => {
		setRefetch(true)
		handleClose()
	}

	const handleClose = () => {
		setItemId("")
		setOpen(false)
		formik.resetForm()
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="lg"
			disableEscapeKeyDown={true}
		>
			<DialogTitle id="alert-dialog-title">
				{itemId && formik.values.name ? (
					<span>
						{t("settings.staff.editTitle", { value: formik.values.name })}
					</span>
				) : (
					<span>{t("settings.staff.addTitle")}</span>
				)}
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				{isLoading || isFetching ? (
					<div className="circular-progress-box py-5">
						<CircularProgress size={35} />
					</div>
				) : (
					<form onSubmit={formik.handleSubmit}>
						<Grid
							container
							spacing={{ xs: 2, sm: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, lg: 12 }}
						>
							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.1}
									label={t("common.fields.staffName")}
									fieldName="name"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.2}
									label={t("common.fields.login")}
									fieldName="login"
									formik={formik}
									readOnly={!!itemId}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormPasswordField
									delay={0.3}
									label={t("common.fields.password")}
									fieldName="password"
									formik={formik}
								/>
							</Grid>

							{!itemId && (
								<Grid item={true} lg={4} sm={6} xs={12}>
									<FormAutocompleteField
										delay={0.4}
										label={t("common.fields.staffRole")}
										fieldName="role_id"
										formik={formik}
										path={"/dictionary/roles"}
									/>
								</Grid>
							)}

							<Grid item={true} sm={12} xs={12}>
								<FormSwitchField
									delay={0.5}
									label={t("common.fields.status")}
									fieldName="status"
									formik={formik}
									options={[
										{
											value: "1",
											checked: true
										},
										{
											value: "0",
											checked: false
										}
									]}
								/>
							</Grid>

							<Grid item={true} sm={12} xs={12}>
								<FormActionButtons
									delay={0.6}
									isSubmitting={isSubmitting}
									formType="dialog"
									setOpen={setOpen}
									reset={formik.resetForm}
								/>
							</Grid>
						</Grid>
					</form>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default StaffAddEditModal
