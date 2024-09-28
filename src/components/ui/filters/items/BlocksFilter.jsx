import {
	Box,
	Chip,
	CircularProgress,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select
} from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { useSearchParams } from "react-router-dom"

const BlocksFilter = () => {
	const axiosPrivate = useAxiosPrivate()
	const { t } = useTranslation()
	const [hasError, setHasError] = useState(false)
	const [selectedBlocks, setSelectedBlocks] = useState([])
	const [blocks, setBlocks] = useState([])
	const [searchParams, setSearchParams] = useSearchParams()

	const { isLoading, isFetching } = useQuery({
		queryKey: "blocksFilterSelect",
		queryFn: async function () {
			const response = await axiosPrivate.get("/dictionary/blocks2")
			return response.data.data
		},
		onSuccess: (data) => {
			setBlocks(data)
			handleClearSelectBox()
		},
		enabled: !hasError,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	const handleChange = (event) => {
		const {
			target: { value }
		} = event
		searchParams.set(`block[${selectedBlocks.length}]`, value[value.length - 1])
		setSearchParams(searchParams)
		setSelectedBlocks(value)
	}

	const handleDeleteItem = (value) => {
		let leftSelectedBlocks = selectedBlocks.filter((item) => item !== value)
		clearAll()
		leftSelectedBlocks.forEach((item, index) =>
			searchParams.set(`block[${index}]`, item)
		)
		setSearchParams(searchParams)
		setSelectedBlocks(leftSelectedBlocks)
	}

	const clearAll = () => {
		let entries = Object.fromEntries(searchParams)
		Object.keys(entries).forEach((item) => {
			if (item.includes("block")) searchParams.delete(item)
		})
	}

	const getChipNameById = (id) => {
		let foundBlock = blocks.filter((item) => item.id === id)[0]
		return `${foundBlock?.objects?.name} | ${foundBlock.name}`
	}

	const handleClearSelectBox = () => {
		clearAll()
		setSelectedBlocks([])
		setSearchParams(searchParams)
	}

	return (
		<FormControl fullWidth color="formColor">
			<InputLabel id="blocks-filter-label">
				{t("common.filter.blocks")}
			</InputLabel>
			<Select
				labelId="blocks-filter-label"
				id="blocks-filter-multiple-chip"
				multiple
				value={selectedBlocks}
				onChange={handleChange}
				input={
					<OutlinedInput
						id="blocks-filter-select-multiple-chip"
						variant="filterField"
						label={t("common.filter.blocks")}
					/>
				}
				renderValue={(selected) => (
					<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
						{selected.map((value) => (
							<Chip
								key={`block-${value}`}
								label={getChipNameById(value)}
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
					id: "blocks-filter-select-menu",
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
								display: selectedBlocks.length > 0 ? "" : "none"
							}}
							className="select-box-end-adornment-button"
						>
							<i className="bi bi-x end-adornment-close-button" />
						</IconButton>
					</InputAdornment>
				}
			>
				{isLoading || isFetching ? (
					<div className="circular-progress-box">
						<CircularProgress size={25} />
					</div>
				) : blocks && blocks.length > 0 ? (
					blocks.map((item, index) => (
						<MenuItem value={item.id} key={`block-${index + 1}`}>
							{item?.objects?.name} | {item.name}
						</MenuItem>
					))
				) : (
					<div>
						<span className="no-data-found-wrapper select-box">
							<i className="bi bi-exclamation-octagon text-lg mr-1" />{" "}
							{t("common.global.noDataFound")}
						</span>
					</div>
				)}
			</Select>
		</FormControl>
	)
}

export default BlocksFilter
