import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"

const TabThreeSubTabOne = ({
	dateAndInterval = {},
	paymentDataList = [],
	setPaymentDataList = () => {}
}) => {
	const { t } = useTranslation()

	const handlePaymentDate = (value, id) => {
		if (value && id) {
			paymentDataList.forEach((item) => {
				if (item.row_id === id) item.payment_date = value
			})
			setPaymentDataList([...paymentDataList])
		}
	}

	const handleDateError = (value) => {
		return (
			!!value &&
			moment(value) &&
			!moment(value).isValid() &&
			moment(value) < moment("2000-1-1")
		)
	}

	const handlePaymentPrice = (value, id) => {
		if (!isNaN(value) && id) {
			paymentDataList.forEach((item) => {
				if (item.row_id === id) {
					item.sum = value
					if (item.row_id !== paymentDataList.length) {
						paymentDataList[item.row_id].left =
							paymentDataList[item.row_id - 1].left - value
						paymentDataList[item.row_id].sum = Math.floor(
							paymentDataList[item.row_id].left /
								(paymentDataList.length - item.row_id)
						)
						for (
							let index = item.row_id + 1;
							index < paymentDataList.length;
							index++
						) {
							paymentDataList[index].left =
								paymentDataList[index - 1].left - paymentDataList[index - 1].sum
							paymentDataList[index].sum = Math.floor(
								paymentDataList[index].left / (paymentDataList.length - index)
							)
						}
					}
				}
			})
			setPaymentDataList([...paymentDataList])
		}
	}

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
						</TableRow>
					</TableHead>
					<TableBody className="overflow-hidden">
						{paymentDataList.map((row, rowIndex) => {
							return (
								<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
									<TableCell>{row.row_id}</TableCell>
									<TableCell>
										<div className="w-[250px] -my-2">
											<LocalizationProvider dateAdapter={AdapterMoment}>
												<DatePicker
													id="payment-date-picker"
													openTo="day"
													value={row.payment_date}
													onChange={(newValue) => {
														handlePaymentDate(
															moment(newValue).format("YYYY-MM-DD"),
															row.row_id
														)
													}}
													views={["year", "month", "day"]}
													inputFormat="DD/MM/yyyy"
													error={handleDateError(row.payment_date)}
													renderInput={(params) => (
														<TextField
															{...params}
															color="formColor"
															variant="outlined"
															fullWidth
															id="date"
															name="date"
															autoComplete="off"
														/>
													)}
												/>
											</LocalizationProvider>
										</div>
									</TableCell>
									<TableCell>
										<div className="w-[250px] -my-2">
											<NumericFormat
												id="payment-currency-field"
												name="sum"
												value={row.sum}
												onChange={(event) => {
													let formattedValue =
														event.target.value &&
														parseFloat(event.target.value.split(" ").join(""))
													handlePaymentPrice(formattedValue || 0, row.row_id)
												}}
												error={false}
												helperText={""}
												color="formColor"
												variant="outlined"
												fullWidth
												customInput={TextField}
												inputProps={{
													readOnly: rowIndex === paymentDataList.length - 1
												}}
												allowNegative={false}
												thousandSeparator={" "}
												decimalScale={3}
											/>
										</div>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}

export default TabThreeSubTabOne
