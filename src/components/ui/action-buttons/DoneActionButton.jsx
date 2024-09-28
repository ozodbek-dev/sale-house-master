import { CircularProgress, Fab } from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { Fragment, useState } from "react"
import SuccessTooltip from "../tooltips/SuccessTooltip"

const DoneActionButton = ({
	link = "",
	successMsg = "",
	setRefetch = () => {},
	hasTooltip = false,
	tooltipProps = {}
}) => {
	const axiosPrivate = useAxiosPrivate()
	const sendNotification = useNotification()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleDone = async () => {
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
			<SuccessTooltip
				disableHoverListener={!hasTooltip}
				arrow={true}
				placement="top"
				{...tooltipProps}
			>
				<Fab
					color="success"
					variant="action"
					aria-label="add"
					onClick={() => handleDone()}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<CircularProgress size={15} color="inherit" />
					) : (
						<i className="bi bi-check-lg" />
					)}
				</Fab>
			</SuccessTooltip>
		</Fragment>
	)
}

export default DoneActionButton
