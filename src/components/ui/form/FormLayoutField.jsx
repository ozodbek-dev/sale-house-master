import {
	Button,
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
import { useQuery } from "react-query"
import { fadeUp } from "utils/motion"
import ImagePreviewDialog from "../dialogs/ImagePreviewDialog"
import BaseTooltip from "../tooltips/BaseTooltip"
import { useTranslation } from "react-i18next"
import formLocalizedHelperText from "utils/formLocalizedHelperText"

const FormLayoutField = ({
	delay = 0,
	formik,
	fieldName,
	path,
	label,
	readOnly = false,
	disabled = false
}) => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [openSelectedLayoutImageDialog, setOpenSelectedLayoutImageDialog] =
		useState(false)
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
		<div className="flex flex-row">
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
					role="presentation"
					readOnly={readOnly}
					disabled={disabled}
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
							<MenuItem value={item.id} key={index + 1}>
								{item.name}
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
			{formik.values[fieldName] && !(readOnly || disabled) && (
				<BaseTooltip
					title={t("common.tooltip.viewPlan")}
					arrow={true}
					placement="top"
					enterDelay={500}
				>
					<span>
						<Button
							type="button"
							initial="hidden"
							animate="show"
							viewport={{ once: true, amount: 0.25 }}
							variant="actionLarge"
							className="!ml-2 !mt-2"
							onClick={() => setOpenSelectedLayoutImageDialog(true)}
							disabled={isLoading || isFetching}
						>
							<i className="bi bi-image" />
						</Button>
					</span>
				</BaseTooltip>
			)}

			{openSelectedLayoutImageDialog && (
				<ImagePreviewDialog
					open={openSelectedLayoutImageDialog}
					setOpen={setOpenSelectedLayoutImageDialog}
					url={
						data.find((item) => item.id === parseInt(formik.values[fieldName]))
							?.link
					}
				/>
			)}
		</div>
	)
}

export default FormLayoutField
