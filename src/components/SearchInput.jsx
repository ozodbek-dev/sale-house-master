import { IconButton, InputAdornment, TextField } from "@mui/material"
import useDebounceSearch from "hooks/useDebounceSearch"
import React from "react"
import { useTranslation } from "react-i18next"

const SearchInput = ({ inputKey }) => {
	const { t } = useTranslation()
	const [searchName, setSearchName] = useDebounceSearch(inputKey, "", 300)

	return (
		<TextField
			color="primary"
			variant="outlined"
			fullWidth
			id="search"
			name="search"
			label={t("common.global.search")}
			autoComplete="off"
			className="max-w-[250px]"
			value={searchName}
			onInput={(event) => setSearchName(event.target?.value)}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end" className="custom-endAdornment">
						{searchName ? (
							<IconButton onClick={() => setSearchName("")} variant="onlyIcon">
								<i className="bi bi-x end-adornment-close-button" />
							</IconButton>
						) : (
							<IconButton variant="onlyIcon" disabled disableRipple>
								<i className="bi bi-search text-base leading-4" />
							</IconButton>
						)}
					</InputAdornment>
				)
			}}
			sx={{
				"& .MuiOutlinedInput-root.Mui-focused i": {
					color: "var(--base-color)"
				},
				"& .MuiOutlinedInput-root i": {
					color: "#9ca3af"
				}
			}}
		/>
	)
}

export default SearchInput
