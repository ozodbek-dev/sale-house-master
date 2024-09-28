import { TextField } from "@mui/material"
import { motion } from "framer-motion"
import React, { Fragment } from "react"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormMultilineTextField = ({
	delay = 0,
	formik,
	fieldName,
	label,
	rows = 2,
	readOnly = false,
	disabled = false
}) => {
	return (
		<Fragment>
			{formik && formik.values && formik.touched && formik.errors && (
				<TextField
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
					multiline={true}
					rows={rows}
					error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
					helperText={
						formik.touched[fieldName] &&
						formLocalizedHelperText(formik.errors[fieldName])
					}
					value={formik.values[fieldName]}
					onChange={(event) => {
						formik.setFieldValue(fieldName, event.target.value, true)
					}}
					autoComplete="off"
					InputProps={{
						readOnly: readOnly,
						disabled: disabled
					}}
				/>
			)}
		</Fragment>
	)
}

export default FormMultilineTextField
