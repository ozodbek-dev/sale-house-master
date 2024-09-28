import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormCurrencyField from "components/ui/form/FormCurrencyField"
import FormDateField from "components/ui/form/FormDateField"
import FormSelectField from "components/ui/form/FormSelectField"
import FormSimpleSelectField from "components/ui/form/FormSimpleSelectField"
import CurrencySubContent from "components/ui/text-formats/CurrencySubContent"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { currencyTypeSelectOptions } from "shared/selectOptionsList"
import * as yup from "yup"

const validationSchema = yup.object({
	sum: yup.number().required("change.paymentUpdateModal.validation.sum"),
	type_id: yup.number().required("change.paymentUpdateModal.validation.typeId"),
	date: yup
		.date()
		.typeError("change.paymentUpdateModal.validation.dateValid")
		.default(new Date())
		.required("change.paymentUpdateModal.validation.date"),
	isvalute: yup.string().optional()
})

const PaymentUpdateModal = (props) => {
	const { open, setOpen, refetch, data: paymentData, currency = "0" } = props
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const sendNotification = useNotification()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const formik = useFormik({
		initialValues: {
			sum: paymentData.sum || "",
			type_id: paymentData.type_id || "",
			date: paymentData.date || new Date(),
			isvalute: currency || "0"
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setIsSubmitting(true)
				const response = await axiosPrivate.post(
					`/accounter/payment/update/${paymentData?.id}`,
					JSON.stringify(values),
					{ headers: { "Content-Type": "application/json" } }
				)
				if (response.data && response.data.status) {
					sendNotification({
						msg: t("change.paymentUpdateModal.alerts.success"),
						variant: "success"
					})
					setIsSubmitting(false)
					handleClose()
					refetch()
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

	/* const handleCurrencyChange = (value) => {
		formik.setFieldValue("isvalute", value, true)
		if (currencyData && currencyData.sum) {
			if (value === "1") {
				formik.setFieldValue(
					"sum",
					parseFloat(
						parseFloat(formik.values.sum / currencyData.sum).toFixed(1)
					),
					true
				)
			} else if (value === "0") {
				formik.setFieldValue(
					"sum",
					parseFloat(formik.values.sum * currencyData.sum),
					true
				)
			}
		}
	} */

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
				<span className="pr-5">{t("change.paymentUpdateModal.title")}</span>
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
						spacing={{ xs: 2, sm: 2 }}
						rowSpacing={1}
						columns={{ xs: 12, sm: 12 }}
					>
						<Grid item={true} sm={6} xs={12}>
							<FormSimpleSelectField
								delay={0.1}
								label={t("common.fields.currency")}
								options={currencyTypeSelectOptions}
								fieldName="isvalute"
								formik={formik}
								changeFn={(value) =>
									formik.setFieldValue("isvalute", value, true)
								}
								itemValue="code"
								itemLabel="label"
								disabled={true}
								readOnly={true}
							/>
						</Grid>

						<Grid item={true} sm={6} xs={12}>
							<FormCurrencyField
								delay={0.2}
								label={t("common.fields.paymentAmount")}
								fieldName="sum"
								formik={formik}
								decimalScale={1}
							/>
							{formik.values.isvalute === "1" && !isNaN(formik.values.sum) && (
								<CurrencySubContent value={formik.values.sum} delay={0.2} />
							)}
						</Grid>

						<Grid item={true} sm={6} xs={12}>
							<FormSelectField
								delay={0.3}
								label={t("common.fields.typeId")}
								fieldName="type_id"
								formik={formik}
								path={"/dictionary/types"}
							/>
						</Grid>

						<Grid item={true} sm={6} xs={12}>
							<FormDateField
								delay={0.4}
								label={t("common.fields.paymentDate")}
								fieldName="date"
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

export default PaymentUpdateModal
