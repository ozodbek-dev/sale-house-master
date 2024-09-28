import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import React from "react"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import { TextField } from "@mui/material"
import { motion } from "framer-motion"
import { fadeUp } from "utils/motion"

const SimpleDateField = ({
	delay = 0,
	label,
	name,
	value,
	setValue,
	error = false,
	helperText = "",
	size = "",
	minDate = null
}) => {
	return (
		<LocalizationProvider dateAdapter={AdapterMoment}>
			<DatePicker
				id={`${name}-date-picker`}
				openTo="day"
				value={value}
				onChange={(newValue) => {
					setValue(moment(newValue).format("YYYY-MM-DD"))
				}}
				views={["year", "month", "day"]}
				inputFormat="DD/MM/yyyy"
				InputProps={{
					size: size
				}}
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
						id={`${name}-date-picker-text-field`}
						name={name}
						label={label}
						error={error}
						helperText={helperText}
						autoComplete="off"
					/>
				)}
			/>
		</LocalizationProvider>
	)
}

export default SimpleDateField
