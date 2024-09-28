import { TextField } from "@mui/material"
import { motion } from "framer-motion"
import React, { Fragment } from "react"
import { NumericFormat } from "react-number-format"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormNumberTextField = ({
	delay = 0,
	formik,
	fieldName,
	label,
	allowLeadingZeros = false,
	decimalScale = 0,
	readOnly = false,
	disabled = false
}) => {
	return (
		<Fragment>
			{formik && formik.values && formik.touched && formik.errors && (
				<NumericFormat
					id={fieldName}
					name={fieldName}
					label={label}
					value={formik.values[fieldName]}
					delay={delay}
					onChange={(event) => {
						formik.setFieldValue(fieldName, event.target.value, true)
					}}
					error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
					helperText={
						formik.touched[fieldName] &&
						formLocalizedHelperText(formik.errors[fieldName])
					}
					component={motion.div}
					variants={fadeUp(30, "tween", delay, 0.5)}
					initial="hidden"
					animate="show"
					viewport={{ once: true, amount: 0.25 }}
					color="formColor"
					variant="outlined"
					fullWidth
					customInput={TextField}
					InputProps={{
						readOnly: readOnly,
						disabled: disabled
					}}
					allowNegative={false}
					allowLeadingZeros={allowLeadingZeros}
					decimalScale={decimalScale}
				/>
			)}
		</Fragment>
	)
}

export default FormNumberTextField
