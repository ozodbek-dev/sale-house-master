import { IconButton, InputAdornment, TextField } from "@mui/material"
import useDebounceSearch from "hooks/useDebounceSearch"
import React from "react"
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"

const HomeNumberFilter = () => {
	const { t } = useTranslation()
	const [homeNumber, setHomeNumber] = useDebounceSearch("number", "", 300)

	return (
		<NumericFormat
			id="home_id"
			name="home_id"
			label={t("common.filter.number")}
			value={homeNumber}
			onInput={(event) => setHomeNumber(event.target?.value)}
			color="formColor"
			variant="outlined"
			fullWidth
			customInput={TextField}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end" className="custom-endAdornment">
						{homeNumber && (
							<IconButton onClick={() => setHomeNumber("")} variant="onlyIcon">
								<i className="bi bi-x end-adornment-close-button" />
							</IconButton>
						)}
					</InputAdornment>
				)
			}}
			allowNegative={false}
			decimalScale={0}
		/>
	)
}

export default HomeNumberFilter
