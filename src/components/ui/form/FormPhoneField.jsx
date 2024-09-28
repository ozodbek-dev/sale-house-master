import { TextField } from "@mui/material"
import { motion } from "framer-motion"
import { Fragment } from "react"
import { PatternFormat } from "react-number-format"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormPhoneField = ({
	delay = 0,
	fieldName,
	formik,
	label,
	readOnly = false,
	disabled = false
}) => {
	return (
		<Fragment>
			{formik && formik.values && formik.touched && formik.errors && (
				<PatternFormat
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
					format="+998 ## ###-##-##"
				/>
			)}
		</Fragment>
	)
}

export default FormPhoneField
