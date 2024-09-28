import { TextField } from "@mui/material"
import { motion } from "framer-motion"
import { Fragment } from "react"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

/* const format = (val) => {
	if (!val) return ""
	let valClone = val
	let a = ""
	let firstLetter = ""
	let secondLetter = ""
	let numbers = ""
	if (valClone.length > 0) {
		firstLetter = valClone.match(/([A-Z]{1})/g)
		if (firstLetter && firstLetter.length > 0) {
			valClone = valClone.replace(firstLetter[0], "")
			a += firstLetter[0]
			if (valClone.length > 0) {
				secondLetter = valClone.match(/([A-Z]{1})/g)
				if (secondLetter && secondLetter.length > 0) {
					valClone = valClone.replace(secondLetter[0], "")
					a += secondLetter[0]
					if (valClone.length > 0) {
						numbers = valClone.match(/([0-9]{0,7})/g).filter((item) => !!item)
						if (numbers && numbers.length > 0) {
							console.log(
								"result = ",
								firstLetter[0] + secondLetter[0] + numbers[0]
							)
							a += " " + numbers[0]
						}
					}
				}
			}
		}
	}
	return a
}

const [passport, setPassport] = useState("")

const handlePassport = (val) => {
	let a = format(val)
	console.log("a = ", a)
	setPassport(a)
} */

const FormPassportField = ({
	delay = 0,
	fieldName,
	formik,
	label,
	readOnly = false,
	disabled = false
}) => {
	const format = (val) => {
		if (!val) return ""
		// let testForMatch = val.match(/^([A-Z]{2}[\s][0-9]{0,7})/g)
		// if (testForMatch && testForMatch.length > 0) {
		// 	return testForMatch
		// }
		let valClone = val
		let a = ""
		let firstLetter = ""
		let secondLetter = ""
		let numbers = ""
		if (valClone.length > 0) {
			firstLetter = valClone.match(/([A-Z]{1})/g)
			if (firstLetter && firstLetter.length > 0) {
				// console.log("firstLetter = ", firstLetter)
				valClone = valClone.replace(firstLetter[0], "")
				a += firstLetter[0]
				// console.log("a1 = ", a)
				if (valClone.length > 0) {
					secondLetter = valClone.match(/([A-Z]{1})/g)
					if (secondLetter && secondLetter.length > 0) {
						// console.log("secondLetter = ", secondLetter)
						valClone = valClone.replace(secondLetter[0], "")
						a += secondLetter[0]
						// console.log("a2 = ", a)
						if (valClone.length > 0) {
							numbers = valClone.match(/([0-9]{0,7})/g).filter((item) => !!item)
							if (numbers && numbers.length > 0) {
								// console.log("numbers = ", numbers)
								a += " " + numbers[0]
								// console.log("a3 = ", a)
							}
						}
					}
				}
			}
		}
		return a
	}

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
					error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
					helperText={
						formik.touched[fieldName] &&
						formLocalizedHelperText(formik.errors[fieldName])
					}
					value={formik.values[fieldName]}
					onChange={(event) => {
						let formattedValue =
							event.target.value && format(event.target.value)
						formik.setFieldValue(fieldName, formattedValue, true)
					}}
					InputProps={{
						readOnly: readOnly,
						disabled: disabled
					}}
					autoComplete="off"
				/>
			)}
		</Fragment>
	)
}

export default FormPassportField
