import React from "react"
import { NumericFormat } from "react-number-format"

const CurrencyFormat = ({
	value,
	allowNegative = false,
	suffix = " UZS",
	className = "",
	decimalScale = 3
}) => {
	if (!isNaN(value)) {
		return (
			<NumericFormat
				value={value}
				displayType={"text"}
				allowNegative={allowNegative}
				thousandSeparator={" "}
				decimalScale={decimalScale}
				className={`bg-transparent currency-format${
					className ? ` ${className}` : ""
				}`}
				suffix={suffix}
			/>
		)
	} else {
		return ""
	}
}

export default CurrencyFormat
