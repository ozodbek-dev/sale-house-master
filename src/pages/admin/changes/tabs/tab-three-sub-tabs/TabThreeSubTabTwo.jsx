import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Fab,
	Grid,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material"
import FormCurrencyField from "components/ui/form/FormCurrencyField"
import FormDateField from "components/ui/form/FormDateField"
import FormNumberField from "components/ui/form/FormNumberField"
import DangerTooltip from "components/ui/tooltips/DangerTooltip"
import SuccessTooltip from "components/ui/tooltips/SuccessTooltip"
import { useFormik } from "formik"
import moment from "moment"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"
import * as yup from "yup"

const TabThreeSubTabTwo = ({
	startPriceDate,
	parentMonth,
	contract = {},
	startPrice = 0,
	dateAndInterval = {},
	paymentDataList = [],
	setPaymentDataList = () => {}
}) => {
	const { t } = useTranslation()
	const [localSubtractedLeftPrice, setLocalSubtractedLeftPrice] = useState(0)
	const [localLeftPrice, setLocalLeftPrice] = useState(0)
	const [contractMonth, setContractMonth] = useState(parentMonth)
	const [localInterval, setLocalInterval] = useState(1)
	const [localPrice, setLocalPrice] = useState(0)
	const [localMonth, setLocalMonth] = useState(1)

	const [localDate, setLocalDate] = useState("")
	const [addTableRowOpen, setAddTableRowOpen] = useState(false)

	const setPaymentDataListToTable = (priceL, monthL, dateL) => {
		let arr = [...paymentDataList]
		for (let i = 1; i <= monthL; i++) {
			arr.push({
				row_id: paymentDataList.length + i,
				payment_date: moment(dateL)
					.add(localInterval * (i - 1), "month")
					.format("YYYY-MM-DD"),
				left: localSubtractedLeftPrice - priceL * (i - 1),
				sum: priceL
			})
		}

		setLocalPrice(
			(localSubtractedLeftPrice - priceL * monthL) / (localMonth - monthL)
		)
		setLocalMonth(localMonth - monthL)
		setLocalDate(
			moment(arr.at(-1).payment_date)
				.add(localInterval, "month")
				.format("YYYY-MM-DD")
		)

		setLocalSubtractedLeftPrice(localSubtractedLeftPrice - priceL * monthL)
		setPaymentDataList(arr)
	}

	const handleDeleteRow = (rowId) => {
		paymentDataList.splice(rowId - 1, 1)
		let splicedPaymentDataList = [...paymentDataList]
		if (splicedPaymentDataList.length > 0) {
			if (rowId === 1) {
				splicedPaymentDataList[0].row_id = rowId
				splicedPaymentDataList[0].payment_date =
					moment(localDate).format("YYYY-MM-DD")
				splicedPaymentDataList[0].left = localLeftPrice
				for (let i = rowId; i < splicedPaymentDataList.length; i++) {
					splicedPaymentDataList[i].row_id = i + 1
					splicedPaymentDataList[i].payment_date = moment(
						splicedPaymentDataList[i - 1].payment_date
					)
						.add(localInterval, "month")
						.format("YYYY-MM-DD")
					splicedPaymentDataList[i].left =
						splicedPaymentDataList[i - 1].left -
						splicedPaymentDataList[i - 1].sum
				}
			} else {
				for (let i = rowId - 1; i < splicedPaymentDataList.length; i++) {
					splicedPaymentDataList[i].row_id = i + 1
					splicedPaymentDataList[i].payment_date = moment(
						splicedPaymentDataList[i - 1].payment_date
					)
						.add(localInterval, "month")
						.format("YYYY-MM-DD")
					splicedPaymentDataList[i].left =
						splicedPaymentDataList[i - 1].left -
						splicedPaymentDataList[i - 1].sum
				}
			}

			setLocalPrice(
				(splicedPaymentDataList.at(-1).left -
					splicedPaymentDataList.at(-1).sum) /
					(contractMonth - splicedPaymentDataList.length)
			)
			setLocalMonth(contractMonth - splicedPaymentDataList.length)
			setLocalDate(
				moment(splicedPaymentDataList.at(-1).payment_date)
					.add(localInterval, "month")
					.format("YYYY-MM-DD")
			)

			// console.log("splicedPaymentDataList = ", splicedPaymentDataList)

			setLocalSubtractedLeftPrice(
				splicedPaymentDataList.at(-1).left - splicedPaymentDataList.at(-1).sum
			)
			setPaymentDataList(splicedPaymentDataList)
		} else {
			handleDeleteAll()
		}
	}

	const handleDeleteAll = () => {
		if (contract?.list && contract?.list.length > 0) {
			setLocalInterval(
				moment(contract?.list[2]?.payment_date, "YYYY-MM-DD").diff(
					moment(contract?.list[1]?.payment_date, "YYYY-MM-DD"),
					"month"
				)
			)

			setLocalMonth(contractMonth)
			setLocalDate(contract?.list[1]?.payment_date)
			setLocalPrice(
				(parseInt(contract.sum) -
					parseInt(contract.discount) -
					parseInt(startPrice)) /
					contractMonth
			)

			setLocalSubtractedLeftPrice(
				parseInt(contract.sum) -
					parseInt(contract.discount) -
					parseInt(startPrice)
			)
		} else {
			setLocalInterval(1)
			setLocalMonth(1)
			setLocalDate("")
			setLocalPrice(0)
			setLocalSubtractedLeftPrice(0)
		}
		setPaymentDataList([])
	}

	useEffect(() => {
		if (contract?.list && contract?.list.length > 0) {
			setLocalInterval(
				moment(contract?.list[2]?.payment_date, "YYYY-MM-DD").diff(
					moment(contract?.list[1]?.payment_date, "YYYY-MM-DD"),
					"month"
				)
			)
			if (!(paymentDataList && paymentDataList.length)) {
				setLocalSubtractedLeftPrice(
					parseInt(contract.sum) -
						parseInt(contract.discount) -
						parseInt(contract.start_price)
				)
			}

			setLocalDate(contract?.list[1]?.payment_date)
			setLocalPrice(
				(parseInt(contract.sum) -
					parseInt(contract.discount) -
					parseInt(contract.start_price)) /
					(parentMonth || 1)
			)
			setLocalMonth(parentMonth || 1)

			setLocalLeftPrice(
				parseInt(contract.sum) -
					parseInt(contract.discount) -
					parseInt(contract.start_price)
			)
		}
	}, [])

	useEffect(() => {
		setContractMonth(parentMonth)
		if (paymentDataList && paymentDataList.length > 0 && parentMonth) {
			let arr = []
			let currentLength =
				paymentDataList.length > parentMonth
					? parentMonth
					: paymentDataList.length
			let leftP = localLeftPrice
				? localLeftPrice
				: parseInt(contract.sum) -
				  parseInt(contract.discount) -
				  parseInt(contract.start_price)
			for (let i = 1; i <= currentLength; i++) {
				arr.push({
					row_id: i,
					left: leftP - Math.floor(leftP / parentMonth) * (i - 1),
					sum: Math.floor(leftP / parentMonth),
					payment_date: moment(
						dateAndInterval?.firstPriceDate
							? dateAndInterval?.firstPriceDate
							: startPriceDate
					)
						.add(
							dateAndInterval?.interval
								? dateAndInterval?.interval * (i - 1)
								: 1 * (i - 1),
							"month"
						)
						.format("YYYY-MM-DD")
				})
			}
			if (paymentDataList.length > parentMonth) {
				if (arr.length > 1) {
					arr[arr.length - 1] = {
						...arr[arr.length - 1],
						sum: arr[arr.length - 1].left
					}
				}
			}
			setLocalSubtractedLeftPrice(arr.at(-1).left - arr.at(-1).sum)
			setLocalMonth(parentMonth - arr.length)
			setLocalPrice(
				(arr.at(-1).left - arr.at(-1).sum) / (parentMonth - arr.length)
			)
			setPaymentDataList(arr)
		} else {
			setLocalPrice(localLeftPrice / parentMonth)
			setLocalMonth(parentMonth)
		}
	}, [parentMonth])

	useEffect(() => {
		setLocalLeftPrice(
			parseInt(contract.sum) -
				parseInt(contract.discount) -
				parseInt(startPrice)
		)
		if (paymentDataList && paymentDataList.length > 0) {
			let month = parentMonth || 1
			let currentLength =
				paymentDataList.length > month ? month : paymentDataList.length
			paymentDataList[0].left =
				parseInt(contract.sum) -
				parseInt(contract.discount) -
				parseInt(startPrice)
			paymentDataList[0].sum = Math.floor(paymentDataList[0].left / month)
			for (let index = 1; index < currentLength; index++) {
				paymentDataList[index].left =
					paymentDataList[index - 1].left - paymentDataList[index - 1].sum
				paymentDataList[index].sum = Math.floor(
					paymentDataList[index].left / (month - index)
				)
			}
			setLocalSubtractedLeftPrice(
				paymentDataList.at(-1).left - paymentDataList.at(-1).sum
			)
			setLocalMonth(month - paymentDataList.length)
			setLocalPrice(
				(paymentDataList.at(-1).left - paymentDataList.at(-1).sum) /
					(month - paymentDataList.length)
			)
			setPaymentDataList([...paymentDataList])
		} else {
			setLocalPrice(
				(parseInt(contract.sum) -
					parseInt(contract.discount) -
					parseInt(startPrice)) /
					(parentMonth || 1)
			)
			setLocalSubtractedLeftPrice(
				parseInt(contract.sum) -
					parseInt(contract.discount) -
					parseInt(startPrice)
			)
		}
	}, [startPrice])

	useEffect(() => {
		if (
			paymentDataList.length > 0 &&
			dateAndInterval &&
			dateAndInterval.firstPriceDate &&
			dateAndInterval.interval
		) {
			let arr = []
			for (let i = 0; i < paymentDataList.length; i++) {
				arr.push({
					// id: paymentDataList[i].id,
					row_id: paymentDataList[i].row_id,
					sum: paymentDataList[i].sum,
					left: paymentDataList[i].left,
					payment_date: moment(dateAndInterval.firstPriceDate)
						.add(dateAndInterval.interval * i, "month")
						.format("YYYY-MM-DD")
				})
			}
			setPaymentDataList(arr)
		}
	}, [dateAndInterval])

	return (
		<div className="changes-table flex flex-col mt-4">
			<div className="my-shadow-2 rounded-lg p-3 border border-base-color flex items-center justify-evenly mb-4">
				<div>
					{t("change.tab.paymentList.sumAll")}:{" "}
					<NumericFormat
						value={localLeftPrice}
						displayType={"text"}
						allowNegative={false}
						thousandSeparator={" "}
						decimalScale={3}
						className="bg-transparent"
						suffix={contract?.isvalute === "1" ? " $" : " UZS"}
					/>
				</div>
				<div>
					{t("change.tab.paymentList.leftSum")}:{" "}
					<NumericFormat
						value={localSubtractedLeftPrice}
						displayType={"text"}
						allowNegative={false}
						thousandSeparator={" "}
						decimalScale={3}
						className="bg-transparent"
						suffix={contract?.isvalute === "1" ? " $" : " UZS"}
					/>
				</div>
				<div className="flex flex-row items-center">
					{localSubtractedLeftPrice &&
					paymentDataList.length !== contractMonth ? (
						<SuccessTooltip
							arrow={true}
							placement="top"
							title={t("change.tab.paymentList.addPayment")}
						>
							<Button
								variant="contained"
								color="success"
								onClick={() => setAddTableRowOpen(true)}
							>
								<i className="bi bi-plus-lg text-lg font-medium" />
							</Button>
						</SuccessTooltip>
					) : (
						""
					)}
					{paymentDataList.length > 0 ? (
						<DangerTooltip
							arrow={true}
							placement="top"
							title={t("change.tab.paymentList.deleteAll")}
						>
							<Button
								variant="contained"
								color="error"
								onClick={() => handleDeleteAll()}
								className="!ml-2"
							>
								<i className="bi bi-trash3 text-lg font-medium" />
							</Button>
						</DangerTooltip>
					) : (
						""
					)}
				</div>
			</div>

			{paymentDataList.length > 0 && (
				<TableContainer className="flex-auto w-full h-full">
					<Table
						stickyHeader
						sx={{ minWidth: 750, height: "max-content" }}
						aria-labelledby="tableTitle"
					>
						<TableHead>
							<TableRow>
								<TableCell>
									<span>№</span>
								</TableCell>
								<TableCell>
									<span>{t("common.table.date")}</span>
								</TableCell>
								<TableCell>
									<span>{t("common.table.paymentSum")}</span>
								</TableCell>
								<TableCell>
									<span>{t("common.table.actions")}</span>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody className="overflow-hidden">
							{paymentDataList.map((row, rowIndex) => {
								return (
									<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
										<TableCell>{row.row_id}</TableCell>
										<TableCell>
											<div className="">
												{row.payment_date &&
													moment(row.payment_date).format("DD/MM/YYYY")}
											</div>
										</TableCell>
										<TableCell>
											<div className="">
												<NumericFormat
													value={row.sum}
													displayType={"text"}
													allowNegative={false}
													thousandSeparator={" "}
													decimalScale={3}
													className="bg-transparent"
													suffix={contract?.isvalute === "1" ? " $" : " UZS"}
												/>
											</div>
										</TableCell>
										<TableCell>
											<Fab
												color="error"
												variant="action"
												aria-label="delete"
												onClick={() => handleDeleteRow(row.row_id)}
											>
												<i className="bi bi-trash3" />
											</Fab>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			{addTableRowOpen && (
				<AddPaymentTableRows
					open={addTableRowOpen}
					setOpen={setAddTableRowOpen}
					setPaymentDataListToTable={setPaymentDataListToTable}
					price={localPrice}
					month={localMonth}
					date={localDate}
				/>
			)}
		</div>
	)
}

const AddPaymentTableRows = ({
	open,
	setOpen,
	setPaymentDataListToTable,
	price,
	month,
	date
}) => {
	const { t } = useTranslation()
	const validationSchema = yup.object({
		priceForm: yup
			.number()
			.default(0)
			.when("monthForm", ([monthForm], schema) => {
				return monthForm > 0
					? schema.max(Math.floor((price * month) / monthForm), {
							label: "change.tab.paymentList.validation.priceMax",
							value: Math.floor((price * month) / monthForm)
					  })
					: schema.min(0)
			})
			.required("change.tab.paymentList.validation.price"),
		monthForm: yup
			.number()
			.default(1)
			.max(month, {
				label: "change.tab.paymentList.validation.monthMax",
				value: month
			})
			.required("change.tab.paymentList.validation.month"),
		dateForm: yup
			.date()
			.nullable()
			.typeError("change.tab.paymentList.validation.dateValid")
			.min(
				new Date("Sat Jan 01 2000 00:00:00 GMT+0500"),
				"change.tab.paymentList.validation.dateMin"
			)
			.required("change.tab.paymentList.validation.date")
	})

	const formik = useFormik({
		initialValues: {
			priceForm: price,
			monthForm: month,
			dateForm: date
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			setPaymentDataListToTable(
				values.priceForm,
				values.monthForm,
				values.dateForm
			)
			handleClose()
		}
	})

	const handleClose = () => {
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
			<DialogTitle id="alert-dialog-title">
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<form className="px-10">
					<Grid
						container
						spacing={{ xs: 2, sm: 3, lg: 3 }}
						rowSpacing={1}
						columns={{ xs: 12, sm: 12, lg: 12 }}
					>
						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormCurrencyField
								delay={0.1}
								label={t("change.tab.paymentList.fields.sum")}
								fieldName="priceForm"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormNumberField
								delay={0.2}
								label={t("change.tab.paymentList.fields.month")}
								fieldName="monthForm"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormDateField
								delay={0.3}
								label={t("change.tab.paymentList.fields.date")}
								fieldName="dateForm"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} sm={12} xs={12}>
							<div className="flex flex-row items-center justify-center">
								<Button
									color="inherit"
									variant="contained"
									className="!mr-2"
									onClick={() => handleClose()}
								>
									{t("common.button.reject")}
								</Button>
								<Button
									color="success"
									variant="contained"
									className="!ml-2"
									onClick={() => formik.handleSubmit()}
								>
									{t("common.button.save")}
								</Button>
							</div>
						</Grid>
					</Grid>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default TabThreeSubTabTwo
