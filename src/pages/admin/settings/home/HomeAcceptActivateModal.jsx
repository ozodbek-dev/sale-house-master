import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton
} from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

const HomeAcceptActivateModal = ({ open, setOpen, homeId, refetch }) => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const sendNotification = useNotification()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleClose = () => {
		setOpen(false)
	}

	const handleAction = async (action) => {
		if (action === "cancel") setOpen(false)
		if (action === "delete") {
			try {
				setIsSubmitting(true)
				const response = await axiosPrivate.post(
					`/changer/activate/${homeId}`,
					{ headers: { "Content-Type": "application/json" } }
				)
				if (response.data && response.data.status) {
					sendNotification({
						msg: t("settings.home.modal.activate.alerts.success"),
						variant: "success"
					})
					setIsSubmitting(false)
					refetch()
					handleClose()
				}
			} catch (error) {
				sendNotification({
					msg: error?.response?.data?.message || error?.message,
					variant: "error"
				})
				setIsSubmitting(false)
				handleClose()
			}
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="lg"
			disableEscapeKeyDown={true}
		>
			<DialogTitle id="order-dialog-title">
				<span className="text-xl">
					{t("settings.home.modal.activate.title")}
				</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{t("settings.home.modal.activate.warningText")}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<div className="mb-4 mr-4">
					<Button
						variant="contained"
						color="error"
						onClick={() => handleAction("cancel")}
					>
						{t("common.button.reject")}
					</Button>
					<Button
						onClick={() => handleAction("delete")}
						variant="contained"
						color="success"
						disabled={isSubmitting}
						className="!ml-4"
					>
						{isSubmitting && (
							<CircularProgress size={15} color="inherit" className="mr-1" />
						)}
						{t("common.button.accept")}
					</Button>
				</div>
			</DialogActions>
		</Dialog>
	)
}

export default HomeAcceptActivateModal
