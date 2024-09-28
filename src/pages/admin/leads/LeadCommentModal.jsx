import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import { useFormik } from "formik"
import useFormSubmit from "hooks/useFormSubmit"
import * as yup from "yup"
import FormMultilineTextField from "components/ui/form/FormMultilineTextField"
import { useTranslation } from "react-i18next"

const validationSchema = yup.object({
	comment: yup.string().required("lead.commentModal.validation.comment")
})

const LeadCommentModal = (props) => {
	const {
		open,
		setOpen,
		itemId,
		setItemId = () => {},
		refetch = () => {}
	} = props
	const { submit, isSubmitting } = useFormSubmit()
	const { t } = useTranslation()

	const formik = useFormik({
		initialValues: {
			comment: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			submit(
				{ type: "post", contentType: "simple" },
				values,
				`/operator/lead/addcomment/${itemId}`,
				{ title: t("lead.commentModal.alerts.success") },
				null,
				true,
				handleFinishRequest
			)
		}
	})

	const handleFinishRequest = () => {
		refetch()
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
				<span>{t("lead.commentModal.title")}</span>
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
						<Grid item={true} sm={12} xs={12}>
							<FormMultilineTextField
								delay={0.1}
								label={t("common.fields.comment")}
								fieldName="comment"
								formik={formik}
								rows={4}
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

export default LeadCommentModal
