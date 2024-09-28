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

const SingleBlockFilter = () => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [selectedBlock, setSelectedBlock] = useState("")
	const [searchParams, setSearchParams] = useSearchParams()

	const { data, isLoading, isFetching } = useQuery({
		queryKey: "singleBlockFilterSelect",
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
		searchParams.set(`block`, value)
		let localSearchParams = Object.fromEntries([...searchParams])
		if (!isNaN(localSearchParams.page)) {
			searchParams.set("page", 1)
		}
		setSearchParams(searchParams)
		setSelectedBlock(value)
	}

	const handleClearSelectBox = () => {
		searchParams.delete("block")
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
				) : data && data.length > 0 ? (
					data.map((item, index) => (
						<MenuItem value={item.id} key={`block-${index + 1}`}>
							{item.name}
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

export default SingleBlockFilter
