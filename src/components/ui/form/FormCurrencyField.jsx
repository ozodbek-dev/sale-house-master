import { TextField } from "@mui/material"
import { motion } from "framer-motion"
import { Fragment } from "react"
import { NumericFormat } from "react-number-format"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormCurrencyField = ({
	delay = 0,
	fieldName,
	formik,
	label,
	prefix = "",
	readOnly = false,
	disabled = false,
	decimalScale = 3
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
						let formattedValue =
							event.target.value &&
							parseFloat(event.target.value.split(" ").join(""))
						formik.setFieldValue(fieldName, formattedValue, true)
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
					InputProps={{ readOnly: readOnly, disabled: disabled }}
					allowNegative={false}
					thousandSeparator={" "}
					decimalScale={decimalScale}
					prefix={prefix}
				/>
			)}
		</Fragment>
	)
}

export default FormCurrencyField
