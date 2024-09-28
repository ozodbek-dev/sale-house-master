import React from "react"
import { styled } from "@mui/material/styles"
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip"
import { colors } from "shared/colors"
import { Zoom } from "@mui/material"

const BaseTooltipCustomWidth = styled(({ className = "", ...props }) => (
	<Tooltip {...props} classes={{ popper: className }} TransitionComponent={Zoom} />
))(({ theme, width, fontSize }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: colors.baseColor,
		color: theme.palette.common.white,
		boxShadow: theme.shadows[1],
		fontSize: fontSize || 11,
		maxWidth: width || "inherit",
	},
	[`& .${tooltipClasses.arrow}`]: {
		color: colors.baseColor
	}
}))

export default BaseTooltipCustomWidth