import React from "react"
import { styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import { Zoom } from "@mui/material"
import { colors } from "shared/colors"

const DangerTooltip = styled(({ className = "", ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} TransitionComponent={Zoom} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: colors.errorColor,
		color: theme.palette.common.white,
		boxShadow: theme.shadows[1],
		fontSize: 11
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: colors.errorColor
	}
}))

export default DangerTooltip