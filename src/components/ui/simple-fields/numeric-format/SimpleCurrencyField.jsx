import { TextField } from "@mui/material"
import { motion } from "framer-motion"
import { NumericFormat } from "react-number-format"
import { fadeUp } from "utils/motion"

const SimpleCurrencyField = ({
	delay = 0,
	value,
	setValue,
	label,
	name,
	prefix = "",
	readOnly = false,
	error = false,
	helperText = ""
}) => {
	return (
		<NumericFormat
			id={`${name}-currency-field`}
			name={name}
			label={label}
			value={value}
			delay={delay}
			onChange={(event) => {
				let formattedValue =
					event.target.value && parseInt(event.target.value.split(" ").join(""))
				setValue(formattedValue)
			}}
			error={error}
			helperText={helperText}
			component={motion.div}
			variants={fadeUp(30, "tween", delay, 0.5)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
			color="formColor"
			variant="outlined"
			fullWidth
			customInput={TextField}
			allowNegative={false}
			InputProps={{ readOnly: readOnly }}
			thousandSeparator={" "}
			decimalScale={3}
			prefix={prefix}
		/>
	)
}

export default SimpleCurrencyField
