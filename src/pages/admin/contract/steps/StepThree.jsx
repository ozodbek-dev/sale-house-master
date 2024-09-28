import {
	Button,
	ButtonBase,
	Checkbox,
	FormControl,
	FormControlLabel,
	Tab,
	Tabs,
	TextField,
	ToggleButton,
	ToggleButtonGroup
} from "@mui/material"
import { Fragment, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fadeUp, stepperItem } from "utils/motion"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import { useFormik } from "formik"
import * as yup from "yup"
import useNotification from "hooks/useNotification"
import { NumericFormat } from "react-number-format"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import StepThreeTabOne from "./step-three-tabs/StepThreeTabOne"
import StepThreeTabTwo from "./step-three-tabs/StepThreeTabTwo"
import useCurrency from "hooks/useCurrency"
import CurrencySubContent from "components/ui/text-formats/CurrencySubContent"
import { Trans, useTranslation } from "react-i18next"

const validationSchema = yup.object({
	month: yup
		.number()
		.default(1)
		.required("contract.step.three.validation.month"),
	date: yup
		.date()
		.nullable()
		.typeError("contract.step.three.validation.dateValid")
		.min(
			new Date("Sat Jan 01 2000 00:00:00 GMT+0500"),
			"contract.step.three.validation.dateMin"
		)
		.required("contract.step.three.validation.date"),
	startDate: yup
		.date()
		.nullable()
		.typeError("contract.step.three.validation.startDateValid")
		.min(
			new Date("Sat Jan 01 2000 00:00:00 GMT+0500"),
			"contract.step.three.validation.startDateMin"
		)
		.required("contract.step.three.validation.startDate"),
	sum: yup.number().default(0).required("contract.step.three.validation.sum"),
	left: yup.number().required("contract.step.three.validation.left"),
	discount: yup.number().default(0).optional(),
	interval: yup
		.number()
		.default(1)
		.required("contract.step.three.validation.interval"),
	startPrice: yup
		.number()
		.default(0)
		.required("contract.step.three.validation.startPrice"),
	price: yup
		.number()
		.default(0)
		.required("contract.step.three.validation.priceForSquare"),
	comment: yup.string().optional(),
	contractName: yup
		.string()
		.required("contract.step.three.validation.contractName")
})

const StepThree = ({ appear, direction, next, back, homeData, setData }) => {
	const { t } = useTranslation()
	const [repairData, setRepairData] = useState("")
	const [isRepaired, setIsRepaired] = useState("0")
	const [paymentDataList, setPaymentDataList] = useState([])
	const [paymentDataList2, setPaymentDataList2] = useState([])
	const [calculateByPrice, setCalculateByPrice] = useState(false)
	const [tabValue, setTabValue] = useState("automatic")
	const { currencyData } = useCurrency()
	const [selectedCurrency, setSelectedCurrency] = useState("0")
	const sendNotification = useNotification()

	const formik = useFormik({
		initialValues: {
			month: "1",
			date: "",
			startDate: "",
			sum: "",
			left: "",
			discount: "0",
			interval: "1",
			startPrice: "0",
			price: "",
			comment: "",
			contractName: ""
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {}
	})

	const handleNext = () => {
		if (!formik.isValid) {
			formik.handleSubmit()
		}
		let allSumPaymentDataList = paymentDataList.reduce(
			(acc, curr) => acc + curr?.sum,
			0
		)
		let allSumPaymentDataList2 = paymentDataList2.reduce(
			(acc, curr) => acc + curr?.sum,
			0
		)

		if (
			repairData &&
			formik.isValid &&
			((tabValue === "automatic" &&
				paymentDataList.length === formik.values.month &&
				allSumPaymentDataList === formik.values.left) ||
				(tabValue === "manually" &&
					paymentDataList2.length === formik.values.month &&
					allSumPaymentDataList2 === formik.values.left))
		) {
			setData({
				price: formik.values.price,
				sum: formik.values.sum, // this filed in used for show contract sum in ContractAdd.jsx, not in StepFour.jsx
				start_price: formik.values.startPrice,
				startDate: formik.values.startDate,
				month: formik.values.month,
				payments:
					tabValue === "automatic"
						? paymentDataList
						: tabValue === "manually"
						? paymentDataList2
						: [],
				discount: formik.values.discount,
				name: formik.values.contractName,
				comment: formik.values.comment,
				isrepaired: isRepaired,
				isvalute: selectedCurrency
			})
			next()
		} else if (!repairData) {
			sendNotification({
				msg: t("contract.step.three.alerts.warning.repairType"),
				variant: "warning"
			})
		} else if (
			(tabValue === "automatic" &&
				paymentDataList.length !== formik.values.month) ||
			(tabValue === "manually" &&
				paymentDataList2.length !== formik.values.month)
		) {
			sendNotification({
				msg: t("contract.step.three.alerts.warning.paymentsNumber"),
				variant: "warning"
			})
		} else if (
			(tabValue === "automatic" &&
				allSumPaymentDataList !== formik.values.left) ||
			(tabValue === "manually" && allSumPaymentDataList2 !== formik.values.left)
		) {
			sendNotification({
				msg: t("contract.step.three.alerts.warning.leftPrice"),
				variant: "warning"
			})
		}
	}

	const handleRepairType = (type, data) => {
		Array.from(document.getElementsByClassName("repair-type")).forEach((item) =>
			item.classList.remove("item-selected")
		)
		if (type === "repaired") {
			setIsRepaired("1")
			document.getElementById("repaired").classList.add("item-selected")
		} else if (type === "noRepaired") {
			setIsRepaired("0")
			document.getElementById("non-repaired").classList.add("item-selected")
		}
		formik.setFieldValue("price", data.price, true)
		formik.setFieldValue(
			"sum",
			parseFloat(data.square) * parseFloat(data.price),
			true
		)
		formik.setFieldValue(
			"left",
			parseFloat(data.square) * parseFloat(data.price) -
				formik.values.startPrice -
				formik.values.discount,
			true
		)
		setRepairData(data)
	}

	const getPaymentData = () => {
		if (
			!isNaN(formik.values.month) &&
			!isNaN(formik.values.left) &&
			formik.values.date &&
			!isNaN(formik.values.interval)
		) {
			let arr = []
			for (let i = 1; i <= formik.values.month; i++) {
				arr.push({
					id: i,
					date: moment(formik.values.date)
						.add(formik.values.interval * (i - 1), "month")
						.format("YYYY-MM-DD"),
					left:
						formik.values.left -
						Math.floor(formik.values.left / formik.values.month) * (i - 1),
					sum: Math.floor(formik.values.left / formik.values.month)
				})
			}
			if (arr.length > 1) {
				arr[arr.length - 1] = {
					...arr[arr.length - 1],
					sum: arr[arr.length - 1].left
				}
			}
			setPaymentDataList(arr)
		}
	}

	const handleCurrencyChange = (value) => {
		setSelectedCurrency(value)
		if (currencyData && currencyData.sum) {
			if (value === "1") {
				formik.setFieldValue(
					"price",
					parseFloat(
						parseFloat((formik.values.price || "0") / currencyData.sum).toFixed(
							1
						)
					),
					true
				)
				formik.setFieldValue(
					"sum",
					parseFloat(
						parseFloat((formik.values.sum || "0") / currencyData.sum).toFixed(1)
					),
					true
				)
				formik.setFieldValue(
					"startPrice",
					parseFloat(
						parseFloat(
							(formik.values.startPrice || "0") / currencyData.sum
						).toFixed(1)
					),
					true
				)
				formik.setFieldValue(
					"left",
					parseFloat(
						parseFloat((formik.values.left || "0") / currencyData.sum).toFixed(
							1
						)
					),
					true
				)
				formik.setFieldValue(
					"discount",
					parseFloat(
						parseFloat(
							(formik.values.discount || "0") / currencyData.sum
						).toFixed(1)
					),
					true
				)
			} else if (value === "0") {
				formik.setFieldValue(
					"price",
					parseFloat((formik.values.price || "0") * currencyData.sum),
					true
				)
				formik.setFieldValue(
					"sum",
					parseFloat((formik.values.sum || "0") * currencyData.sum),
					true
				)
				formik.setFieldValue(
					"startPrice",
					parseFloat((formik.values.startPrice || "0") * currencyData.sum),
					true
				)
				formik.setFieldValue(
					"left",
					parseFloat((formik.values.left || "0") * currencyData.sum),
					true
				)
				formik.setFieldValue(
					"discount",
					parseFloat((formik.values.discount || "0") * currencyData.sum),
					true
				)
			}
		}
	}

	useEffect(() => {
		getPaymentData()
	}, [formik.values])

	useEffect(() => {
		if (homeData) {
			formik.setFieldValue(
				"contractName",
				`${homeData?.blocks?.objects?.name} ${homeData?.blocks?.name} ${homeData?.number}-хонадон`,
				true
			)
			setSelectedCurrency(homeData?.isvalute || "0")
		}
	}, [homeData])

	return (
		<motion.div
			variants={stepperItem({
				direction: direction,
				duration: 0
			})}
			initial="hidden"
			animate={appear ? "show" : "hidden"}
		>
			<div className="component-add-wrapper">
				<div className="component-add-body overflow-y-auto h-full">
					<div className="home-repair-type">
						<div className="title">{t("contract.step.three.title")}</div>
						<div className="repair-types">
							<ButtonBase
								className="repair-type repair-type-non-repaired !mr-2"
								id="non-repaired"
								onClick={() =>
									handleRepairType("noRepaired", {
										price: homeData?.norepaired,
										square: homeData?.square
									})
								}
							>
								<div className="flex items-center justify-between w-full">
									<span>{t("contract.step.three.repairType.notRepaired")}</span>
									<span>
										<Trans i18nKey="contract.step.three.oneMeterSquare">
											1 m<sup>2</sup>
										</Trans>
										:{" "}
										<CurrencyFormat
											value={homeData?.norepaired}
											suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
										/>
									</span>
								</div>
								{currencyData &&
									currencyData.sum &&
									homeData?.isvalute === "1" && (
										<div className="price-by-currency-wrapper">
											=
											<CurrencyFormat
												value={parseFloat(
													currencyData.sum * parseFloat(homeData?.norepaired)
												)}
												className="ml-1"
											/>
										</div>
									)}
								<div className="flex items-center justify-between w-full mt-2">
									<span>
										{homeData?.square}{" "}
										<Trans i18nKey="common.global.meter">
											m<sup>2</sup>
										</Trans>
									</span>
									<span>
										{homeData?.square && homeData?.norepaired && (
											<CurrencyFormat
												value={homeData?.square * homeData?.norepaired}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
											/>
										)}
									</span>
								</div>
								{currencyData &&
									currencyData.sum &&
									homeData?.isvalute === "1" && (
										<div className="price-by-currency-wrapper">
											=
											<CurrencyFormat
												value={parseFloat(
													currencyData.sum *
														parseFloat(homeData?.square * homeData?.norepaired)
												)}
												className="ml-1"
											/>
										</div>
									)}
							</ButtonBase>
							<ButtonBase
								className="repair-type repair-type-repaired !ml-2"
								id="repaired"
								onClick={() =>
									handleRepairType("repaired", {
										price: homeData?.repaired,
										square: homeData?.square
									})
								}
							>
								<div className="flex items-center justify-between w-full">
									<span>{t("contract.step.three.repairType.repaired")}</span>
									<span>
										<Trans i18nKey="contract.step.three.oneMeterSquare">
											1 m<sup>2</sup>
										</Trans>
										:{" "}
										<CurrencyFormat
											value={homeData?.repaired}
											suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
										/>
									</span>
								</div>
								{currencyData &&
									currencyData.sum &&
									homeData?.isvalute === "1" && (
										<div className="price-by-currency-wrapper">
											=
											<CurrencyFormat
												value={parseFloat(
													currencyData.sum * parseFloat(homeData?.repaired)
												)}
												className="ml-1"
											/>
										</div>
									)}
								<div className="flex items-center justify-between w-full mt-2">
									<span>
										{homeData?.square}{" "}
										<Trans i18nKey="common.global.meter">
											m<sup>2</sup>
										</Trans>
									</span>
									<span>
										{homeData?.square && homeData?.repaired && (
											<CurrencyFormat
												value={homeData?.square * homeData?.repaired}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
											/>
										)}
									</span>
								</div>
								{currencyData &&
									currencyData.sum &&
									homeData?.isvalute === "1" && (
										<div className="price-by-currency-wrapper">
											=
											<CurrencyFormat
												value={parseFloat(
													currencyData.sum *
														parseFloat(homeData?.square * homeData?.repaired)
												)}
												className="ml-1"
											/>
										</div>
									)}
							</ButtonBase>
						</div>
						<div className="flex justify-center mt-4">
							<ToggleButtonGroup
								color="primary"
								value={selectedCurrency}
								exclusive
								onChange={(event) => handleCurrencyChange(event.target.value)}
								aria-label="currency"
							>
								<ToggleButton color="primary" value="0">
									UZS
								</ToggleButton>
								<ToggleButton color="primary" value="1">
									USD
								</ToggleButton>
							</ToggleButtonGroup>
						</div>
					</div>

					<div className="home-payment-wrapper mt-3">
						<div className="home-payment-details">
							<div className="flex flex-row justify-between">
								<div className="w-1/2 mx-20">
									<NumericFormat
										id="price-currency-field"
										name="price"
										label={
											<Trans i18nKey="contract.step.three.fields.priceForSquare">
												1 m<sup>2</sup> narxi
											</Trans>
										}
										value={formik.values.price}
										onChange={(event) => {
											let formattedValue =
												event.target.value &&
												parseFloat(event.target.value.split(" ").join(""))
											formik.setFieldValue("price", formattedValue, true)
											if (repairData?.square) {
												formik.setFieldValue(
													"sum",
													formattedValue * repairData?.square
												)
												formik.setFieldValue(
													"left",
													formattedValue * repairData?.square -
														formik.values.startPrice -
														formik.values.discount
												)
											}
										}}
										error={formik.touched.price && Boolean(formik.errors.price)}
										helperText={
											formik.touched.price && (
												<Trans i18nKey={formik.errors.price}>
													1 m<sup>2</sup> narxini kiritish majburiy!
												</Trans>
											)
										}
										component={motion.div}
										variants={fadeUp(30, "tween", 0.1, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										customInput={TextField}
										allowNegative={false}
										thousandSeparator={" "}
										decimalScale={1}
										inputProps={{
											readOnly: calculateByPrice
										}}
									/>
									{selectedCurrency === "1" && !isNaN(formik.values.price) && (
										<CurrencySubContent value={formik.values.price} />
									)}

									<FormControl fullWidth color="formColor" type="checkbox">
										<FormControlLabel
											control={
												<Checkbox
													id="calculate-by-price-or-sum-checkbox"
													name="calculate-by-price-or-sum-checkbox"
													checked={calculateByPrice}
													onChange={(event) => {
														setCalculateByPrice(event.target.checked)
													}}
												/>
											}
											label={t("contract.step.three.fields.calculateByAllSum")}
										/>
									</FormControl>

									<NumericFormat
										id="sum-currency-field"
										name="sum"
										label={t("common.fields.contractSum")}
										value={formik.values.sum}
										onChange={(event) => {
											let formattedValue =
												event.target.value &&
												parseFloat(event.target.value.split(" ").join(""))
											formik.setFieldValue("sum", formattedValue, true)
										}}
										onBlur={() => {
											if (
												repairData?.square &&
												calculateByPrice &&
												formik.values.sum !==
													formik.values.price * repairData?.square
											) {
												let newPrice = Math.ceil(
													formik.values.sum / repairData?.square
												)
												formik.setFieldValue(
													"price",
													newPrice - (newPrice % 1000) + 1000,
													true
												)
												formik.setFieldValue(
													"discount",
													(newPrice - (newPrice % 1000) + 1000) *
														repairData?.square -
														formik.values.sum,
													true
												)
												formik.setFieldValue(
													"left",
													formik.values.sum - formik.values.startPrice,
													true
												)
												formik.setFieldValue(
													"sum",
													(newPrice - (newPrice % 1000) + 1000) *
														repairData?.square,
													true
												)
											}
										}}
										error={formik.touched.sum && Boolean(formik.errors.sum)}
										helperText={formik.touched.sum && t(formik.errors.sum)}
										component={motion.div}
										variants={fadeUp(30, "tween", 0.1, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										customInput={TextField}
										allowNegative={false}
										thousandSeparator={" "}
										decimalScale={1}
										inputProps={{
											readOnly: !calculateByPrice
										}}
									/>
									{selectedCurrency === "1" && !isNaN(formik.values.sum) && (
										<CurrencySubContent value={formik.values.sum} />
									)}

									<NumericFormat
										id="start-price-currency-field"
										name="start-price"
										label={t("common.fields.startPriceAmount")}
										value={formik.values.startPrice}
										onChange={(event) => {
											let formattedValue =
												event.target.value &&
												parseFloat(event.target.value.split(" ").join(""))
											formik.setFieldValue("startPrice", formattedValue, true)
											formik.setFieldValue(
												"left",
												formik.values.sum -
													formattedValue -
													formik.values.discount,
												true
											)
										}}
										error={
											formik.touched.startPrice &&
											Boolean(formik.errors.startPrice)
										}
										helperText={
											formik.touched.startPrice && t(formik.errors.startPrice)
										}
										component={motion.div}
										variants={fadeUp(30, "tween", 0.2, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										customInput={TextField}
										allowNegative={false}
										thousandSeparator={" "}
										decimalScale={1}
									/>
									{selectedCurrency === "1" &&
										!isNaN(formik.values.startPrice) && (
											<CurrencySubContent value={formik.values.startPrice} />
										)}

									<NumericFormat
										id="left-currency-field"
										name="left"
										label={t("common.fields.leftSum")}
										value={formik.values.left}
										onChange={(event) => {
											let formattedValue =
												event.target.value &&
												parseFloat(event.target.value.split(" ").join(""))
											formik.setFieldValue("left", formattedValue, true)
										}}
										error={formik.touched.left && Boolean(formik.errors.left)}
										helperText={formik.touched.left && t(formik.errors.left)}
										component={motion.div}
										variants={fadeUp(30, "tween", 0.3, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										customInput={TextField}
										allowNegative={false}
										thousandSeparator={" "}
										decimalScale={1}
										inputProps={{
											readOnly: true
										}}
									/>
									{selectedCurrency === "1" && !isNaN(formik.values.left) && (
										<CurrencySubContent value={formik.values.left} />
									)}

									<NumericFormat
										id="month"
										name="month"
										label={t("common.fields.loanRepayment")}
										value={formik.values.month}
										onChange={(event) => {
											formik.setFieldValue(
												"month",
												event.target.value
													? parseFloat(event.target.value)
													: "",
												true
											)
										}}
										error={formik.touched.month && Boolean(formik.errors.month)}
										helperText={formik.touched.month && t(formik.errors.month)}
										component={motion.div}
										variants={fadeUp(30, "tween", 0.4, 0.5)}
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

									<NumericFormat
										id="interval"
										name="interval"
										label={t("common.fields.interval")}
										value={formik.values.interval}
										onChange={(event) => {
											formik.setFieldValue(
												"interval",
												event.target.value
													? parseFloat(event.target.value)
													: "",
												true
											)
										}}
										error={
											formik.touched.interval && Boolean(formik.errors.interval)
										}
										helperText={
											formik.touched.interval && t(formik.errors.interval)
										}
										component={motion.div}
										variants={fadeUp(30, "tween", 0.5, 0.5)}
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
								</div>

								<div className="w-1/2 mx-20">
									<LocalizationProvider dateAdapter={AdapterMoment}>
										<DatePicker
											id="start-date-picker"
											openTo="day"
											value={formik.values.startDate}
											onChange={(newValue) => {
												if (
													newValue &&
													newValue._isValid &&
													newValue > moment("2000-1-1")
												) {
													formik.setFieldValue(
														"startDate",
														moment(newValue).format("YYYY-MM-DD"),
														true
													)
												} else {
													formik.setFieldValue("startDate", "", true)
												}
											}}
											views={["year", "month", "day"]}
											inputFormat="DD/MM/yyyy"
											renderInput={(params) => (
												<TextField
													{...params}
													component={motion.div}
													variants={fadeUp(30, "tween", 0.5, 0.5)}
													initial="hidden"
													animate="show"
													viewport={{ once: true, amount: 0.25 }}
													color="formColor"
													variant="outlined"
													fullWidth
													id="start"
													name="start"
													label={t("common.fields.startDate")}
													error={
														formik.touched.startDate &&
														Boolean(formik.errors.startDate)
													}
													helperText={
														formik.touched.startDate &&
														t(formik.errors.startDate)
													}
													autoComplete="off"
												/>
											)}
										/>
									</LocalizationProvider>

									<LocalizationProvider dateAdapter={AdapterMoment}>
										<DatePicker
											id="date-date-picker"
											openTo="day"
											value={formik.values.date}
											onChange={(newValue) => {
												if (
													newValue &&
													newValue._isValid &&
													newValue > moment("2000-1-1")
												) {
													formik.setFieldValue(
														"date",
														moment(newValue).format("YYYY-MM-DD"),
														true
													)
												} else {
													formik.setFieldValue("date", "", true)
												}
											}}
											views={["year", "month", "day"]}
											inputFormat="DD/MM/yyyy"
											renderInput={(params) => (
												<TextField
													{...params}
													component={motion.div}
													variants={fadeUp(30, "tween", 0.5, 0.5)}
													initial="hidden"
													animate="show"
													viewport={{ once: true, amount: 0.25 }}
													color="formColor"
													variant="outlined"
													fullWidth
													id="date"
													name="date"
													label={t("common.fields.firstPriceDate")}
													error={
														formik.touched.date && Boolean(formik.errors.date)
													}
													helperText={
														formik.touched.date && t(formik.errors.date)
													}
													autoComplete="off"
												/>
											)}
										/>
									</LocalizationProvider>

									<NumericFormat
										id="discount-currency-field"
										name="discount"
										label={t("common.fields.discount")}
										value={formik.values.discount}
										onChange={(event) => {
											let formattedValue =
												event.target.value &&
												parseFloat(event.target.value.split(" ").join(""))
											formik.setFieldValue("discount", formattedValue, true)
											formik.setFieldValue(
												"left",
												formik.values.sum -
													formik.values.startPrice -
													formattedValue,
												true
											)
										}}
										error={
											formik.touched.discount && Boolean(formik.errors.discount)
										}
										helperText={
											formik.touched.discount && t(formik.errors.discount)
										}
										component={motion.div}
										variants={fadeUp(30, "tween", 0.3, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										customInput={TextField}
										allowNegative={false}
										thousandSeparator={" "}
										decimalScale={1}
									/>
									{selectedCurrency === "1" &&
										!isNaN(formik.values.discount) && (
											<CurrencySubContent value={formik.values.discount} />
										)}
									<TextField
										component={motion.div}
										variants={fadeUp(30, "tween", 0.4, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										id="contractName"
										name="contractName"
										label={t("common.fields.contractNumber")}
										error={
											formik.touched.contractName &&
											Boolean(formik.errors.contractName)
										}
										helperText={
											formik.touched.contractName &&
											t(formik.errors.contractName)
										}
										value={formik.values.contractName}
										onChange={(event) => {
											formik.setFieldValue(
												"contractName",
												event.target.value,
												true
											)
										}}
										autoComplete="off"
									/>

									<TextField
										component={motion.div}
										variants={fadeUp(30, "tween", 0.4, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										color="formColor"
										variant="outlined"
										fullWidth
										id="comment"
										name="comment"
										label={t("common.fields.comment")}
										multiline
										rows={6}
										error={
											formik.touched.comment && Boolean(formik.errors.comment)
										}
										helperText={
											formik.touched.comment && t(formik.errors.comment)
										}
										value={formik.values.comment}
										onChange={(event) => {
											formik.setFieldValue("comment", event.target.value, true)
										}}
										autoComplete="off"
									/>
								</div>
							</div>
						</div>
					</div>

					{!isNaN(formik.values.month) &&
						!isNaN(formik.values.left) &&
						formik.values.date &&
						!isNaN(formik.values.interval) && (
							<Fragment>
								<div className="step-three-payment-tables-wrapper">
									<Tabs
										value={tabValue}
										onChange={(event, newValue) => setTabValue(newValue)}
										className="contract-step-three-table-tabs"
									>
										<Tab
											label={t("contract.step.three.automaticTable")}
											value="automatic"
										/>
										<Tab
											label={t("contract.step.three.manuallyTable")}
											value="manually"
										/>
									</Tabs>
								</div>

								{tabValue === "automatic" && (
									<StepThreeTabOne
										month={formik.values.month}
										left={formik.values.left}
										date={formik.values.date}
										interval={formik.values.interval}
										paymentDataList={paymentDataList}
										setPaymentDataList={setPaymentDataList}
										currency={selectedCurrency}
									/>
								)}

								{tabValue === "manually" && (
									<StepThreeTabTwo
										month={formik.values.month}
										left={formik.values.left}
										date={formik.values.date}
										interval={formik.values.interval}
										paymentDataList={paymentDataList2}
										setPaymentDataList={setPaymentDataList2}
										currency={selectedCurrency}
									/>
								)}
							</Fragment>
						)}

					<div className="text-center my-4">
						<Button
							onClick={back}
							color="inherit"
							variant="contained"
							className="!mr-2"
						>
							{t("common.button.back")}
						</Button>
						<Button
							color="success"
							variant="contained"
							className="!ml-2"
							onClick={handleNext}
						>
							{t("common.button.next")}
						</Button>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default StepThree
