import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormPasswordField from "components/ui/form/FormPasswordField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useFormSubmit from "hooks/useFormSubmit"
import { useTranslation } from "react-i18next"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import * as yup from "yup"

const validationSchema = yup.object({
	name: yup
		.string()
		.min(4, { label: "client.login.validation.nameMin", value: 4 })
		.required("client.login.validation.name"),
	login: yup.string().required("client.login.validation.login"),
	password: yup
		.string()
		.min(6, { label: "client.login.validation.passwordMin", value: 6 })
		.required("client.login.validation.password")
})

const editValidationSchema = yup.object({
	name: yup
		.string()
		.min(4, { label: "client.login.validation.nameMin", value: 4 })
		.required("client.login.validation.name"),
	login: yup.string().required("client.login.validation.login"),
	password: yup
		.string()
		.min(6, { label: "client.login.validation.passwordMin", value: 6 })
})

const ClientLoginAddEditModal = (props) => {
	const { open, setOpen, clientData, refetch } = props
	const { t } = useTranslation()
	const { submit, isSubmitting } = useFormSubmit()

	const formik = useFormik({
		initialValues: {
			name: clientData?.connect?.user?.name
				? clientData?.connect?.user?.name
				: clientData?.name || "",
			login: clientData?.connect?.user?.login || "",
			password: "",
			role_id: ROLE_TYPE_LIST.CUSTOM.code,
			custom_id: clientData?.id
		},
		validationSchema: clientData?.connect
			? editValidationSchema
			: validationSchema,
		onSubmit: async (values) => {
			if (clientData.connect) {
				let newValues = {
					name: values.name,
					status: "1"
				}
				if (values.password.length > 0) newValues.password = values.password
				submit(
					{ type: "put", contentType: "simple" },
					newValues,
					"/admin/staff",
					values.name,
					clientData?.connect?.user_id,
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

	const handleFinishRequest = () => {
		refetch()
		handleClose()
	}

	const handleClose = () => {
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
				{clientData?.connect && formik.values.name ? (
					<span>
						{t("client.login.editTitle", { value: formik.values.name })}
					</span>
				) : (
					<span>{t("client.login.addTitle")}</span>
				)}
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
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
								label={t("common.fields.clientName")}
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
								readOnly={!!clientData?.connect}
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

						<Grid item={true} sm={12} xs={12}>
							<FormActionButtons
								delay={0.4}
								isSubmitting={isSubmitting}
								formType="dialog"
								setOpen={setOpen}
								reset={formik.resetForm}
							/>
						</Grid>
					</Grid>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default ClientLoginAddEditModal
