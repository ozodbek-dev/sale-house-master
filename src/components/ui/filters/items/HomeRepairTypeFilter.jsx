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
import { repairTypeSelectOptions } from "shared/selectOptionsList"

const HomeRepairTypeFilter = () => {
	const { t } = useTranslation()
	const [homeRepairType, setHomeRepairType] = useState("")
	const [searchParams, setSearchParams] = useSearchParams()

	const handleChange = (value) => {
		searchParams.set("repaired", value)
		let localSearchParams = Object.fromEntries([...searchParams])
		if (!isNaN(localSearchParams.page)) {
			searchParams.set("page", 1)
		}
		setSearchParams(searchParams)
		setHomeRepairType(value)
	}

	const handleClearSelectBox = () => {
		setHomeRepairType("")
		searchParams.delete("repaired")
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
			<InputLabel id="repair-type-filter-label">
				{t("common.filter.repairType")}
			</InputLabel>
			<Select
				labelId="repair-type-filter-label"
				id="repair-type-filter-select"
				label={t("common.filter.repairType")}
				value={homeRepairType}
				onChange={(event) => handleChange(event.target.value)}
				color="formColor"
				variant="outlined"
				role="presentation"
				MenuProps={{
					id: "repair-type-filter-select-menu",
					disableScrollLock: true,
					PaperProps: {
						style: {
							maxHeight: 300
						}
					}
				}}
				endAdornment={
					<InputAdornment position="end" className="custom-endAdornment">
						{homeRepairType && (
							<IconButton
								onClick={() => handleClearSelectBox()}
								variant="onlyIcon"
								className="select-box-end-adornment-button"
							>
								<i className="bi bi-x end-adornment-close-button" />
							</IconButton>
						)}
					</InputAdornment>
				}
			>
				{repairTypeSelectOptions.map((item, index) => (
					<MenuItem value={item.code} key={`repair-type-${item.code}`}>
						{t(item.label)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default HomeRepairTypeFilter
