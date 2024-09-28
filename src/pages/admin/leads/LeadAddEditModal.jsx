import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormPhoneField from "components/ui/form/FormPhoneField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import { motion } from "framer-motion"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useFormSubmit from "hooks/useFormSubmit"
import React, { useState } from "react"
import { useQuery } from "react-query"
import { fadeUp } from "utils/motion"
import * as yup from "yup"
import SourceAddEditModal from "./SourceAddEditModal"
import useAuth from "hooks/useAuth"
import FormDateField from "components/ui/form/FormDateField"
import FormSelectField from "components/ui/form/FormSelectField"
import TypeAddEditModal from "./TypeAddEditModal"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import { useTranslation } from "react-i18next"

const validationSchema = yup.object({
	name: yup
		.string()
		.min(4, { label: "lead.addEditModal.validation.nameMin", value: 4 })
		.required("lead.addEditModal.validation.name"),
	phone: yup
		.string()
		.length(17, "lead.addEditModal.validation.phoneValid")
		.required("lead.addEditModal.validation.phone"),
	come_id: yup.string().required("lead.addEditModal.validation.comeId"),
	type_id: yup.string().required("lead.addEditModal.validation.typeId"),
	date: yup
		.date()
		.typeError("lead.addEditModal.validation.dateValid")
		.default(new Date())
		.required("lead.addEditModal.validation.date")
})

const LeadAddEditModal = (props) => {
	const { open, setOpen, setRefetch, itemId, setItemId } = props
	const { t } = useTranslation()
	const [{ user }] = useAuth()
	const axiosPrivate = useAxiosPrivate()
	const [sourceOptionsRefetch, setSourceOptionsRefetch] = useState(false)
	const [typeOptionsRefetch, setTypeOptionsRefetch] = useState(false)
	const [openSourceModal, setOpenSourceModal] = useState(false)
	const [openTypeModal, setOpenTypeModal] = useState(false)
	const [hasError, setHasError] = useState(false)
	const { submit, isSubmitting } = useFormSubmit()

	const formik = useFormik({
		initialValues: {
			name: "",
			phone: "",
			come_id: "",
			type_id: "",
			date: null
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			let newValues = { ...values, user_id: user.user.id }
			if (itemId) {
				submit(
					{ type: "postUpdate", contentType: "simple" },
					newValues,
					"/operator/lead",
					newValues.name,
					itemId,
					false,
					handleFinishRequest
				)
			} else {
				submit(
					{ type: "post", contentType: "simple" },
					newValues,
					"/operator/lead",
					newValues.name,
					null,
					false,
					handleFinishRequest
				)
			}
		}
	})

	const { isLoading, isFetching } = useQuery({
		queryKey: "leadSingle",
		queryFn: async function () {
			const response = await axiosPrivate.get(`/operator/lead/edit/${itemId}`)
			return response.data.data
		},
		onSuccess: (data) => {
			formik.setValues({
				name: data?.lead?.name,
				phone: data?.lead?.phone,
				come_id: data?.lead?.come_id,
				type_id: data?.lead?.type_id,
				date: data?.lead?.date
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
					<span>{t("lead.addEditModal.editTitle")}</span>
				) : (
					<span>{t("lead.addEditModal.addTitle")}</span>
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
									label={t("common.fields.clientName")}
									fieldName="name"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormPhoneField
									delay={0.2}
									label={t("common.fields.phone")}
									fieldName="phone"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<div className="flex flex-row">
									<FormSelectField
										delay={0.3}
										label={t("common.fields.source")}
										fieldName="come_id"
										formik={formik}
										path={"/dictionary/leadcomes"}
										emitRefetch={{
											refetch: sourceOptionsRefetch,
											setRefetch: setSourceOptionsRefetch
										}}
									/>
									{user?.user?.role === ROLE_TYPE_LIST.ADMIN.code && (
										<Button
											type="button"
											component={motion.button}
											variants={fadeUp(30, "tween", 0.3, 0.5)}
											initial="hidden"
											animate="show"
											viewport={{ once: true, amount: 0.25 }}
											variant="actionLarge"
											className="!ml-2 !mt-2"
											onClick={() => setOpenSourceModal(true)}
										>
											<i className="bi bi-plus-lg" />
										</Button>
									)}
								</div>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<div className="flex flex-row">
									<FormSelectField
										delay={0.4}
										label={t("common.fields.interest")}
										fieldName="type_id"
										formik={formik}
										path={"/dictionary/leadtypes"}
										emitRefetch={{
											refetch: typeOptionsRefetch,
											setRefetch: setTypeOptionsRefetch
										}}
									/>
									{user?.user?.role === ROLE_TYPE_LIST.ADMIN.code && (
										<Button
											type="button"
											component={motion.button}
											variants={fadeUp(30, "tween", 0.4, 0.5)}
											initial="hidden"
											animate="show"
											viewport={{ once: true, amount: 0.25 }}
											variant="actionLarge"
											color="primary"
											className="!ml-2 !mt-2"
											onClick={() => setOpenTypeModal(true)}
										>
											<i className="bi bi-plus-lg" />
										</Button>
									)}
								</div>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormDateField
									delay={0.5}
									label={t("common.fields.date")}
									fieldName="date"
									formik={formik}
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

				{openSourceModal && (
					<SourceAddEditModal
						userId={user?.user?.id}
						open={openSourceModal}
						setOpen={setOpenSourceModal}
						setRefetch={setSourceOptionsRefetch}
					/>
				)}

				{openTypeModal && (
					<TypeAddEditModal
						userId={user?.user?.id}
						open={openTypeModal}
						setOpen={setOpenTypeModal}
						setRefetch={setTypeOptionsRefetch}
					/>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default LeadAddEditModal
