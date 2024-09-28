import * as React from "react"
import Slider from "@mui/material/Slider"
import { styled } from "@mui/material/styles"
import { colors } from "shared/colors"
import { NumericFormat } from "react-number-format"

const PrettoSlider = styled(Slider)({
	color: colors.baseColor,
	height: 3,
	"& .MuiSlider-track": {
		border: "none"
	},
	"& .MuiSlider-thumb": {
		height: 20,
		width: 20,
		backgroundColor: "#fff",
		border: "2px solid currentColor",
		"&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
			boxShadow: "inherit"
		},
		"&:before": {
			display: "none"
		}
	},
	"& .MuiSlider-valueLabel": {
		fontSize: 12,
		backgroundColor: colors.baseColorLight,
		borderRadius: "4px",
		lineHeight: 1.2,
		paddingRight: "4px",
		paddingLeft: "4px"
	},
	"& .MuiSlider-mark": {
		backgroundColor: colors.base1,
		height: 16,
		width: 2,
		"&.MuiSlider-markActive": {
			opacity: 1,
			backgroundColor: "currentColor"
		}
	}
})

export default function CustomSlider({
	value,
	handleChange,
	label = "",
	marks = [],
	min,
	max,
	customFormat = false,
	suffix,
	allowNegative = false
}) {
	return (
		<React.Fragment>
			<div className="text-center">{label}</div>
			<PrettoSlider
				getAriaLabel={() => "Minimum distance shift"}
				min={min}
				max={max}
				valueLabelDisplay="on"
				marks={marks}
				step={null}
				value={value}
				onChange={handleChange}
				disableSwap
				getAriaValueText={(value) =>
					customFormat ? (
						<span>
							{value}
							{suffix}
						</span>
					) : (
						<NumericFormat
							value={value}
							displayType={"text"}
							allowNegative={allowNegative}
							thousandSeparator={" "}
							decimalScale={3}
							className="bg-transparent whitespace-nowrap tracking-tighter"
							suffix={suffix}
						/>
					)
				}
				valueLabelFormat={(value) =>
					customFormat ? (
						<span>
							{value}
							{suffix}
						</span>
					) : (
						<NumericFormat
							value={value}
							displayType={"text"}
							allowNegative={allowNegative}
							thousandSeparator={" "}
							decimalScale={3}
							className="bg-transparent whitespace-nowrap tracking-tighter"
							suffix={suffix}
						/>
					)
				}
			/>
		</React.Fragment>
	)
}
