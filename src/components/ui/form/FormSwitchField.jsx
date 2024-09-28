import {
	FormControl,
	FormControlLabel,
	FormHelperText,
	Switch
} from "@mui/material"
import { motion } from "framer-motion"
import React from "react"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormSwitchField = ({
	delay = 0,
	label,
	fieldName,
	formik,
	options = [],
	disabled = false
}) => {
	return (
		<FormControl
			component={motion.div}
			variants={fadeUp(30, "tween", delay, 0.5)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
			color="formColor"
			error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
		>
			<FormControlLabel
				control={
					<Switch
						id={fieldName}
						name={fieldName}
						checked={
							formik.values[fieldName]
								? options.find(
										(item) => item.value === formik.values[fieldName]
								  ).checked
								: false
						}
						disabled={disabled}
						onChange={(event) => {
							formik.setFieldValue(
								fieldName,
								options.find((item) => item.checked === event.target.checked)
									.value,
								true
							)
						}}
					/>
				}
				label={label}
			/>
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

export default FormSwitchField
