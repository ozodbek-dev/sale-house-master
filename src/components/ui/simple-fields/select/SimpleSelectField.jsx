import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { motion } from "framer-motion"
import React from "react"
import { useTranslation } from "react-i18next"
import { fadeUp } from "utils/motion"

const SimpleSelectField = ({
	delay = 0,
	options = [],
	label,
	name,
	value,
	changeFn = () => {},
	itemValue = "code",
	itemLabel = "label",
	readOnly = false,
	disabled = false
}) => {
	const { t } = useTranslation()

	return (
		<FormControl
			fullWidth
			component={motion.div}
			variants={fadeUp(30, "tween", delay, 0.5)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
			color="formColor"
		>
			<InputLabel id={`${name}-label`}>{label}</InputLabel>
			<Select
				labelId={`${name}-label`}
				id={`${name}-select`}
				label={label}
				onChange={(event) => changeFn(event.target.value)}
				value={value}
				color="formColor"
				variant="outlined"
				readOnly={readOnly}
				disabled={disabled}
				role="presentation"
				MenuProps={{ id: `${name}-select-menu` }}
			>
				{options.map((item, index) => (
					<MenuItem
						value={item[itemValue]}
						key={index + 1}
						selected={index === 0}
					>
						{t(item[itemLabel])}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default SimpleSelectField
