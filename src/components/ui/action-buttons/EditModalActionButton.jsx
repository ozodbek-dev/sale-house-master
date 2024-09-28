import { Fab } from "@mui/material"
import React, { Fragment } from "react"

const EditModalActionButton = ({ id, setItemId, setOpen }) => {
	return (
		<Fragment>
			<Fab
				color="warning"
				variant="action"
				aria-label="edit-modal"
				onClick={() => {
					setOpen(true)
					setItemId(id)
				}}
			>
				<i className="bi bi-pencil-square" />
			</Fab>
		</Fragment>
	)
}

export default EditModalActionButton
