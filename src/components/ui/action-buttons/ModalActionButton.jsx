import { Fab } from "@mui/material"
import React, { Fragment } from "react"

const ModalActionButton = ({
	icon = "",
	btnColor = "info",
	setOpen,
	setData,
	data,
	disabled
}) => {
	return (
		<Fragment>
			<Fab
				color={btnColor}
				variant="action"
				aria-label="modal-action"
				onClick={() => {
					setOpen(true)
					setData(data)
				}}
				disabled={disabled || false}
			>
				<i className={icon} />
			</Fab>
		</Fragment>
	)
}

export default ModalActionButton
