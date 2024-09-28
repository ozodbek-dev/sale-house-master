import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
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
		.min(4, { label: "lead.typeModal.validation.name", value: 4 })
})

const TypeAddEditModal = (props) => {
	const { open, setOpen, setRefetch, userId } = props
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [typesList, setTypesList] = useState([])
	const { submit, isSubmitting } = useFormSubmit()

	const formik = useFormik({
		initialValues: {
			name: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			if (values.name) {
				let newValues = { name: values.name, user_id: userId }
				submit(
					{ type: "post", contentType: "simple" },
					newValues,
					"/admin/lead/typecreate",
					newValues.name,
					null,
					true,
					handleFinishRequest
				)
			}
		}
	})

	const { isLoading, isFetching } = useQuery({
		queryKey: "leadTypes",
		queryFn: async function () {
			const response = await axiosPrivate.get("/dictionary/leadtypes")
			return response.data.data
		},
		onSuccess: (data) => {
			setTypesList([...data.map((item) => ({ ...item, editable: false }))])
		},
		enabled: !hasError,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	const handleChangeEditable = (typeId) => {
		let foundSource = typesList.find((item) => item.id === typeId)
		foundSource.editable = !foundSource.editable
		setTypesList([...typesList])
	}

	const handleChangeItemLabel = (typeId, newLabel) => {
		let foundSource = typesList.find((item) => item.id === typeId)
		foundSource.name = newLabel
		setTypesList([...typesList])
	}

	const handleFinishRequest = () => {
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
				<span>{t("lead.typeModal.title")}</span>
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
							<Grid item={true} sm={6} xs={12}>
								<FormTextField
									delay={0.1}
									label={t("common.fields.typeName")}
									fieldName="name"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} sm={12} xs={12}>
								<div>
									<div className="font-medium text-lg">
										{t("lead.typeModal.list")}
									</div>
									<div>
										{typesList.map((item) => (
											<div className="flex flex-row" key={item.id}>
												<TextField
													color="formColor"
													variant="outlined"
													fullWidth
													id={`type-${item.id}`}
													name={`type-${item.id}`}
													value={item.name}
													onChange={(event) =>
														handleChangeItemLabel(item.id, event.target.value)
													}
													InputProps={{
														readOnly: !item.editable
													}}
													autoComplete="off"
												/>
												<Button
													variant={
														!item.editable
															? "actionLarge"
															: "actionLargeOutlined"
													}
													color="warning"
													className="!ml-2 !mt-2"
													onClick={() => handleChangeEditable(item.id)}
												>
													<i className="bi bi-pencil-square" />
												</Button>
											</div>
										))}
									</div>
								</div>
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
				)}
			</DialogContent>
		</Dialog>
	)
}

export default TypeAddEditModal
