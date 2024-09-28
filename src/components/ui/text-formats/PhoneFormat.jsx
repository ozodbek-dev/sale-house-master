import React from "react"
import { PatternFormat } from "react-number-format"

const PhoneFormat = ({ value }) => {
	if (value) {
		return (
			<PatternFormat
				value={value}
				displayType={"text"}
				allownegative="false"
				className="bg-transparent phone-format"
				format="+998 ## ###-##-##"
			/>
		)
	} else {
		return ""
	}
}

export default PhoneFormat
