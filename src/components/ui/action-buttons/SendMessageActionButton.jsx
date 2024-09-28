import { Fab } from "@mui/material"
import React, { Fragment } from "react"
import InfoTooltip from "../tooltips/InfoTooltip"

const SendMessageActionButton = ({
	id,
	setItemId,
	setOpen,
	hasTooltip = false,
	tooltipProps = {}
}) => {
	return (
		<Fragment>
			<InfoTooltip
				disableHoverListener={!hasTooltip}
				arrow={true}
				placement="top"
				{...tooltipProps}
			>
				<Fab
					color="info"
					variant="action"
					aria-label="send-message-modal"
					onClick={() => {
						setOpen(true)
						setItemId(id)
					}}
				>
					<i className="bi bi-chat-left-text" />
				</Fab>
			</InfoTooltip>
		</Fragment>
	)
}

export default SendMessageActionButton
