import {
	Button,
	ButtonBase,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton
} from "@mui/material"
import FormTextField from "components/ui/form/FormTextField"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { Fragment, useState } from "react"
import getLabelByTypeList from "utils/getLabelByTypeList"
import REPAIR_TYPE from "shared/repairTypeList"
import RESIDENT_TYPE from "shared/residentTypeList"
import * as yup from "yup"
import FormPhoneField from "components/ui/form/FormPhoneField"
import SimpleDateField from "components/ui/simple-fields/date-picker/SimpleDateField"
import useAuth from "hooks/useAuth"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import ImagePreviewDialog from "components/ui/dialogs/ImagePreviewDialog"
import { Trans, useTranslation } from "react-i18next"

const validationSchema = yup.object({
	name: yup.string().required("order.modal.add.validation.name"),
	middlename: yup.string().required("order.modal.add.validation.middleName"),
	surname: yup.string().required("order.modal.add.validation.surname"),
	phone: yup
		.string()
		.length(17, "order.modal.add.validation.phoneValid")
		.required("order.modal.add.validation.phone")
})

const OrderAddModal = (props) => {
	const { open, setOpen, data: homeData, setRefetch } = props
	const { t } = useTranslation()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isOrderSubmitting, setIsOrderSubmitting] = useState(false)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()
	const [client, setClient] = useState("")
	const [customerId, setCustomerId] = useState("")
	const [date, setDate] = useState("")
	const [{ user }] = useAuth()
	const [clientsList, setClientsList] = useState([])
	const [clientsLoading, setClientsLoading] = useState(false)
	const [openHomeLayoutImageDialog, setOpenHomeLayoutImageDialog] =
		useState(false)

	const initialValues = {
		name: "",
		middlename: "",
		surname: "",
		phone: ""
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setIsSubmitting(true)
				const response = await axiosPrivate.post(
					"/admin/custom/store",
					JSON.stringify(values),
					{ headers: { "Content-Type": "application/json" } }
				)
				if (response.data && response.data.status && response.data.data) {
					sendNotification({
						msg: t("order.modal.add.alerts.clientSuccess"),
						variant: "success"
					})
					setIsSubmitting(false)
					setClient(response.data.data)
					setCustomerId("")
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
		setCustomerId("")
		setClient("")
		setDate("")
		setClientsList([])
		setOpen(false)
		formik.resetForm()
	}

	const handleClient = (client) => {
		Array.from(document.getElementsByClassName("client-wrapper")).forEach(
			(item) =>
				item.id !== `client-${client.id}` &&
				item.classList.remove("item-selected")
		)
		document
			.getElementById(`client-${client.id}`)
			.classList.toggle("item-selected")
		formik.setValues(initialValues)
		if (customerId === client.id) {
			setCustomerId("")
		} else {
			setCustomerId(client.id)
			formik.setValues({
				name: client.name,
				middlename: client.middlename,
				surname: client.surname,
				phone: client.phone
			})
		}
	}

	const handleOrder = async () => {
		let values = {
			home_id: homeData.id,
			custom_id: customerId,
			user_id: user.user.id,
			date: date
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
					msg: t("order.modal.add.alerts.homeSuccess"),
					variant: "success"
				})
				setIsOrderSubmitting(false)
				setRefetch(true)
				handleClose()
			}
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsOrderSubmitting(false)
		}
	}

	const handleKeyDown = async (event) => {
		if (event.keyCode === 13) {
			setCustomerId("")
			setClientsLoading(true)
			const response = await axiosPrivate.get(
				`/dictionary/customs?name=${formik.values.name || ""}&surname=${
					formik.values.surname || ""
				}`
			)
			if (response.data && response.data.status) {
				setClientsList(response.data.data.data)
			}
			setClientsLoading(false)
		}
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
				<span className="text-xl">{t("order.modal.add.title")}</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div className="flex md:flex-row flex-col pb-8 order-home-modal-wrapper">
					<div className="lg:w-1/3 md:w-1/2 w-full home-client-wrapper">
						<form onSubmit={formik.handleSubmit}>
							<Grid container spacing={2} rowSpacing={1} columns={12}>
								<Grid item={true} xs={12}>
									<FormTextField
										delay={0}
										label={t("common.fields.name")}
										fieldName="name"
										formik={formik}
										onKeyDown={handleKeyDown}
									/>
								</Grid>

								<Grid item={true} xs={12}>
									<FormTextField
										delay={0}
										label={t("common.fields.surname")}
										fieldName="surname"
										formik={formik}
										onKeyDown={handleKeyDown}
									/>
								</Grid>

								<Grid item={true} xs={12}>
									<FormTextField
										delay={0}
										label={t("common.fields.middleName")}
										fieldName="middlename"
										formik={formik}
									/>
								</Grid>

								<Grid item={true} xs={12}>
									<FormPhoneField
										delay={0}
										label={t("common.fields.phone")}
										fieldName="phone"
										formik={formik}
									/>
								</Grid>

								<Grid item={true} xs={12}>
									<Button
										color="success"
										variant="contained"
										type="submit"
										disabled={isSubmitting || !!customerId}
										className="w-full"
									>
										{isSubmitting && (
											<CircularProgress
												size={15}
												color="inherit"
												className="mr-1"
											/>
										)}
										{t("order.modal.add.addClient")}
									</Button>
								</Grid>
							</Grid>
						</form>
						{client && (
							<ButtonBase
								className="client-wrapper"
								onClick={() => handleClient(client)}
								id={`client-${client.id}`}
							>
								<span className="text-base font-medium">
									{client.name} {client.surname} {client.middlename}
								</span>
								<span className="text-sm">
									<PhoneFormat value={client.phone} />
								</span>
							</ButtonBase>
						)}
						{clientsLoading ? (
							<div className="circular-progress-box pt-6 pb-5">
								<CircularProgress size={30} />
							</div>
						) : clientsList && clientsList.length > 0 ? (
							clientsList.map((client) => (
								<ButtonBase
									className="client-wrapper"
									id={`client-${client.id}`}
									key={client.id}
									onClick={() => handleClient(client)}
								>
									<span className="text-base font-medium">
										{client.name} {client.surname} {client.middlename}
									</span>
									<span className="text-sm">
										<PhoneFormat value={client.phone} />
									</span>
								</ButtonBase>
							))
						) : (
							<div className="mt-6">
								<span className="no-data-found-wrapper">
										<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
										{t("common.global.noDataFound")}
									</span>
							</div>
						)}
					</div>
					<div className="lg:w-2/3 md:w-1/2 w-full md:mt-0 mt-4 pt-2 md:pl-8 home-data-wrapper">
						<div className="text-xl text-center">
							{t("order.modal.add.home.title")}
						</div>
						{homeData && (
							<Fragment>
								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.home.blockName")}:
									</div>
									<div className="data-item-value">{homeData?.name}</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.home.homeNumber")}:
									</div>
									<div className="data-item-value">{homeData?.number}</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.home.rooms")}:
									</div>
									<div className="data-item-value">{homeData?.rooms}</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.home.areaAll")}:
									</div>
									<div className="data-item-value">{homeData?.square}</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.home.stage")}:
									</div>
									<div className="data-item-value">{homeData?.stage}</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										<Trans i18nKey="order.modal.add.home.repairedPrice">
											Ta'mirlangan narxi (1 m<sup>2</sup>):
										</Trans>
									</div>
									<div className="data-item-value">
										{homeData.repaired && (
											<CurrencyFormat
												value={homeData.repaired}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
											/>
										)}
									</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										<Trans i18nKey="order.modal.add.home.noRepairedPrice">
											Ta'mirlanmagan narxi (1 m<sup>2</sup>):
										</Trans>
									</div>
									<div className="data-item-value">
										{homeData.norepaired && (
											<CurrencyFormat
												value={homeData.norepaired}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
											/>
										)}
									</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.home.startPrice")}:
									</div>
									<div className="data-item-value">
										{homeData.start && (
											<CurrencyFormat
												value={homeData.start}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
											/>
										)}
									</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.home.residentType")}:
									</div>
									<div className="data-item-value">
										{homeData.islive &&
											getLabelByTypeList(RESIDENT_TYPE, homeData.islive)}
									</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.home.repairType")}:
									</div>
									<div className="data-item-value">
										{homeData.isrepaired &&
											getLabelByTypeList(REPAIR_TYPE, homeData.isrepaired)}
									</div>
								</div>

								<div className="home-data-item">
									<div className="data-item-title">
										{t("order.modal.add.additional")}:
									</div>
									<div className="data-item-value flex lg:flex-row flex-col lg:items-center">
										<Button
											color="info"
											variant="contained"
											className="!mr-2"
											disabled={!(homeData?.plan && homeData?.plan?.link)}
											onClick={() => setOpenHomeLayoutImageDialog(true)}
										>
											{t("common.button.homePlan")}
										</Button>

										<div>
											<SimpleDateField
												delay={0}
												name="last-date"
												label={t("order.modal.add.lastDate")}
												value={date}
												setValue={setDate}
											/>
										</div>
									</div>
								</div>
							</Fragment>
						)}
					</div>
				</div>
				<div className="flex items-center justify-end">
					<Button
						variant="contained"
						color="primary"
						disabled={!customerId || !date || isOrderSubmitting}
						onClick={handleOrder}
					>
						{isOrderSubmitting && (
							<CircularProgress size={15} color="inherit" className="mr-1" />
						)}
						{t("common.button.order")}
					</Button>
				</div>

				{openHomeLayoutImageDialog &&
					homeData?.plan &&
					homeData?.plan?.link && (
						<ImagePreviewDialog
							open={openHomeLayoutImageDialog}
							setOpen={setOpenHomeLayoutImageDialog}
							url={homeData?.plan?.link}
						/>
					)}
			</DialogContent>
		</Dialog>
	)
}

export default OrderAddModal
