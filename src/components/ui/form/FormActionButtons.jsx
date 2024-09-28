import { Button, CircularProgress } from "@mui/material"
import { motion } from "framer-motion"
import usePrevNext from "hooks/usePrevNext"
import React from "react"
import { useTranslation } from "react-i18next"
import { fadeUp } from "utils/motion"

const FormActionButtons = ({
	delay = 0,
	isSubmitting = false,
	onlySave = false,
	formType = "simple",
	setOpen = () => {},
	reset = () => {},
	className = ""
}) => {
	const { prev } = usePrevNext()
	const { t } = useTranslation()
	const handleClose = () => {
		if (formType === "dialog") {
			setOpen(false)
			reset()
		} else {
			prev()
		}
	}

	return (
		<div className={`text-center mt-5${className ? " " + className : ""}`}>
			{!onlySave && (
				<Button
					variant="contained"
					type="button"
					component={motion.button}
					variants={fadeUp(30, "tween", delay, 0.5)}
					initial="hidden"
					animate="show"
					viewport={{ once: true, amount: 0.25 }}
					disabled={isSubmitting}
					onClick={handleClose}
					className="!mr-1"
					color="error"
				>
					{t("common.button.cancel")}
				</Button>
			)}

			<Button
				color="success"
				variant="contained"
				type="submit"
				component={motion.button}
				variants={fadeUp(30, "tween", delay + 0.1, 0.5)}
				initial="hidden"
				animate="show"
				viewport={{ once: true, amount: 0.25 }}
				disabled={isSubmitting}
				className={onlySave ? "" : "!ml-1"}
			>
				{isSubmitting && (
					<CircularProgress size={15} color="inherit" className="mr-1" />
				)}
				{t("common.button.save")}
			</Button>
		</div>
	)
}

export default FormActionButtons
