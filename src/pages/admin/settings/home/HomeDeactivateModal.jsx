import {
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select
} from "@mui/material"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import * as yup from "yup"
import HOME_TYPE from "shared/homeTypeList"
import FormSelectChangeFnField from "components/ui/form/FormSelectChangeFnField"
import FormActionButtons from "components/ui/form/FormActionButtons"
import { Trans, useTranslation } from "react-i18next"

const validationSchema = yup.object({
	homeObjectId: yup
		.number()
		.required("settings.home.modal.deactivate.validation.objectId"),
	homeBlockId: yup
		.number()
		.required("settings.home.modal.deactivate.validation.blockId"),
	homeId: yup
		.string()
		.required("settings.home.modal.deactivate.validation.homeId")
})

const HomeDeactivateModal = ({ open, setOpen, refetch }) => {
	const { t } = useTranslation()
	const [hasError, setHasError] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()

	const formikHome = useFormik({
		initialValues: {
			homeObjectId: "",
			homeBlockId: "",
			homeId: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setIsSubmitting(true)
				const response = await axiosPrivate.post(
					`/changer/deactivate/${values.homeId}`,
					{ headers: { "Content-Type": "application/json" } }
				)
				if (response.data && response.data.status) {
					sendNotification({
						msg: t("settings.home.modal.deactivate.alerts.success"),
						variant: "success"
					})
					refetch()
					setIsSubmitting(false)
					handleClose()
				}
			} catch (error) {
				sendNotification({
					msg: error?.response?.data?.message || error?.message,
					variant: "error"
				})
				refetch()
				setIsSubmitting(false)
			}
		}
	})

	const homes = useQuery({
		queryKey: "homesSelect",
		queryFn: async function () {
			const response = await axiosPrivate.get(
				`admin/home/index/${formikHome?.values?.homeBlockId}`
			)
			return response.data.data
		},
		enabled: !hasError && !!formikHome?.values?.homeBlockId,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	useEffect(() => {
		if (formikHome?.values?.homeBlockId) {
			homes.refetch()
		}
	}, [formikHome?.values?.homeBlockId])

	const setHomesByStatus = (homes) => {
		return homes.filter((item) => item.status === HOME_TYPE.ACTIVE.code)
	}

	const handleClose = () => {
		formikHome.resetForm()
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
			<DialogTitle id="order-dialog-title">
				<span className="text-xl">
					{t("settings.home.modal.deactivate.title")}
				</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div className="w-full pb-8 order-home-modal-wrapper">
					<div className="home-form-wrapper w-full min-w-[550px]">
						<form onSubmit={formikHome.handleSubmit}>
							<Grid
								container
								spacing={{ xs: 2, sm: 3, lg: 3 }}
								rowSpacing={1}
								columns={{ xs: 12, sm: 12, lg: 12 }}
							>
								<Grid item={true} sm={6} xs={12}>
									<FormSelectChangeFnField
										delay={0}
										label={t("common.fields.objectName")}
										fieldName="homeObjectId"
										formik={formikHome}
										path={"/dictionary/objects2"}
										changeFn={(value) => {
											formikHome.setFieldValue("homeObjectId", value, true)
											formikHome.setFieldValue("homeBlockId", "", true)
											formikHome.setFieldValue("homeId", "", true)
										}}
									/>
								</Grid>

								{formikHome.values.homeObjectId && (
									<Grid item={true} sm={6} xs={12}>
										<FormSelectChangeFnField
											delay={0}
											label={t("common.fields.blockName")}
											fieldName="homeBlockId"
											formik={formikHome}
											path={`admin/block/index/${formikHome?.values?.homeObjectId}`}
											changeFn={(value) => {
												formikHome.setFieldValue("homeBlockId", value, true)
												formikHome.setFieldValue("homeId", "", true)
											}}
											pathChangeable={true}
										/>
									</Grid>
								)}

								{formikHome.values.homeBlockId && (
									<Grid item={true} sm={6} xs={12}>
										<FormControl
											fullWidth
											color="formColor"
											error={
												formikHome.touched.homeId &&
												Boolean(formikHome.errors.homeId)
											}
										>
											<InputLabel id="homeId-label">
												{t("common.fields.homeNumber")}
											</InputLabel>
											<Select
												labelId="homeId-label"
												id="homeId-select"
												label={t("common.fields.homeNumber")}
												onChange={(event) => {
													formikHome.setFieldValue(
														"homeId",
														event.target.value,
														true
													)
												}}
												value={
													homes.isLoading || homes.isFetching
														? ""
														: formikHome.values.homeId
												}
												color="formColor"
												variant="outlined"
												role="presentation"
												MenuProps={{ id: "homeId-select-menu" }}
											>
												{homes.isLoading || homes.isFetching ? (
													<div className="circular-progress-box">
														<CircularProgress size={25} />
													</div>
												) : homes.data && homes.data.length > 0 ? (
													setHomesByStatus(homes.data).map((item, index) => (
														<MenuItem value={item.id} key={index + 1}>
															<div>
																№{item.number}{" "}
																<span className="text-sm text-gray-600">
																	(
																	<Trans
																		i18nKey="settings.home.modal.deactivate.details"
																		values={{
																			stage: item?.stage,
																			rooms: item?.rooms,
																			square: item?.square
																		}}
																	>
																		{item?.stage}-qavat, {item?.rooms} xonali,{" "}
																		{item?.square} m<sup>2</sup>
																	</Trans>
																	)
																</span>
															</div>
														</MenuItem>
													))
												) : (
													<div>
														<span className="no-data-found-wrapper select-box">
															<i className="bi bi-exclamation-octagon text-lg mr-1" />{" "}
															{t("common.global.noDataFound")}
														</span>
													</div>
												)}
											</Select>
											<FormHelperText
												children={
													<span>
														{formikHome.touched.homeId &&
															t(formikHome.errors.homeId)}
													</span>
												}
												error={
													formikHome.touched.homeId &&
													Boolean(formikHome.errors.homeId)
												}
											/>
										</FormControl>
									</Grid>
								)}
								<Grid item={true} sm={12} xs={12}>
									<FormActionButtons
										delay={0}
										isSubmitting={isSubmitting}
										onlySave={true}
									/>
								</Grid>
							</Grid>
						</form>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default HomeDeactivateModal
