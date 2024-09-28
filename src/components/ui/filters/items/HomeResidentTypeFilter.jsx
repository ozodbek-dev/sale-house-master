import {
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select
} from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { residentTypeSelectOptions } from "shared/selectOptionsList"

const HomeResidentTypeFilter = () => {
	const { t } = useTranslation()
	const [homeResidentType, setHomeResidentType] = useState("")
	const [searchParams, setSearchParams] = useSearchParams()

	const handleChange = (value) => {
		searchParams.set("islive", value)
		let localSearchParams = Object.fromEntries([...searchParams])
		if (!isNaN(localSearchParams.page)) {
			searchParams.set("page", 1)
		}
		setSearchParams(searchParams)
		setHomeResidentType(value)
	}

	const handleClearSelectBox = () => {
		setHomeResidentType("")
		searchParams.delete("islive")
		setSearchParams(searchParams)
	}

	return (
		<FormControl
			fullWidth
			color="formColor"
			sx={{
				marginTop: "0.25rem",
				marginBottom: "0.25rem"
			}}
		>
			<InputLabel id="resident-type-filter-label">
				{t("common.filter.residentType")}
			</InputLabel>
			<Select
				labelId="resident-type-filter-label"
				id="resident-type-filter-select"
				label={t("common.filter.residentType")}
				value={homeResidentType}
				onChange={(event) => handleChange(event.target.value)}
				color="formColor"
				variant="outlined"
				role="presentation"
				MenuProps={{
					id: "resident-type-filter-select-menu",
					disableScrollLock: true,
					PaperProps: {
						style: {
							maxHeight: 300
						}
					}
				}}
				endAdornment={
					<InputAdornment position="end" className="custom-endAdornment">
						{homeResidentType && (
							<IconButton
								onClick={() => handleClearSelectBox("")}
								variant="onlyIcon"
								className="select-box-end-adornment-button"
							>
								<i className="bi bi-x end-adornment-close-button" />
							</IconButton>
						)}
					</InputAdornment>
				}
			>
				{residentTypeSelectOptions.map((item, index) => (
					<MenuItem value={item.code} key={`resident-type-${item.code}`}>
						{t(item.label)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default HomeResidentTypeFilter
