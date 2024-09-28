import {
	FormControl,
	FormControlLabel,
	FormHelperText,
	FormLabel,
	Radio,
	RadioGroup
} from "@mui/material"
import { motion } from "framer-motion"
import React from "react"
import { useTranslation } from "react-i18next"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormRadioGroupField = ({
	delay = 0,
	formik,
	fieldName,
	label,
	options = [],
	disabled = false
}) => {
	const { t } = useTranslation()

	return (
		<FormControl
			className="!my-0"
			fullWidth
			component={motion.div}
			variants={fadeUp(30, "tween", delay, 0.5)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
			color="formColor"
			type="radiogroup"
			error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
		>
			<FormLabel id={`${fieldName}-radio-buttons-group`}>{label}</FormLabel>
			<RadioGroup
				row
				aria-labelledby={`${fieldName}-radio-buttons-group`}
				name={`${fieldName}-radio-buttons-group-name`}
				value={formik.values[fieldName]}
				onChange={(event) => {
					formik.setFieldValue(fieldName, event.target.value, true)
				}}
			>
				{options &&
					options.length > 0 &&
					options.map((option) => (
						<FormControlLabel
							key={option.code}
							value={option.code}
							control={<Radio />}
							label={t(option.label)}
							disabled={disabled}
						/>
					))}
			</RadioGroup>
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

export default FormRadioGroupField
