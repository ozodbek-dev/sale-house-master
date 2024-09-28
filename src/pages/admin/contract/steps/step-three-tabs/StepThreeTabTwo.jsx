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

const StepThreeTabTwo = ({
	month,
	left,
	date,
	interval,
	paymentDataList = [],
	setPaymentDataList = () => {},
	currency
}) => {
	const { t } = useTranslation()
	const [localLeft, setLocalLeft] = useState(left)
	const [localPrice, setLocalPrice] = useState(left / month)
	const [localMonth, setLocalMonth] = useState(month)
	const [localDate, setLocalDate] = useState(date)
	const [addTableRowOpen, setAddTableRowOpen] = useState(false)

	const setPaymentDataListToTable = (priceL, monthL, dateL) => {
		let arr = [...paymentDataList]
		for (let i = 1; i <= monthL; i++) {
			arr.push({
				id: paymentDataList.length + i,
				date: moment(dateL)
					.add(interval * (i - 1), "month")
					.format("YYYY-MM-DD"),
				left: localLeft - priceL * (i - 1),
				sum: priceL
			})
		}
		/* for (let i = 1; i <= monthL; i++) {
			if(localLeft - priceL * (i - 1) > 0) {
				console.log("a = ", localLeft - priceL * (i - 1));
				arr.push({
					id: paymentDataList.length + i,
					date: moment(dateL)
						.add(interval * (i - 1), "month")
						.format("YYYY-MM-DD"),
					left: localLeft - priceL * (i - 1),
					sum: priceL
				})
			}
			else {
				console.log("I'm here");
				leftPriceWrong = true
				break
			}
		}
		if(leftPriceWrong) {
			console.log("arr = ", arr);
		} */
		setLocalPrice((localLeft - priceL * monthL) / (localMonth - monthL))
		setLocalMonth(localMonth - monthL)
		setLocalDate(
			moment(arr.at(-1).date).add(interval, "month").format("YYYY-MM-DD")
		)
		setLocalLeft(localLeft - priceL * monthL)
		setPaymentDataList(arr)
	}

	const handleDeleteRow = (id) => {
		paymentDataList.splice(id - 1, 1)
		let splicedPaymentDataList = [...paymentDataList]
		if (splicedPaymentDataList.length > 0) {
			if (id === 1) {
				splicedPaymentDataList[0].id = id
				splicedPaymentDataList[0].date = moment(date).format("YYYY-MM-DD")
				splicedPaymentDataList[0].left = left
				for (let i = id; i < splicedPaymentDataList.length; i++) {
					splicedPaymentDataList[i].id = i + 1
					splicedPaymentDataList[i].date = moment(
						splicedPaymentDataList[i - 1].date
					)
						.add(interval, "month")
						.format("YYYY-MM-DD")
					splicedPaymentDataList[i].left =
						splicedPaymentDataList[i - 1].left -
						splicedPaymentDataList[i - 1].sum
				}
			} else {
				for (let i = id - 1; i < splicedPaymentDataList.length; i++) {
					splicedPaymentDataList[i].id = i + 1
					splicedPaymentDataList[i].date = moment(
						splicedPaymentDataList[i - 1].date
					)
						.add(interval, "month")
						.format("YYYY-MM-DD")
					splicedPaymentDataList[i].left =
						splicedPaymentDataList[i - 1].left -
						splicedPaymentDataList[i - 1].sum
				}
			}
			setLocalPrice(
				(splicedPaymentDataList.at(-1).left -
					splicedPaymentDataList.at(-1).sum) /
					(month - splicedPaymentDataList.length)
			)
			setLocalMonth(month - splicedPaymentDataList.length)
			setLocalDate(
				moment(splicedPaymentDataList.at(-1).date)
					.add(interval, "month")
					.format("YYYY-MM-DD")
			)
			setLocalLeft(
				splicedPaymentDataList.at(-1).left - splicedPaymentDataList.at(-1).sum
			)
			setPaymentDataList(splicedPaymentDataList)
		} else {
			handleDeleteAll()
		}
	}

	const handleDeleteAll = () => {
		setLocalLeft(left)
		setLocalPrice(left / month)
		setLocalMonth(month)
		setLocalDate(date)
		setPaymentDataList([])
	}

	const setPaymentDataListToTableFromFieldsChanges = (
		newMonth,
		newLeft,
		newDate,
		newInterval
	) => {
		let arr = [...paymentDataList]
		arr[0].date = moment(newDate).format("YYYY-MM-DD")
		arr[0].left = newLeft
		for (let i = 1; i < arr.length; i++) {
			arr[i].date = moment(arr[i - 1].date)
				.add(newInterval, "month")
				.format("YYYY-MM-DD")
			arr[i].left = arr[i - 1].left - arr[i - 1].sum
		}
		setLocalPrice((arr.at(-1).left - arr.at(-1).sum) / (newMonth - arr.length))
		setLocalMonth(newMonth - arr.length)
		setLocalDate(
			moment(arr.at(-1).date).add(newInterval, "month").format("YYYY-MM-DD")
		)
		setLocalLeft(arr.at(-1).left - arr.at(-1).sum)
		setPaymentDataList(arr)
	}

	useEffect(() => {
		if (paymentDataList.length > 0) {
			setPaymentDataListToTableFromFieldsChanges(month, left, date, interval)
		} else {
			setLocalLeft(left)
			setLocalPrice(left / month)
			setLocalMonth(month)
			setLocalDate(date)
		}
	}, [month, left, date, interval])

	return (
		<div className="payment-details changes-table flex flex-col mt-4 px-20">
			<div className="my-shadow-2 rounded-lg p-3 border border-base-color flex items-center justify-evenly mb-4">
				<div>
					{t("contract.step.three.sumAll")}:{" "}
					<NumericFormat
						value={left}
						displayType={"text"}
						allowNegative={false}
						thousandSeparator={" "}
						decimalScale={3}
						className="bg-transparent"
						suffix={currency === "1" ? " $" : " UZS"}
					/>
				</div>
				<div>
					{t("contract.step.three.leftSum")}:{" "}
					<NumericFormat
						value={localLeft}
						displayType={"text"}
						allowNegative={false}
						thousandSeparator={" "}
						decimalScale={3}
						className="bg-transparent"
						suffix={currency === "1" ? " $" : " UZS"}
					/>
				</div>
				<div className="flex flex-row items-center">
					{localLeft && paymentDataList.length !== month ? (
						<SuccessTooltip
							arrow={true}
							placement="top"
							title={t("contract.step.three.addPayment")}
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
							title={t("contract.step.three.deleteAll")}
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
									<span>{t("common.table.leftSum")}</span>
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
										<TableCell>{row.id}</TableCell>
										<TableCell>
											<div className="w-[250px] -my-2">
												{row.date && moment(row.date).format("DD/MM/YYYY")}
											</div>
										</TableCell>
										<TableCell>
											<div className="w-[250px] -my-2">
												<NumericFormat
													value={row.left}
													displayType={"text"}
													allowNegative={false}
													thousandSeparator={" "}
													decimalScale={3}
													className="bg-transparent"
													suffix={currency === "1" ? " $" : " UZS"}
												/>
											</div>
										</TableCell>
										<TableCell>
											<div className="w-[250px] -my-2">
												<NumericFormat
													value={row.sum}
													displayType={"text"}
													allowNegative={false}
													thousandSeparator={" "}
													decimalScale={3}
													className="bg-transparent"
													suffix={currency === "1" ? " $" : " UZS"}
												/>
											</div>
										</TableCell>
										<TableCell>
											<Fab
												color="error"
												variant="action"
												aria-label="delete"
												onClick={() => handleDeleteRow(row.id)}
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
							label: "contract.step.three.validation.paymentPriceMax",
							value: Math.floor((price * month) / monthForm)
					  })
					: schema.min(0)
			})
			.required("contract.step.three.validation.paymentPrice"),
		monthForm: yup
			.number()
			.default(1)
			.max(month, {
				label: "contract.step.three.validation.paymentMonthMax",
				value: month
			})
			.required("contract.step.three.validation.paymentMonth"),
		dateForm: yup
			.date()
			.nullable()
			.typeError("contract.step.three.validation.paymentDateValid")
			.min(
				new Date("Sat Jan 01 2000 00:00:00 GMT+0500"),
				"contract.step.three.validation.paymentDateMin"
			)
			.required("contract.step.three.validation.paymentDate")
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
								label={t("contract.step.three.fields.sum")}
								fieldName="priceForm"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormNumberField
								delay={0.2}
								label={t("contract.step.three.fields.month")}
								fieldName="monthForm"
								formik={formik}
							/>
						</Grid>

						<Grid item={true} lg={4} sm={6} xs={12}>
							<FormDateField
								delay={0.3}
								label={t("contract.step.three.fields.date")}
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

export default StepThreeTabTwo
