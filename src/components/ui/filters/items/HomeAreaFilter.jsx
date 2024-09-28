import { IconButton, InputAdornment, TextField } from "@mui/material"
import useDebounceSearch from "hooks/useDebounceSearch"
import React from "react"
import { Trans } from "react-i18next"
import { NumericFormat } from "react-number-format"

const HomeAreaFilter = () => {
	const [homeSquareFrom, setHomeSquareFrom] = useDebounceSearch("from", "", 300)
	const [homeSquareTill, setHomeSquareTill] = useDebounceSearch("till", "", 300)

	return (
		<div className="flex flex-row">
			<NumericFormat
				id="from"
				name="from"
				label={
					<span>
						<Trans i18nKey="common.filter.area.from">
							Xona maydoni(m<sup>2</sup> dan)
						</Trans>
					</span>
				}
				value={homeSquareFrom}
				onInput={(event) => setHomeSquareFrom(event.target?.value)}
				color="formColor"
				variant="outlined"
				fullWidth
				customInput={TextField}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end" className="custom-endAdornment">
							{homeSquareFrom && (
								<IconButton
									onClick={() => setHomeSquareFrom("")}
									variant="onlyIcon"
								>
									<i className="bi bi-x end-adornment-close-button" />
								</IconButton>
							)}
						</InputAdornment>
					),
					sx: {
						borderTopRightRadius: "0 !important",
						borderBottomRightRadius: "0 !important"
					}
				}}
				sx={{
					marginTop: "0.25rem",
					marginBottom: "0.25rem"
				}}
				allowNegative={false}
				decimalScale={0}
			/>

			<NumericFormat
				id="till"
				name="till"
				label={
					<span>
						<Trans i18nKey="common.filter.area.till">
							Xona maydoni(m<sup>2</sup> gacha)
						</Trans>
					</span>
				}
				value={homeSquareTill}
				onInput={(event) => setHomeSquareTill(event.target?.value)}
				color="formColor"
				variant="outlined"
				fullWidth
				customInput={TextField}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end" className="custom-endAdornment">
							{homeSquareTill && (
								<IconButton
									onClick={() => setHomeSquareTill("")}
									variant="onlyIcon"
								>
									<i className="bi bi-x end-adornment-close-button" />
								</IconButton>
							)}
						</InputAdornment>
					),
					sx: {
						borderTopLeftRadius: "0 !important",
						borderBottomLeftRadius: "0 !important"
					}
				}}
				sx={{
					marginTop: "0.25rem",
					marginBottom: "0.25rem"
				}}
				allowNegative={false}
				decimalScale={0}
			/>
		</div>
	)
}

export default HomeAreaFilter
