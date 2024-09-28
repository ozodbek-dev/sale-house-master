import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormHelperText
} from "@mui/material"
import { motion } from "framer-motion"
import React from "react"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormCheckboxField = ({
	delay = 0,
	label,
	fieldName,
	formik,
	disabled = false
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
			type="checkbox"
			error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
		>
			<FormControlLabel
				control={
					<Checkbox
						id={fieldName}
						name={fieldName}
						checked={formik.values[fieldName] === "1"}
						disabled={disabled}
						onChange={(event) => {
							formik.setFieldValue(
								fieldName,
								event.target.checked ? "1" : "0",
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

export default FormCheckboxField
