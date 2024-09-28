import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import React from "react"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import { TextField } from "@mui/material"
import { motion } from "framer-motion"
import { fadeUp } from "utils/motion"
import formLocalizedHelperText from "utils/formLocalizedHelperText"

const FormDateField = ({
	delay = 0,
	formik,
	label,
	fieldName,
	minDate = null,
	readOnly = false,
	disabled = false
}) => {
	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DatePicker
				id={`${fieldName}-date-picker`}
				openTo="day"
				value={formik.values[fieldName]}
				onChange={(newValue) =>
					formik.setFieldValue(
						fieldName,
						moment(newValue).format("YYYY-MM-DD"),
						true
					)
				}
				views={["year", "month", "day"]}
				inputFormat="DD/MM/yyyy"
				minDate={minDate}
				readOnly={readOnly}
				disabled={disabled}
				renderInput={(params) => (
					<TextField
						{...params}
						component={motion.div}
						variants={fadeUp(30, "tween", delay, 0.5)}
						initial="hidden"
						animate="show"
						viewport={{ once: true, amount: 0.25 }}
						color="formColor"
						variant="outlined"
						fullWidth
						id={fieldName}
						name={fieldName}
						label={label}
						error={
							formik.touched[fieldName] && Boolean(formik.errors[fieldName])
						}
						helperText={
							formik.touched[fieldName] &&
							formLocalizedHelperText(formik.errors[fieldName])
						}
						autoComplete="off"
					/>
				)}
			/>
		</LocalizationProvider>
	)
}

export default FormDateField
