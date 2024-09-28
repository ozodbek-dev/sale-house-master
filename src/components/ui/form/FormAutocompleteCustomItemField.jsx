import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { motion } from "framer-motion"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import React, { Fragment, useEffect, useState } from "react"
import { useQuery } from "react-query"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormAutocompleteCustomItemField = ({
	delay = 0,
	formik,
	fieldName,
	path,
	label,
	itemValue = "id",
	itemName = "name",
	readOnly = false,
	disabled = false,
	pathChangeable = false
}) => {
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const { data, isLoading, isFetching, refetch } = useQuery({
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

	useEffect(() => {
		if (pathChangeable) {
			refetch()
			formik.setFieldValue(fieldName, "", true)
		}
	}, [path])

	return (
		<Fragment>
			<Autocomplete
				id={`${fieldName}-autocomplete`}
				options={data || []}
				disableClearable
				fullWidth
				loading={isLoading || isFetching}
				noOptionsText="Ma'lumot topilmadi"
				getOptionLabel={(option) =>
					option[itemName] ? `${option[itemName]}` : ""
				}
				onChange={(event, value) => {
					formik.setFieldValue(
						fieldName,
						value[itemValue] ? value[itemValue] : "",
						true
					)
				}}
				readOnly={readOnly}
				disabled={disabled}
				loadingText={
					<div className="circular-progress-box">
						<CircularProgress size={25} />
					</div>
				}
				renderInput={(params) => (
					<TextField
						{...params}
						color="formColor"
						variant="outlined"
						component={motion.div}
						variants={fadeUp(30, "tween", delay, 0.5)}
						initial="hidden"
						animate="show"
						viewport={{ once: true, amount: 0.25 }}
						label={label}
						error={
							formik.touched[fieldName] && Boolean(formik.errors[fieldName])
						}
						helperText={
							formik.touched[fieldName] &&
							formLocalizedHelperText(formik.errors[fieldName])
						}
						autoComplete="off"
					/>
				)}
			/>
		</Fragment>
	)
}

export default FormAutocompleteCustomItemField
