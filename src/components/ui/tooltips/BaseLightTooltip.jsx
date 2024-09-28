import React from "react"
import { styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import { colors } from "shared/colors"
import { Zoom } from "@mui/material"

const BaseLightTooltip = styled(({ className = "", ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} TransitionComponent={Zoom} />
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: colors.baseColorLight,
		color: theme.palette.common.white,
		boxShadow: theme.shadows[1],
		fontSize: 11
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: colors.baseColorLight
	}
}))

export default BaseLightTooltip