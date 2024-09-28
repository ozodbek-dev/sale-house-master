import {
	Button,
	Chip,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton
} from "@mui/material"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { Fragment, useState } from "react"
import moment from "moment"
import ORDER_TYPE from "shared/orderTypeList"
import { orderTypeVariants } from "shared/tableColVariantsList"
import { Trans, useTranslation } from "react-i18next"

const OrderActionModal = (props) => {
	const { open, setOpen, data: orderData, setRefetch } = props
	const { t } = useTranslation()
	const [isOrderSubmitting, setIsOrderSubmitting] = useState(false)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()

	const handleClose = () => {
		setOpen(false)
	}

	const handleCancelOrder = async () => {
		try {
			setIsOrderSubmitting(true)
			const response = await axiosPrivate.post(
				"/admin/order/orderdelete",
				JSON.stringify(orderData),
				{ headers: { "Content-Type": "application/json" } }
			)
			if (response.data && response.data.status) {
				sendNotification({
					msg: t("order.modal.view.alerts.cancel"),
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

	const setOrderStatus = (item) => {
		let result = orderTypeVariants.filter((variant) => variant.code === item)
		if (result.length > 0) {
			return (
				<Chip
					label={t(result[0].label)}
					variant="tableBadge"
					color={result[0].color}
				/>
			)
		}
		return ""
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
			<DialogTitle id="order-view-dialog-title">
				<span className="text-xl">
					{t("order.modal.view.title")} №{orderData.id}
				</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div className="md:w-[800px] min-w-[300px]">
					<div className="flex md:flex-row flex-col pb-8 order-view-modal-wrapper">
						<div className="home-data-wrapper md:w-1/2 w-full">
							{orderData && (
								<Fragment>
									<div className="home-data-item">
										<div className="data-item-title">
											{t("order.modal.view.client")}:
										</div>
										<div className="data-item-value">
											{orderData?.custom?.surname} {orderData?.custom?.name}{" "}
											{orderData?.custom?.middlename}
										</div>
									</div>

									<div className="home-data-item">
										<div className="data-item-title">
											{t("order.modal.view.home.title")}:
										</div>
										<div className="data-item-value">
											№{orderData?.home?.number},
											{t("order.modal.view.home.details", {
												stage: orderData?.home?.stage,
												rooms: orderData?.home?.rooms
											})}
										</div>
									</div>

									<div className="home-data-item">
										<div className="data-item-title">
											{t("order.modal.view.area")}:
										</div>
										<div className="data-item-value">
											{orderData?.home?.square}{" "}
											<Trans i18nKey="common.global.meter">
												m<sup>2</sup>
											</Trans>
										</div>
									</div>

									<div className="home-data-item">
										<div className="data-item-title">
											{t("order.modal.view.address")}:
										</div>
										<div className="data-item-value">
											{orderData?.home?.blocks?.objects?.city},{" "}
											{orderData?.home?.blocks?.objects?.address}
										</div>
									</div>

									<div className="home-data-item">
										<div className="data-item-title">
											<Trans i18nKey="order.modal.view.repairedPrice">
												Ta'mirlangan narxi (1 m<sup>2</sup>):
											</Trans>
										</div>
										<div className="data-item-value">
											{orderData.home?.repaired && (
												<CurrencyFormat
													value={orderData.home?.repaired}
													suffix={
														orderData.home?.isvalute === "1" ? " $" : " UZS"
													}
												/>
											)}
										</div>
									</div>

									<div className="home-data-item">
										<div className="data-item-title">
											<Trans i18nKey="order.modal.view.noRepairedPrice">
												Ta'mirlanmagan narxi (1 m<sup>2</sup>):
											</Trans>
										</div>
										<div className="data-item-value">
											{orderData.home?.norepaired && (
												<CurrencyFormat
													value={orderData.home?.norepaired}
													suffix={
														orderData.home?.isvalute === "1" ? " $" : " UZS"
													}
												/>
											)}
										</div>
									</div>
								</Fragment>
							)}
						</div>
						<div className="home-data-wrapper md:w-1/2 w-full">
							{orderData && (
								<Fragment>
									{orderData?.status &&
										orderData?.status === ORDER_TYPE.NEW.code && (
											<div className="home-data-item">
												<div className="data-item-title">
													{t("order.modal.view.leftDate")}:
												</div>
												<div className="data-item-value">
													{orderData?.date &&
														moment(orderData?.date) > moment(new Date()) &&
														moment(orderData?.date).diff(new Date(), "days")}
												</div>
											</div>
										)}

									<div className="home-data-item">
										<div className="data-item-title">
											{t("order.modal.view.status")}:
										</div>
										<div className="data-item-value">
											{orderData?.status && setOrderStatus(orderData?.status)}
										</div>
									</div>

									<div className="home-data-item">
										<div className="data-item-title">
											{t("order.modal.view.staff")}:
										</div>
										<div className="data-item-value">
											{orderData?.staff?.name}
										</div>
									</div>
								</Fragment>
							)}
						</div>
					</div>
					<div className="flex items-center justify-end">
						<Button
							variant="contained"
							color="error"
							disabled={
								isOrderSubmitting ||
								(orderData?.status && orderData?.status !== ORDER_TYPE.NEW.code)
							}
							onClick={handleCancelOrder}
						>
							{isOrderSubmitting && (
								<CircularProgress size={15} color="inherit" className="mr-1" />
							)}
							{t("common.button.cancel")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default OrderActionModal
