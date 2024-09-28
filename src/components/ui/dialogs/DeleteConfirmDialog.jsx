import React from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { CircularProgress } from "@mui/material"
import { useTranslation } from "react-i18next"

const DeleteConfirmDialog = ({ open, setOpen, handleAction, loading }) => {
	const { t } = useTranslation()
	return (
		<div>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				disableEscapeKeyDown={true}
			>
				<DialogTitle id="alert-dialog-title">
					{t("common.modal.delete.title")}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{t("common.modal.delete.body")}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => handleAction("cancel")} color="inherit">
						{t("common.button.cancel")}
					</Button>
					<Button
						onClick={() => handleAction("delete")}
						color="primary"
						disabled={loading}
					>
						{loading && (
							<CircularProgress size={15} color="inherit" className="mr-1" />
						)}
						{t("common.button.delete")}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default DeleteConfirmDialog
