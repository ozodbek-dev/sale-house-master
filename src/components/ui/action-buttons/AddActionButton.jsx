import { Fab } from "@mui/material"
import React, { Fragment } from "react"
import { NavLink, useLocation } from "react-router-dom"

const AddActionButton = ({ link = "" }) => {
	const location = useLocation()
	return (
		<Fragment>
			<NavLink to={location.pathname + link} className="no-underline">
				<Fab color="success" variant="action" aria-label="add">
					<i className="bi bi-plus-lg" />
				</Fab>
			</NavLink>
		</Fragment>
	)
}

export default AddActionButton
