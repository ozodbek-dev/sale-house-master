import React from "react"
import { styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import { Zoom } from "@mui/material"
import { colors } from "shared/colors"

const WarningTooltip = styled(({ className = "", ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} TransitionComponent={Zoom} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: colors.warningColor,
		color: theme.palette.common.white,
		boxShadow: theme.shadows[1],
		fontSize: 11
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: colors.warningColor
	}
}))

export default WarningTooltip