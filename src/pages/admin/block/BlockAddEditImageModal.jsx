import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormFileUploadField from "components/ui/form/FormFileUploadField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useFormSubmit from "hooks/useFormSubmit"
import React from "react"
import { useTranslation } from "react-i18next"
import * as yup from "yup"

const validationSchema = yup.object({
	name: yup
		.string()
		.min(4, { label: "block.imageModal.validation.nameMin", value: 4 })
		.required("block.imageModal.validation.name"),
	image: yup.mixed().required("block.imageModal.validation.image")
})

const BlockAddEditImageModal = (props) => {
	const { open, setOpen, data } = props
	const { t } = useTranslation()
	const { submit, isSubmitting } = useFormSubmit()

	const formik = useFormik({
		initialValues: {
			name: "",
			image: null
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			// console.log("data = ", data)
			// console.log("values = ", values)
			let newValues = {
				name: values.name,
				image: values.image,
				block_id: data?.id
			}
			if (data && data?.id) {
				submit(
					{ type: "post", contentType: "formData" },
					newValues,
					"/admin/plan",
					{
						title: t("block.imageModal.alerts.success", {
							objectName: data?.objects?.name,
							blockName: data?.name
						})
					},
					null,
					false,
					handleClose
				)
			}
		}
	})

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
				{data && data?.id && (
					<span>
						{t("block.imageModal.title", {
							objectName: data?.objects?.name,
							blockName: data?.name
						})}
					</span>
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
						<Grid item={true} sm={6} xs={12}>
							<FormTextField
								delay={0.1}
								label={t("common.fields.planName")}
								fieldName="name"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} sm={6} xs={12}>
							<FormFileUploadField
								delay={0.2}
								accept=".jpg, .png"
								fieldName="image"
								formik={formik}
								label={t("common.fields.plan")}
								btnLabel={t("block.imageModal.uploadPlan")}
								fileSize={50}
							/>
						</Grid>

						<Grid item={true} sm={12} xs={12}>
							<FormActionButtons
								delay={0.3}
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

export default BlockAddEditImageModal
