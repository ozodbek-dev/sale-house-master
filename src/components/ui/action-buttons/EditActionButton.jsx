import { Fab } from "@mui/material"
import React, { Fragment } from "react"
import { NavLink, useLocation } from "react-router-dom"

const EditActionButton = ({ link = "" }) => {
	const location = useLocation()

	return (
		<Fragment>
			<NavLink to={location.pathname + link} className="no-underline">
				<Fab color="warning" variant="action" aria-label="edit">
					<i className="bi bi-pencil-square" />
				</Fab>
			</NavLink>
		</Fragment>
	)
}

export default EditActionButton
