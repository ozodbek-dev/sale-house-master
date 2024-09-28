import {
	Button,
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
import { useQueries } from "react-query"
import * as yup from "yup"
import useAuth from "hooks/useAuth"
import HOME_TYPE from "shared/homeTypeList"
import FormDateField from "components/ui/form/FormDateField"
import { Trans, useTranslation } from "react-i18next"

const homeValidationSchema = yup.object({
	objectId: yup
		.number()
		.required("contract.modal.homeOrder.validation.objectId"),
	blockId: yup.number().required("contract.modal.homeOrder.validation.blockId"),
	home_id: yup.string().required("contract.modal.homeOrder.validation.homeId"),
	date: yup
		.date()
		.nullable()
		.typeError("contract.modal.homeOrder.validation.dateValid")
		.required("contract.modal.homeOrder.validation.date")
})

const ContractHomeOrderModal = (props) => {
	const { open, setOpen, refetch, customerId: myId } = props
	const { t } = useTranslation()
	const [hasError, setHasError] = useState(false)
	const [isOrderSubmitting, setIsOrderSubmitting] = useState(false)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()
	const [{ user }] = useAuth()

	const formikHome = useFormik({
		initialValues: {
			objectId: "",
			blockId: "",
			home_id: "",
			date: ""
		},
		validationSchema: homeValidationSchema,
		onSubmit: async (values) => {}
	})

	const [objects, blocks, homes] = useQueries([
		{
			queryKey: "objectsSelect",
			queryFn: async function () {
				const response = await axiosPrivate.get("/dictionary/objects2")
				return response.data.data
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "blocksSelect",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`admin/block/index/${formikHome?.values?.objectId}`
				)
				return response.data.data
			},
			enabled: !hasError && !!formikHome?.values?.objectId,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "homesSelect",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`admin/home/index/${formikHome?.values?.blockId}`
				)
				return response.data.data
			},
			enabled: !hasError && !!formikHome?.values?.blockId,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		}
	])

	useEffect(() => {
		if (formikHome?.values?.objectId) {
			blocks.refetch()
		}
	}, [formikHome?.values?.objectId])

	useEffect(() => {
		if (formikHome?.values?.blockId) {
			homes.refetch()
		}
	}, [formikHome?.values?.blockId])

	const handleOrderFinish = () => {
		refetch()
		handleClose()
	}

	const handleClose = () => {
		formikHome.resetForm()
		setOpen(false)
	}

	const handleOrder = async () => {
		let values = {
			home_id: formikHome.values.home_id,
			custom_id: myId,
			user_id: user.user.id,
			date: formikHome.values.date
		}

		try {
			setIsOrderSubmitting(true)
			const response = await axiosPrivate.post(
				"/admin/order/store",
				JSON.stringify(values),
				{ headers: { "Content-Type": "application/json" } }
			)
			if (response.data && response.data.status && response.data.data) {
				sendNotification({
					msg: t("contract.modal.homeOrder.alerts.success"),
					variant: "success"
				})
				setIsOrderSubmitting(false)
				handleOrderFinish()
			}
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsOrderSubmitting(false)
		}
	}

	const setHomesByStatus = (homes) => {
		return homes.filter((item) => item.status === HOME_TYPE.ACTIVE.code)
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
				<span className="text-xl">{t("contract.modal.homeOrder.title")}</span>
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
									<FormControl
										fullWidth
										color="formColor"
										error={
											formikHome.touched.objectId &&
											Boolean(formikHome.errors.objectId)
										}
									>
										<InputLabel id="objectId-label">
											{t("common.fields.objectName")}
										</InputLabel>
										<Select
											labelId="objectId-label"
											id="objectId-select"
											label={t("common.fields.objectName")}
											onChange={(event) => {
												formikHome.setFieldValue(
													"objectId",
													event.target.value,
													true
												)
												formikHome.setFieldValue("blockId", "", true)
												formikHome.setFieldValue("home_id", "", true)
											}}
											value={
												objects.isLoading || objects.isFetching
													? ""
													: formikHome.values.objectId
											}
											color="formColor"
											variant="outlined"
											role="presentation"
											MenuProps={{ id: "objectId-select-menu" }}
										>
											{objects.isLoading || objects.isFetching ? (
												<div className="circular-progress-box">
													<CircularProgress size={25} />
												</div>
											) : objects.data && objects.data.length > 0 ? (
												objects.data.map((item, index) => (
													<MenuItem value={item.id} key={index + 1}>
														{item.name}
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
													{formikHome.touched.objectId &&
														t(formikHome.errors.objectId)}
												</span>
											}
											error={
												formikHome.touched.objectId &&
												Boolean(formikHome.errors.objectId)
											}
										/>
									</FormControl>
								</Grid>

								{formikHome.values.objectId && (
									<Grid item={true} sm={6} xs={12}>
										<FormControl
											fullWidth
											color="formColor"
											error={
												formikHome.touched.objectId &&
												Boolean(formikHome.errors.objectId)
											}
										>
											<InputLabel id="blockId-label">
												{t("common.fields.blockName")}
											</InputLabel>
											<Select
												labelId="blockId-label"
												id="blockId-select"
												label={t("common.fields.blockName")}
												onChange={(event) => {
													formikHome.setFieldValue(
														"blockId",
														event.target.value,
														true
													)
													formikHome.setFieldValue("home_id", "", true)
												}}
												value={
													blocks.isLoading || blocks.isFetching
														? ""
														: formikHome.values.blockId
												}
												color="formColor"
												variant="outlined"
												role="presentation"
												MenuProps={{ id: "blockId-select-menu" }}
											>
												{blocks.isLoading || blocks.isFetching ? (
													<div className="circular-progress-box">
														<CircularProgress size={25} />
													</div>
												) : blocks.data && blocks.data.length > 0 ? (
													blocks.data.map((item, index) => (
														<MenuItem value={item.id} key={index + 1}>
															{item.name}
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
														{formikHome.touched.blockId &&
															t(formikHome.errors.blockId)}
													</span>
												}
												error={
													formikHome.touched.blockId &&
													Boolean(formikHome.errors.blockId)
												}
											/>
										</FormControl>
									</Grid>
								)}

								{formikHome.values.blockId && (
									<Grid item={true} sm={6} xs={12}>
										<FormControl
											fullWidth
											color="formColor"
											error={
												formikHome.touched.objectId &&
												Boolean(formikHome.errors.objectId)
											}
										>
											<InputLabel id="home_id-label">
												{t("common.fields.homeNumber")}
											</InputLabel>
											<Select
												labelId="home_id-label"
												id="home_id-select"
												label={t("common.fields.homeNumber")}
												onChange={(event) => {
													formikHome.setFieldValue(
														"home_id",
														event.target.value,
														true
													)
												}}
												value={
													homes.isLoading || homes.isFetching
														? ""
														: formikHome.values.home_id
												}
												color="formColor"
												variant="outlined"
												role="presentation"
												MenuProps={{ id: "home_id-select-menu" }}
											>
												{homes.isLoading || homes.isFetching ? (
													<div className="circular-progress-box">
														<CircularProgress size={25} />
													</div>
												) : homes.data && homes.data.length > 0 ? (
													setHomesByStatus(homes.data).map((item, index) => {
														if (item.status === "1") {
															return (
																<MenuItem value={item.id} key={index + 1}>
																	<div>
																		№{item.number}{" "}
																		<span className="text-sm text-gray-600">
																			(
																			<Trans
																				i18nKey="contract.modal.homeOrder.details"
																				values={{
																					stage: item?.stage,
																					rooms: item?.rooms,
																					square: item?.square
																				}}
																			>
																				{item?.stage}-qavat, {item?.rooms}{" "}
																				xonali, {item?.square} m<sup>2</sup>
																			</Trans>
																			)
																		</span>
																	</div>
																</MenuItem>
															)
														}
														return ""
													})
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
														{formikHome.touched.home_id &&
															t(formikHome.errors.home_id)}
													</span>
												}
												error={
													formikHome.touched.home_id &&
													Boolean(formikHome.errors.home_id)
												}
											/>
										</FormControl>
									</Grid>
								)}

								<Grid item={true} sm={6} xs={12}>
									<FormDateField
										delay={0.1}
										label={t("contract.modal.homeOrder.lastDate")}
										formik={formikHome}
										fieldName="date"
									/>
								</Grid>
							</Grid>
						</form>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<Button
						variant="contained"
						color="primary"
						disabled={!formikHome.isValid || isOrderSubmitting}
						onClick={handleOrder}
					>
						{isOrderSubmitting && (
							<CircularProgress size={15} color="inherit" className="mr-1" />
						)}
						{t("common.button.order")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ContractHomeOrderModal
