import { IconButton, InputAdornment, TextField } from "@mui/material"
import useDebounceSearch from "hooks/useDebounceSearch"
import React from "react"
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"

const HomeRoomsNumberFilter = () => {
	const { t } = useTranslation()
	const [homeRoomsNumber, setHomeRoomsNumber] = useDebounceSearch(
		"room",
		"",
		300
	)

	return (
		<NumericFormat
			id="rooms"
			name="rooms"
			label={t("common.filter.roomsNumber")}
			value={homeRoomsNumber}
			onInput={(event) => setHomeRoomsNumber(event.target?.value)}
			color="formColor"
			variant="outlined"
			fullWidth
			customInput={TextField}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end" className="custom-endAdornment">
						{homeRoomsNumber && (
							<IconButton
								onClick={() => setHomeRoomsNumber("")}
								variant="onlyIcon"
							>
								<i className="bi bi-x end-adornment-close-button" />
							</IconButton>
						)}
					</InputAdornment>
				)
			}}
			sx={{
				marginTop: "0.25rem",
				marginBottom: "0.25rem"
			}}
			allowNegative={false}
			decimalScale={0}
		/>
	)
}

export default HomeRoomsNumberFilter
