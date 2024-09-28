import React, { Fragment, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fadeUp, tabItem } from "utils/motion"
import TabPanel from "components/ui/tabs/TabPanel"
import {
	Button,
	CircularProgress,
	Grid,
	Tab,
	Tabs,
	TextField
} from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import moment from "moment"
import { NumericFormat } from "react-number-format"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import useNotification from "hooks/useNotification"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import SetStartDateAndIntervalModal from "../SetStartDateAndIntervalModal"
import TabThreeSubTabTwo from "./tab-three-sub-tabs/TabThreeSubTabTwo"
import TabThreeSubTabOne from "./tab-three-sub-tabs/TabThreeSubTabOne"
import { useTranslation } from "react-i18next"

const TabThree = ({ appear, selectedContract }) => {
	const { t } = useTranslation()
	const [paymentDataList, setPaymentDataList] = useState([])
	const [paymentDataList2, setPaymentDataList2] = useState([])
	const [localMonth, setLocalMonth] = useState(0)
	const [leftPrice, setLeftPrice] = useState(0)
	const [startPrice, setStartPrice] = useState(0)
	const [startPriceDate, setStartPriceDate] = useState(null)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [tabValue, setTabValue] = useState("automatic")
	const [startDateAndIntervalDate, setStartDateAndIntervalDate] = useState(null)
	const [openStartDateAndIntervalModal, setOpenStartDateAndIntervalModal] =
		useState(false)

	const calculatePaymentList = (contract) => {
		if (contract.list && contract.list.length > 0) {
			setLocalMonth(contract.list.length - 1)
			let newList = contract.list.filter((item) => item.default === "0")
			let left =
				parseInt(selectedContract.sum) -
				parseInt(selectedContract.discount) -
				parseInt(selectedContract.start_price)
			let arr = []
			for (let i = 0; i < newList.length; i++) {
				arr.push({
					row_id: i + 1,
					sum: newList[i].sum,
					left: left,
					payment_date: newList[i].payment_date
				})
				left -= newList[i].sum
			}
			setPaymentDataList(arr)
		}
	}

	const calculateStartPriceAndDate = (list) => {
		if (list && list.length > 0) {
			let data = list.filter((item) => item.default === "1")
			if (data && data.length === 1) {
				setStartPriceDate(data[0].payment_date)
				setStartPrice(data[0].sum)
			}
		}
	}

	const handleChangeStartPrice = (price) => {
		if (price) {
			setStartPrice(price)
			setLeftPrice(
				parseInt(selectedContract.sum) -
					parseInt(selectedContract.discount) -
					price
			)
		} else {
			setStartPrice(0)
		}
	}

	const handleChangeStartPriceDate = (date) => {
		if (date) {
			paymentDataList.forEach((item, index) => {
				item.payment_date = moment(
					startDateAndIntervalDate?.firstPriceDate
						? startDateAndIntervalDate?.firstPriceDate
						: date
				)
					.add(
						startDateAndIntervalDate?.interval
							? startDateAndIntervalDate?.interval * (index + 1)
							: 1 * (index + 1),
						"month"
					)
					.format("YYYY-MM-DD")
			})

			setPaymentDataList([...paymentDataList])
			setStartPriceDate(date)
		} else {
			setStartPriceDate(null)
		}
	}

	const handleChangeContractMonth = (month) => {
		if (month) {
			let leftP = leftPrice
				? leftPrice
				: parseInt(selectedContract.sum) -
				  parseInt(selectedContract.discount) -
				  parseInt(selectedContract.start_price)
			let arr = []
			for (let i = 1; i <= month; i++) {
				arr.push({
					row_id: i,
					left: leftP - Math.floor(leftP / month) * (i - 1),
					sum: Math.floor(leftP / month),
					payment_date: moment(
						startDateAndIntervalDate?.firstPriceDate
							? startDateAndIntervalDate?.firstPriceDate
							: startPriceDate
					)
						.add(
							startDateAndIntervalDate?.interval
								? startDateAndIntervalDate?.interval * (i - 1)
								: 1 * (i - 1),
							"month"
						)
						.format("YYYY-MM-DD")
				})
			}
			if (arr.length > 1) {
				arr[arr.length - 1] = {
					...arr[arr.length - 1],
					sum: arr[arr.length - 1].left
				}
			}
			setPaymentDataList(arr)
			setLocalMonth(month)
		} else {
			setLocalMonth(0)
		}
	}

	const calculatePaymentListByLeftPrice = () => {
		if (paymentDataList && paymentDataList.length > 0) {
			paymentDataList[0].left = leftPrice
			paymentDataList[0].sum = Math.floor(
				paymentDataList[0].left / paymentDataList.length
			)
			for (let index = 1; index < paymentDataList.length; index++) {
				paymentDataList[index].left =
					paymentDataList[index - 1].left - paymentDataList[index - 1].sum
				paymentDataList[index].sum = Math.floor(
					paymentDataList[index].left / (paymentDataList.length - index)
				)
			}
			setPaymentDataList([...paymentDataList])
		}
	}

	useEffect(() => {
		if (selectedContract) {
			calculatePaymentListByLeftPrice(selectedContract)
		}
	}, [leftPrice])

	useEffect(() => {
		if (selectedContract) {
			calculatePaymentList(selectedContract)
			calculateStartPriceAndDate(selectedContract.list)
		} else {
			setLocalMonth(0)
			setLeftPrice(0)
			setStartPrice(0)
			setStartPriceDate(null)
			setTabValue("automatic")
			setPaymentDataList([])
			setPaymentDataList2([])
		}
	}, [selectedContract])

	const updatePaymentList = async () => {
		let allSumPaymentDataList = paymentDataList.reduce(
			(acc, curr) => acc + curr?.sum,
			0
		)
		let allSumPaymentDataList2 = paymentDataList2.reduce(
			(acc, curr) => acc + curr?.sum,
			0
		)

		let finalLeftPrice =
			parseInt(selectedContract.sum) -
			parseInt(selectedContract.discount) -
			parseInt(startPrice)

		if (
			selectedContract.id &&
			localMonth &&
			((tabValue === "automatic" &&
				paymentDataList.length === localMonth &&
				allSumPaymentDataList === finalLeftPrice) ||
				(tabValue === "manually" &&
					paymentDataList2.length === localMonth &&
					allSumPaymentDataList2 === finalLeftPrice))
		) {
			let contractNewPaymentList =
				tabValue === "automatic"
					? [
							...paymentDataList.map((item) => ({
								sum: item.sum,
								date: item.payment_date
							}))
					  ]
					: [
							...paymentDataList2.map((item) => ({
								sum: item.sum,
								date: item.payment_date
							}))
					  ]

			let requestValues = {
				list: contractNewPaymentList
			}

			if (startPrice && startPriceDate) {
				requestValues.start_date = startPriceDate
				requestValues.start_price = startPrice

				try {
					setIsSubmitting(true)
					const response = await axiosPrivate.post(
						`/accounter/payment/updatelist/${selectedContract.id}`,
						JSON.stringify(requestValues),
						{ headers: { "Content-Type": "application/json" } }
					)
					if (response.data && response.data.status) {
						sendNotification({
							msg: t("change.tab.paymentList.alerts.success"),
							variant: "success"
						})
						setIsSubmitting(false)
					}
				} catch (error) {
					sendNotification({
						msg: error?.response?.data?.message || error?.message,
						variant: "error"
					})
					setIsSubmitting(false)
				}
			} else {
				sendNotification({
					msg: t(
						"change.tab.paymentList.alerts.warning.startPriceAndStartDate"
					),
					variant: "warning"
				})
			}
		} else if (
			(tabValue === "automatic" && paymentDataList.length !== localMonth) ||
			(tabValue === "manually" && paymentDataList2.length !== localMonth)
		) {
			sendNotification({
				msg: t("change.tab.paymentList.alerts.warning.paymentsNumber"),
				variant: "warning"
			})
		} else if (
			(tabValue === "automatic" && allSumPaymentDataList !== finalLeftPrice) ||
			(tabValue === "manually" && allSumPaymentDataList2 !== finalLeftPrice)
		) {
			sendNotification({
				msg: t("change.tab.paymentList.alerts.warning.leftPrice"),
				variant: "warning"
			})
		}
	}

	return (
		<motion.div
			variants={tabItem({
				duration: 0
			})}
			initial="hidden"
			animate={appear ? "show" : "hidden"}
		>
			<TabPanel value={0} index={0} className="-mx-6">
				{selectedContract ? (
					<Fragment>
						<div>
							<Grid
								container
								spacing={{ xs: 2, sm: 3, lg: 3 }}
								rowSpacing={1}
								columns={{ xs: 12, sm: 12, lg: 20 }}
							>
								<Grid item={true} lg={4} sm={6} xs={12}>
									<Button color="secondary" variant="contained" fullWidth>
										<div className="flex flex-col p-2">
											<span className="text-lg">
												{t("change.tab.paymentList.contractSum")}
											</span>
											<span className="text-sm">
												<CurrencyFormat
													value={selectedContract.sum}
													suffix={
														selectedContract?.isvalute === "1" ? " $" : " UZS"
													}
												/>
											</span>
										</div>
									</Button>
								</Grid>
								<Grid item={true} lg={4} sm={6} xs={12}>
									<Button color="info" variant="contained" fullWidth>
										<div className="flex flex-col p-2">
											<span className="text-lg">
												{t("change.tab.paymentList.startPrice")}
											</span>
											<span className="text-sm">
												<CurrencyFormat
													value={selectedContract.start_price}
													suffix={
														selectedContract?.isvalute === "1" ? " $" : " UZS"
													}
												/>
											</span>
										</div>
									</Button>
								</Grid>
								<Grid item={true} lg={4} sm={6} xs={12}>
									<Button color="success" variant="contained" fullWidth>
										<div className="flex flex-col p-2">
											<span className="text-lg">
												{t("change.tab.paymentList.discount")}
											</span>
											<span className="text-sm">
												<CurrencyFormat
													value={selectedContract.discount}
													suffix={
														selectedContract?.isvalute === "1" ? " $" : " UZS"
													}
												/>
											</span>
										</div>
									</Button>
								</Grid>
							</Grid>
						</div>

						<div className="mt-4">
							<Grid
								container
								spacing={{ xs: 2, sm: 3, lg: 3 }}
								rowSpacing={1}
								columns={{ xs: 12, sm: 12, lg: 20 }}
							>
								<Grid item={true} lg={6} sm={6} xs={12}>
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<DatePicker
											id="changes-start-date-picker"
											openTo="day"
											value={startPriceDate}
											onChange={(newValue) => {
												if (
													newValue &&
													newValue._isValid &&
													newValue > moment("2000-1-1")
												) {
													handleChangeStartPriceDate(
														moment(newValue).format("YYYY-MM-DD")
													)
												} else {
													handleChangeStartPriceDate("")
												}
											}}
											views={["year", "month", "day"]}
											inputFormat="DD/MM/yyyy"
											renderInput={(params) => (
												<TextField
													{...params}
													component={motion.div}
													variants={fadeUp(30, "tween", 0, 0.5)}
													initial="hidden"
													animate="show"
													viewport={{ once: true, amount: 0.25 }}
													color="formColor"
													variant="outlined"
													fullWidth
													id="start"
													name="start"
													label={t("common.fields.startDate")}
													autoComplete="off"
												/>
											)}
										/>
									</LocalizationProvider>
								</Grid>
								<Grid item={true} lg={6} sm={6} xs={12}>
									<NumericFormat
										id="changes-start-price-currency-field"
										name="start-price"
										label={t("common.fields.startPriceAmount")}
										value={startPrice}
										onChange={(event) => {
											let formattedValue =
												event.target.value &&
												parseFloat(event.target.value.split(" ").join(""))
											handleChangeStartPrice(formattedValue)
										}}
										component={motion.div}
										variants={fadeUp(30, "tween", 0, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										customInput={TextField}
										allowNegative={false}
										thousandSeparator={" "}
										decimalScale={3}
									/>
								</Grid>
								<Grid item={true} lg={6} sm={6} xs={12}>
									<NumericFormat
										id="month"
										name="month"
										label={t("common.fields.loanRepayment")}
										value={localMonth}
										onChange={(event) => {
											handleChangeContractMonth(
												event.target.value ? parseFloat(event.target.value) : ""
											)
										}}
										component={motion.div}
										variants={fadeUp(30, "tween", 0, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										customInput={TextField}
										allowNegative={false}
										decimalScale={0}
									/>
								</Grid>
								<Grid item={true} lg={6} sm={6} xs={12}>
									<Button
										color="primary"
										variant="outlined"
										onClick={() => setOpenStartDateAndIntervalModal(true)}
										className="!h-[40px] !mt-2 !leading-4"
									>
										{t("change.tab.paymentList.changeStartDateAndInterval")}
									</Button>
								</Grid>
							</Grid>
						</div>

						{paymentDataList && (
							<Grid container spacing={1} columns={{ xs: 12, sm: 12, lg: 20 }}>
								<Grid item={true} lg={12} sm={6} xs={12}>
									<div className="changes-tab-three-payment-tables-wrapper">
										<Tabs
											value={tabValue}
											onChange={(event, newValue) => setTabValue(newValue)}
											className="contract-step-three-table-tabs"
										>
											<Tab
												label={t("change.tab.paymentList.automaticTable")}
												value="automatic"
											/>
											<Tab
												label={t("change.tab.paymentList.manuallyTable")}
												value="manually"
											/>
										</Tabs>
									</div>
									{tabValue === "automatic" && (
										<TabThreeSubTabOne
											dateAndInterval={startDateAndIntervalDate}
											paymentDataList={paymentDataList}
											setPaymentDataList={setPaymentDataList}
										/>
									)}

									{tabValue === "manually" && (
										<TabThreeSubTabTwo
											parentMonth={localMonth}
											contract={selectedContract}
											startPrice={startPrice}
											startPriceDate={startPriceDate}
											dateAndInterval={startDateAndIntervalDate}
											paymentDataList={paymentDataList2}
											setPaymentDataList={setPaymentDataList2}
										/>
									)}
									<div className="text-center my-5">
										<Button
											color="success"
											variant="contained"
											className="!ml-2"
											onClick={() => updatePaymentList()}
											disabled={isSubmitting}
										>
											{isSubmitting && (
												<CircularProgress
													size={15}
													color="inherit"
													className="mr-1"
												/>
											)}
											{t("change.tab.paymentList.updatePaymentList")}
										</Button>
									</div>
								</Grid>
							</Grid>
						)}
					</Fragment>
				) : (
					<div className="text-gray-400 flex items-center mt-2">
						<i className="bi bi-exclamation-octagon text-lg mr-1 flex items-center" />{" "}
						<span className="text-sm">
							{t("change.tab.paymentList.noPaymentListFound")}
						</span>
					</div>
				)}

				{openStartDateAndIntervalModal && (
					<SetStartDateAndIntervalModal
						open={openStartDateAndIntervalModal}
						setOpen={setOpenStartDateAndIntervalModal}
						setData={setStartDateAndIntervalDate}
					/>
				)}
			</TabPanel>
		</motion.div>
	)
}

export default TabThree
