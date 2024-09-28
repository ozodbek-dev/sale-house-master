import {
	Box,
	Chip,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { homeTypeSelectOptions } from "shared/selectOptionsList"

const HomeStatusFilter = () => {
	const { t } = useTranslation()
	const [selectedStatuses, setSelectedStatuses] = useState([])
	const [searchParams, setSearchParams] = useSearchParams()

	useEffect(() => {
		let entries = Object.fromEntries(searchParams)
		let blockItems = Object.keys(entries)
			.filter((item) => item.includes("status"))
			.map((item) => entries[item])
		if (blockItems.length > 0) {
			setSelectedStatuses(blockItems)
		}
	}, [])

	const handleChange = (event) => {
		const {
			target: { value }
		} = event
		clearAll()
		if (value.length > 0) {
			value.forEach((item, index) => searchParams.set(`status[${index}]`, item))
		}
		let localSearchParams = Object.fromEntries([...searchParams])
		if (!isNaN(localSearchParams.page)) {
			searchParams.set("page", 1)
		}
		setSearchParams(searchParams)
		setSelectedStatuses(value)
	}

	const handleDeleteItem = (value) => {
		let leftSelectedBlocks = selectedStatuses.filter((item) => item !== value)
		clearAll()
		leftSelectedBlocks.forEach((item, index) =>
			searchParams.set(`status[${index}]`, item)
		)
		setSearchParams(searchParams)
		setSelectedStatuses(leftSelectedBlocks)
	}

	const clearAll = () => {
		let entries = Object.fromEntries(searchParams)
		Object.keys(entries).forEach((item) => {
			if (item.includes("status")) searchParams.delete(item)
		})
	}

	const getChipNameByCode = (code) => {
		return homeTypeSelectOptions.filter((item) => item.code === code)[0].label
	}

	const handleClearSelectBox = () => {
		clearAll()
		setSelectedStatuses([])
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
			<InputLabel id="status-filter-label">
				{t("common.filter.status")}
			</InputLabel>
			<Select
				labelId="status-filter-label"
				id="status-filter-multiple-chip"
				multiple
				value={selectedStatuses}
				onChange={handleChange}
				input={
					<OutlinedInput
						id="status-filter-select-multiple-chip"
						variant="filterField"
						label={t("common.filter.status")}
					/>
				}
				renderValue={(selected) => (
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
						{selected.map((value) => (
							<Chip
								key={`status-${value}`}
								label={t(getChipNameByCode(value))}
								variant="tableBadge"
								color="primary"
								onMouseDown={(event) => {
									event.stopPropagation()
								}}
								onDelete={() => handleDeleteItem(value)}
							/>
						))}
					</Box>
				)}
				color="formColor"
				variant="outlined"
				MenuProps={{
					id: "status-filter-select-menu",
					PaperProps: {
						style: {
							maxHeight: 300
						}
					},
					disableScrollLock: true
				}}
				endAdornment={
					<InputAdornment position="end" className="custom-endAdornment">
						<IconButton
							onClick={() => handleClearSelectBox()}
							size="small"
							variant="onlyIcon"
							sx={{
								display: selectedStatuses.length > 0 ? "" : "none"
							}}
							className="select-box-end-adornment-button"
						>
							<i className="bi bi-x end-adornment-close-button" />
						</IconButton>
					</InputAdornment>
				}
			>
				{homeTypeSelectOptions.map((item, index) => (
					<MenuItem value={item.code} key={`status-${item.code}`}>
						{t(item.label)}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default HomeStatusFilter
