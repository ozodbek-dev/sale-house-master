import {
	CircularProgress,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select
} from "@mui/material"
import { motion } from "framer-motion"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormSelectCustomItemField = ({
	delay = 0,
	formik,
	fieldName,
	path,
	label,
	itemValue = "id",
	itemLabel = "name",
	readOnly = false,
	disabled = false
}) => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const { data, isLoading, isFetching } = useQuery({
		queryKey: fieldName + "Select",
		queryFn: async function () {
			const response = await axiosPrivate.get(path)
			return response.data.data
		},
		enabled: !hasError,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	return (
		<FormControl
			fullWidth
			component={motion.div}
			variants={fadeUp(30, "tween", delay, 0.5)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
			color="formColor"
			error={formik.touched[fieldName] && Boolean(formik.errors[fieldName])}
		>
			<InputLabel id={`${fieldName}-label`}>{label}</InputLabel>
			<Select
				labelId={`${fieldName}-label`}
				id={`${fieldName}-select`}
				label={label}
				onChange={(event) => {
					formik.setFieldValue(fieldName, event.target.value, true)
				}}
				value={isLoading || isFetching ? "" : formik.values[fieldName]}
				color="formColor"
				variant="outlined"
				readOnly={readOnly}
				disabled={disabled}
				role="presentation"
				MenuProps={{
					id: `${fieldName}-select-menu`,
					disableScrollLock: true,
					PaperProps: {
						style: {
							maxHeight: 300
						}
					}
				}}
			>
				{isLoading || isFetching ? (
					<div className="circular-progress-box">
						<CircularProgress size={25} />
					</div>
				) : data && data.length > 0 ? (
					data.map((item, index) => (
						<MenuItem value={item[itemValue]} key={index + 1}>
							{item[itemLabel]}
						</MenuItem>
					))
				) : (
					<div>
						<span className="no-data-found-wrapper select-box">
							<i className="bi bi-exclamation-octagon text-lg mr-1" />{" "}
							{t("common.global.noDataFound")}
						</span>
					</div>
				)}
			</Select>
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

export default FormSelectCustomItemField
