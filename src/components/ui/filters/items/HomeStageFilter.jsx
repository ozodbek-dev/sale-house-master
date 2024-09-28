import { IconButton, InputAdornment, TextField } from "@mui/material"
import useDebounceSearch from "hooks/useDebounceSearch"
import React from "react"
import { useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"

const HomeStageFilter = () => {
	const { t } = useTranslation()
	const [homeStage, setHomeStage] = useDebounceSearch("stage", "", 300)

	return (
		<NumericFormat
			id="stage"
			name="stage"
			label={t("common.filter.homeStage")}
			value={homeStage}
			onInput={(event) => setHomeStage(event.target?.value)}
			color="formColor"
			variant="outlined"
			fullWidth
			customInput={TextField}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end" className="custom-endAdornment">
						{homeStage && (
							<IconButton onClick={() => setHomeStage("")} variant="onlyIcon">
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

export default HomeStageFilter
