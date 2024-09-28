import {
	CircularProgress,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select
} from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { useSearchParams } from "react-router-dom"

const HomeBlocksFilter = () => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const [selectedBlock, setSelectedBlock] = useState("")

	const {
		data: blocks,
		isLoading,
		isFetching
	} = useQuery({
		queryKey: "blocksFilterSelect",
		queryFn: async function () {
			const response = await axiosPrivate.get("/dictionary/blocks2")
			return response.data.data
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
		searchParams.set("block_id", value)
		let localSearchParams = Object.fromEntries([...searchParams])
		if (!isNaN(localSearchParams.page)) {
			searchParams.set("page", 1)
		}
		setSelectedBlock(value)
		setSearchParams(searchParams)
	}

	const handleClearSelectBox = () => {
		searchParams.delete("block_id")
		setSelectedBlock("")
		setSearchParams(searchParams)
	}

	return (
		<FormControl fullWidth color="formColor">
			<InputLabel id="single-block-filter-label">
				{t("common.filter.block")}
			</InputLabel>
			<Select
				labelId="single-block-filter-label"
				id="single-block-filter-chip"
				label={t("common.filter.block")}
				value={selectedBlock}
				onChange={handleChange}
				color="formColor"
				variant="outlined"
				MenuProps={{
					id: "single-block-filter-select-menu",
					PaperProps: {
						style: {
							maxHeight: 300
						}
					},
					disableScrollLock: true
				}}
				endAdornment={
					<InputAdornment position="end" className="custom-endAdornment">
						{selectedBlock && (
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

export default HomeBlocksFilter
