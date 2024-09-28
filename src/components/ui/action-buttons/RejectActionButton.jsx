import { CircularProgress, Fab } from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { Fragment, useState } from "react"
import DangerTooltip from "../tooltips/DangerTooltip"

const RejectActionButton = ({
	link = "",
	successMsg = "",
	setRefetch = () => {},
	hasTooltip = false,
	tooltipProps = {}
}) => {
	const axiosPrivate = useAxiosPrivate()
	const sendNotification = useNotification()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleReject = async () => {
		try {
			setIsSubmitting(true)
			const response = await axiosPrivate.post(
				link,
				{},
				{
					headers: { "Content-Type": "application/json" }
				}
			)
			if (response.data && response.data.status) {
				sendNotification({
					msg: successMsg,
					variant: "success"
				})
				setRefetch(true)
			}
			setIsSubmitting(false)
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsSubmitting(false)
		}
	}

	return (
		<Fragment>
			<DangerTooltip
				disableHoverListener={!hasTooltip}
				arrow={true}
				placement="top"
				{...tooltipProps}
			>
				<Fab
					color="error"
					variant="action"
					aria-label="delete"
					onClick={() => handleReject()}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<CircularProgress size={15} color="inherit" />
					) : (
						<i className="bi bi-x-lg" />
					)}
				</Fab>
			</DangerTooltip>
		</Fragment>
	)
}

export default RejectActionButton
