import { Autocomplete, CircularProgress, TextField } from "@mui/material"
import { motion } from "framer-motion"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import React, { Fragment, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import formLocalizedHelperText from "utils/formLocalizedHelperText"
import { fadeUp } from "utils/motion"

const FormAutocompleteField = ({
	delay = 0,
	formik,
	fieldName,
	path,
	label,
	readOnly = false,
	disabled = false,
	pathChangeable = false
}) => {
	const { t } = useTranslation()
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
				noOptionsText={t("common.global.noDataFound")}
				getOptionLabel={(option) => (option.name ? option.name : "")}
				onChange={(event, value) => {
					formik.setFieldValue(fieldName, value.id ? value.id : "", true)
				}}
				loadingText={
					<div className="circular-progress-box">
						<CircularProgress size={25} />
					</div>
				}
				readOnly={readOnly}
				disabled={disabled}
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

export default FormAutocompleteField
