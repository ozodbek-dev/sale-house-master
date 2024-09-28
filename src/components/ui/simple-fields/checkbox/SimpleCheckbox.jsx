import { Checkbox, FormControl, FormControlLabel } from "@mui/material"
import { motion } from "framer-motion"
import React from "react"
import { fadeUp } from "utils/motion"

const SimpleCheckbox = ({
	delay = 0,
	duration = 0,
	label,
	setValue,
	value
}) => {
	return (
		<FormControl
			fullWidth
			component={motion.div}
			variants={fadeUp(30, "tween", delay, duration)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
			color="formColor"
			type="checkbox"
		>
			<FormControlLabel
				control={
					<Checkbox
						id={label.toLowerCase()}
						name={label.toLowerCase()}
						checked={value}
						onChange={(event) => {
							setValue(event.target.checked)
						}}
					/>
				}
				label={label}
				componentsProps={{
					typography: {
						style: {
							lineHeight: "14px"
						}
					}
				}}
			/>
		</FormControl>
	)
}

export default SimpleCheckbox
