import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormAutocompleteField from "components/ui/form/FormAutocompleteField"
import FormCheckboxField from "components/ui/form/FormCheckboxField"
import FormNumberField from "components/ui/form/FormNumberField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import * as yup from "yup"

const validationSchema = yup.object({
	name: yup
		.string()
		.min(3, { label: "block.addModal.validation.nameMin", value: 3 })
		.required("block.addModal.validation.name"),
	objects_id: yup.number().required("block.addModal.validation.objectId"),
	room_number: yup.number().required("block.addModal.validation.homesOnFloor"),
	start: yup.number().required("block.addModal.validation.startNumber"),
	hasBasement: yup.string().optional()
})

const BlockAddModal = (props) => {
	const { open, setOpen, setRefetch } = props
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const sendNotification = useNotification()

	const formik = useFormik({
		initialValues: {
			name: "",
			objects_id: "",
			room_number: "",
			start: "",
			hasBasement: "0"
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setIsSubmitting(true)
				const response = await axiosPrivate.post(
					"/admin/block/store",
					JSON.stringify(values),
					{ headers: { "Content-Type": "application/json" } }
				)
				if (response.data && response.data.status) {
					sendNotification({
						msg: t("block.addModal.alerts.success", { value: values.name }),
						variant: "success"
					})
					setIsSubmitting(false)
					setRefetch(true)
					handleClose()
				}
			} catch (error) {
				sendNotification({
					msg: error?.response?.data?.message || error?.message,
					variant: "error"
				})
				setIsSubmitting(false)
			}
		}
	})

	const handleClose = () => {
		formik.resetForm()
		setOpen(false)
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
				<span>{t("block.addModal.title")}</span>
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
								label={t("common.fields.blockName")}
								fieldName="name"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormNumberField
								delay={0.2}
								label={t("common.fields.roomsOnFloor")}
								fieldName="room_number"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormAutocompleteField
								delay={0.3}
								fieldName="objects_id"
								label={t("common.fields.objectName")}
								formik={formik}
								path={"/dictionary/objects2"}
							/>
						</Grid>

						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormNumberField
								delay={0.4}
								label={t("common.fields.orderNumber")}
								fieldName="start"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormCheckboxField
								delay={0.5}
								label={t("common.fields.hasBasement")}
								fieldName="hasBasement"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} sm={12} xs={12}>
							<FormActionButtons
								delay={0.5}
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

export default BlockAddModal
