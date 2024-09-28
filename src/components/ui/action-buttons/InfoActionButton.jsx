import { Fab } from "@mui/material"
import React, { Fragment } from "react"
import { NavLink, useLocation } from "react-router-dom"

const InfoActionButton = ({ link = "" }) => {
	const location = useLocation()
	return (
		<Fragment>
			<NavLink to={location.pathname + link} className="no-underline">
				<Fab color="info" variant="action" aria-label="info">
					<i className="bi bi-info-lg !text-lg" />
				</Fab>
			</NavLink>
		</Fragment>
	)
}

export default InfoActionButton
