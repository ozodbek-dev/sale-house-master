import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select
} from "@mui/material"
import { motion } from "framer-motion"
import React from "react"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormSimpleSelectField = ({
	delay = 0,
	options = [],
	formik,
	fieldName,
	label,
	readOnly = false,
	disabled = false,
	itemValue = "id",
	itemLabel = "name",
	changeFn = null
}) => {
	return (
		<FormControl
			fullWidth
			component={motion.div}
			variants={fadeUp(30, "tween", delay, 0.5)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
			color="formColor"
			error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
		>
			<InputLabel id={`${fieldName}-label`}>{label}</InputLabel>
			<Select
				labelId={`${fieldName}-label`}
				id={`${fieldName}-select`}
				label={label}
				onChange={(event) => {
					if (changeFn && typeof changeFn === "function") {
						changeFn(event.target.value)
					} else {
						formik.setFieldValue(fieldName, event.target.value, true)
					}
				}}
				value={formik.values[fieldName]}
				color="formColor"
				variant="outlined"
				readOnly={readOnly}
				disabled={disabled}
				role="presentation"
				MenuProps={{
					id: `${fieldName}-select-menu`,
					disableScrollLock: true,
					PaperProps: {
						style: {
							maxHeight: 300
						}
					}
				}}
			>
				{options.map((item, index) => (
					<MenuItem value={item[itemValue]} key={index + 1}>
						{item[itemLabel]}
					</MenuItem>
				))}
			</Select>
			<FormHelperText
				children={
					<span>
						{formik.touched[fieldName] &&
							formLocalizedHelperText(formik.errors[fieldName])}
					</span>
				}
				error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
			/>
		</FormControl>
	)
}

export default FormSimpleSelectField
