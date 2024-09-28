import { IconButton, InputAdornment, TextField } from "@mui/material"
import { motion } from "framer-motion"
import React, { Fragment, useState } from "react"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormPasswordField = ({
	delay = 0,
	formik,
	fieldName,
	label,
	onKeyDown = () => {},
	readOnly = false,
	disabled = false
}) => {
	const [showPassword, setShowPassword] = useState(false)
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
					type={showPassword ? "text" : "password"}
					error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
					helperText={
						formik.touched[fieldName] &&
						formLocalizedHelperText(formik.errors[fieldName])
					}
					value={formik.values[fieldName]}
					onChange={(event) => {
						let value = event.target.value.replace(" ", "")
						formik.setFieldValue(fieldName, value, true)
					}}
					onKeyDown={onKeyDown}
					InputProps={{
						readOnly: readOnly,
						disabled: disabled,
						endAdornment: (
							<InputAdornment position="end" className="custom-endAdornment">
								<IconButton
									aria-label="toggle password visibility"
									onClick={() => setShowPassword((prev) => !prev)}
								>
									{showPassword ? (
										<i className="bi bi-eye text-xl leading-4" />
									) : (
										<i className="bi bi-eye-slash text-xl leading-4" />
									)}
								</IconButton>
							</InputAdornment>
						)
					}}
					autoComplete="off"
					sx={{
						"& .MuiOutlinedInput-root.Mui-focused i": {
							color: "#007bb2"
						},
						"& .MuiOutlinedInput-root i": {
							color: "#9ca3af"
						},
						"& .MuiOutlinedInput-root.Mui-error i": {
							color: "#f40606"
						}
					}}
				/>
			)}
		</Fragment>
	)
}

export default FormPasswordField
