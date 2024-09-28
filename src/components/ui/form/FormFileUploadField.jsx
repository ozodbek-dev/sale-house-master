import { Button, FormControl, FormHelperText } from "@mui/material"
import { motion } from "framer-motion"
import React from "react"
import { fadeUp } from "utils/motion"
import BaseTooltip from "../tooltips/BaseTooltip"
import useNotification from "hooks/useNotification"
import { useTranslation } from "react-i18next"
import formLocalizedHelperText from "utils/formLocalizedHelperText"

const FormFileUploadField = ({
	delay = 0,
	formik,
	fieldName,
	label = "",
	btnLabel = "",
	accept = "",
	fileSize = 150,
	disabled = false
}) => {
	const { t } = useTranslation()
	const sendNotification = useNotification()

	return (
		<FormControl
			component={motion.div}
			variants={fadeUp(30, "tween", delay, 0.5)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
			color="formColor"
			fullWidth
		>
			<div className="flex items-center">
				{formik.values[fieldName] &&
					(typeof formik.values[fieldName] === "string" ? (
						<div className="flex items-center w-full text-line-1 mr-2 my-shadow-2 px-4 py-2 rounded-lg">
							{formik.values[fieldName]}
						</div>
					) : (
						<Button
							variant="contained"
							color="primary"
							className="upload-btn uploaded"
							disabled={disabled}
						>
							<span className="text-line-1">
								{formik.values[fieldName].name}
							</span>
						</Button>
					))}

				{formik.values[fieldName] ? (
					<BaseTooltip title={t("common.tooltip.reUpload")} arrow>
						<Button
							variant="uploadOnlyIcon"
							component="label"
							className={`upload-btn${
								formik.touched[fieldName] && Boolean(formik.errors[fieldName])
									? " field-required-error"
									: ""
							}`}
							disabled={disabled}
						>
							<i className="bi bi-upload" />
							<input
								hidden
								id={fieldName}
								name={fieldName}
								label={label}
								type="file"
								accept={accept}
								onChange={(event) => {
									if (
										event.target.files[0] &&
										Math.floor(event.target.files[0].size / 1024) > fileSize
									) {
										formik.setFieldValue(fieldName, event.target.files[0], true)
									} else {
										sendNotification({
											msg: t("common.alerts.warning.fileSize", {
												value: fileSize
											}),
											variant: "warning"
										})
									}
								}}
							/>
						</Button>
					</BaseTooltip>
				) : (
					<Button
						variant="upload"
						component="label"
						className={`upload-btn${
							formik.touched[fieldName] && Boolean(formik.errors[fieldName])
								? " field-required-error"
								: ""
						}`}
						disabled={disabled}
					>
						{btnLabel}
						<input
							hidden
							id={fieldName}
							name={fieldName}
							label={label}
							type="file"
							accept={accept}
							onChange={(event) => {
								if (
									event.target.files[0] &&
									Math.floor(event.target.files[0].size / 1024) > fileSize
								) {
									formik.setFieldValue(fieldName, event.target.files[0], true)
								} else {
									sendNotification({
										msg: t("common.alerts.warning.fileSize", {
											value: fileSize
										}),
										variant: "warning"
									})
								}
							}}
						/>
					</Button>
				)}
			</div>
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

export default FormFileUploadField
