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
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"

const StepThreeTabOne = ({
	month,
	left,
	date,
	interval,
	paymentDataList = [],
	setPaymentDataList = () => {},
	currency
}) => {
	const { t } = useTranslation()
	const handlePaymentDate = (value, id) => {
		if (value && id) {
			paymentDataList.forEach((item) => {
				if (item.id === id) item.date = value
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
				if (item.id === id) {
					item.sum = value
					if (item.id !== paymentDataList.length) {
						paymentDataList[item.id].left =
							paymentDataList[item.id - 1].left - value
						paymentDataList[item.id].sum = Math.floor(
							paymentDataList[item.id].left / (paymentDataList.length - item.id)
						)
						for (
							let index = item.id + 1;
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

	return (
		<div className="payment-details changes-table flex flex-col mt-4 px-20">
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
						</TableRow>
					</TableHead>
					<TableBody className="overflow-hidden">
						{paymentDataList.map((row, rowIndex) => {
							return (
								<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
									<TableCell>{row.id}</TableCell>
									<TableCell>
										<div className="w-[250px] -my-2">
											<LocalizationProvider dateAdapter={AdapterMoment}>
												<DatePicker
													id="payment-date-picker"
													openTo="day"
													value={row.date}
													onChange={(newValue) => {
														handlePaymentDate(
															moment(newValue).format("YYYY-MM-DD"),
															row.id
														)
													}}
													views={["year", "month", "day"]}
													inputFormat="DD/MM/yyyy"
													error={handleDateError(row.date)}
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
												id="payment-currency-field"
												name="sum"
												value={row.sum}
												onChange={(event) => {
													let formattedValue =
														event.target.value &&
														parseFloat(event.target.value.split(" ").join(""))
													handlePaymentPrice(formattedValue || 0, row.id)
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

export default StepThreeTabOne
