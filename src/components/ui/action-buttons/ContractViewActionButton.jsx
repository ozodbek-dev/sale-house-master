import { Fab } from "@mui/material"
import React, { Fragment } from "react"
import { NavLink, useLocation } from "react-router-dom"

const ContractViewActionButton = ({ link = "" }) => {
	const location = useLocation()
	return (
		<Fragment>
			<NavLink
				to={link}
				replace={true}
				state={{ from: location }}
				className="no-underline"
			>
				<Fab color="info" variant="action" aria-label="custom-action">
					<i className="bi bi-clipboard-check !text-lg" />
				</Fab>
			</NavLink>
		</Fragment>
	)
}

export default ContractViewActionButton
