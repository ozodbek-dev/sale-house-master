import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormAutocompleteField from "components/ui/form/FormAutocompleteField"
import FormCurrencyField from "components/ui/form/FormCurrencyField"
import FormMultilineTextField from "components/ui/form/FormMultilineTextField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import * as yup from "yup"

const validationSchema = yup.object({
	sum: yup.number().required("expense.modal.validation.sum"),
	payment_type: yup.number().required("expense.modal.validation.paymentType"),
	comment: yup.string("expense.modal.validation.comment").optional()
})

const RasxodAddModal = (props) => {
	const { open, setOpen, setRefetch } = props
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const sendNotification = useNotification()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const formik = useFormik({
		initialValues: {
			sum: "",
			payment_type: "",
			comment: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setIsSubmitting(true)
				const response = await axiosPrivate.post(
					"/accounter/rasxod/store",
					JSON.stringify(values),
					{ headers: { "Content-Type": "application/json" } }
				)
				if (response.data && response.data.status) {
					sendNotification({
						msg: t("expense.modal.alerts.success"),
						variant: "success"
					})
					setIsSubmitting(false)
					handleClose()
					setRefetch(true)
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
				<span className="pr-5">{t("expense.modal.title")}</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<form onSubmit={formik.handleSubmit} className="pt-2">
					<Grid
						container
						spacing={{ xs: 2, sm: 2 }}
						rowSpacing={1}
						columns={{ xs: 12, sm: 12 }}
					>
						<Grid item={true} sm={6} xs={12}>
							<FormCurrencyField
								delay={0.1}
								label={t("expense.modal.fields.sum")}
								fieldName="sum"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} sm={6} xs={12}>
							<FormAutocompleteField
								delay={0.2}
								label={t("expense.modal.fields.paymentType")}
								fieldName="payment_type"
								formik={formik}
								path={"/dictionary/types"}
							/>
						</Grid>

						<Grid item={true} sm={12} xs={12}>
							<FormMultilineTextField
								delay={0.3}
								label={t("expense.modal.fields.comment")}
								fieldName="comment"
								formik={formik}
								rows={3}
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

export default RasxodAddModal
