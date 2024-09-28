import { Fab } from "@mui/material"
import React, { Fragment } from "react"
import { NavLink, useLocation } from "react-router-dom"

const ListActionButton = ({ link = "" }) => {
	const location = useLocation()
	return (
		<Fragment>
			<NavLink to={location.pathname + link} className="no-underline">
				<Fab color="info" variant="action" aria-label="list">
					<i className="bi bi-journal-text" />
				</Fab>
			</NavLink>
		</Fragment>
	)
}

export default ListActionButton
