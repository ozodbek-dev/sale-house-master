import {
	FormControl,
	IconButton,
	InputAdornment,
	MenuItem,
	Select
} from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

const DataTableSelectBox = ({
	options = [],
	setSelectedValue = () => {},
	type = ""
}) => {
	const { t } = useTranslation()
	const [value, setValue] = useState("")

	return (
		<FormControl fullWidth color="formColor" sx={{ minWidth: "200px" }}>
			<Select
				labelId="excel-data-filter-label"
				id="excel-data-filter-select"
				value={value}
				onChange={(event) => {
					options.forEach((item) => {
						if (event.target.value && item.code === value) {
							item.disabled = false
						}
					})
					setValue(event.target.value)
					setSelectedValue(event.target.value, type)
				}}
				color="formColor"
				variant="outlined"
				role="presentation"
				MenuProps={{
					id: "excel-data-filter-select-menu",
					disableScrollLock: true,
					PaperProps: {
						style: {
							maxHeight: 300
						}
					}
				}}
				endAdornment={
					<InputAdornment position="end" className="custom-endAdornment">
						{value && (
							<IconButton
								onClick={() => {
									setSelectedValue(value, type)
									setValue("")
								}}
								variant="onlyIcon"
								className="select-box-end-adornment-button"
							>
								<i className="bi bi-x end-adornment-close-button" />
							</IconButton>
						)}
					</InputAdornment>
				}
			>
				{options.map((item) => (
					<MenuItem value={item.code} key={item.code} disabled={item.disabled}>
						<div dangerouslySetInnerHTML={{ __html: t(item.label) }}></div>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default DataTableSelectBox
