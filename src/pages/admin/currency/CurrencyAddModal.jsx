import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormCurrencyField from "components/ui/form/FormCurrencyField"
import { useFormik } from "formik"
import useFormSubmit from "hooks/useFormSubmit"
import { useTranslation } from "react-i18next"
import * as yup from "yup"

const validationSchema = yup.object({
	sum: yup.number().required("currency.modal.validation.sum")
})

const CurrencyAddModal = (props) => {
	const { open, setOpen, setRefetch } = props
	const { t } = useTranslation()
	const { submit, isSubmitting } = useFormSubmit()

	const formik = useFormik({
		initialValues: {
			sum: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			submit(
				{ type: "post", contentType: "simple" },
				values,
				"/admin/valute",
				{
					title: t("currency.modal.alerts.success")
				},
				null,
				false,
				handleFinish
			)
		}
	})

	const handleFinish = () => {
		setRefetch(true)
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
				<span className="pr-5">{t("currency.modal.title")}</span>
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
						<Grid item={true} sm={12} xs={12}>
							<FormCurrencyField
								delay={0.1}
								label={t("common.fields.currencyInSum")}
								fieldName="sum"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} sm={12} xs={12}>
							<FormActionButtons
								delay={0.2}
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

export default CurrencyAddModal
