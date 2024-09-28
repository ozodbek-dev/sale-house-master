import { Fab } from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { Fragment, useState } from "react"
import DeleteConfirmDialog from "../dialogs/DeleteConfirmDialog"
import { useTranslation } from "react-i18next"

const DeleteActionButton = ({ link = "", data = {}, refetch }) => {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const axiosPrivate = useAxiosPrivate()
	const sendNotification = useNotification()

	const handleAction = (action) => {
		if (action === "cancel") setOpen(false)
		if (action === "delete") {
			setLoading(true)
			axiosPrivate
				.delete(link, { data: data })
				.then((result) => {
					if (
						result.data &&
						result.data.acknowledged &&
						result.data.deletedCount
					) {
						sendNotification({
							msg: t("common.alerts.success.delete"),
							variant: "success"
						})
						setOpen(false)
						refetch()
					}
				})
				.catch((err) => {
					sendNotification({
						msg: t("common.alerts.error.delete"),
						variant: "error"
					})
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}

	return (
		<Fragment>
			<Fab
				color="error"
				variant="action"
				aria-label="delete"
				onClick={() => setOpen(true)}
			>
				<i className="bi bi-trash3" />
			</Fab>
			<DeleteConfirmDialog
				open={open}
				setOpen={setOpen}
				handleAction={handleAction}
				loading={loading}
			/>
		</Fragment>
	)
}

export default DeleteActionButton
