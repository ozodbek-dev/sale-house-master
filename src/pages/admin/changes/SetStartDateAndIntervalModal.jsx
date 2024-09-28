import {
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField
} from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"

const SetStartDateAndIntervalModal = ({ open, setOpen, setData }) => {
	const { t } = useTranslation()
	const [interval, setInterval] = useState(1)
	const [firstPriceDate, setFirstPriceDate] = useState(null)

	const handleData = () => {
		setData({
			firstPriceDate,
			interval
		})
		handleClose()
	}

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
				<span className="pr-5">
					{t("change.startDateAndIntervalModal.title")}
				</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div>
					<Grid
						container
						spacing={{ xs: 2, sm: 3, lg: 3 }}
						rowSpacing={1}
						columns={{ xs: 12, sm: 12, lg: 12 }}
					>
						<Grid item={true} lg={6} sm={6} xs={12}>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<DatePicker
									id="changes-first-date-picker"
									openTo="day"
									value={firstPriceDate}
									onChange={(newValue) => {
										if (
											newValue &&
											newValue._isValid &&
											newValue > moment("2000-1-1")
										) {
											setFirstPriceDate(moment(newValue).format("YYYY-MM-DD"))
										} else {
											setFirstPriceDate("")
										}
									}}
									views={["year", "month", "day"]}
									inputFormat="DD/MM/yyyy"
									renderInput={(params) => (
										<TextField
											{...params}
											color="formColor"
											variant="outlined"
											fullWidth
											id="start"
											name="start"
											label={t("common.fields.firstPriceDate")}
											autoComplete="off"
										/>
									)}
								/>
							</LocalizationProvider>
						</Grid>
						<Grid item={true} lg={6} sm={6} xs={12}>
							<NumericFormat
								id="interval"
								name="interval"
								label={t("common.fields.interval")}
								value={interval}
								onChange={(event) => {
									setInterval(
										event.target.value ? parseFloat(event.target.value) : ""
									)
								}}
								color="formColor"
								variant="outlined"
								fullWidth
								customInput={TextField}
								allowNegative={false}
								decimalScale={0}
							/>
						</Grid>
					</Grid>

					<div className="flex items-center justify-center mt-4">
						<Button
							variant="contained"
							color="success"
							disabled={!interval || !firstPriceDate}
							onClick={() => handleData()}
						>
							{t("common.button.change")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default SetStartDateAndIntervalModal
