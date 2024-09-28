import { FormControl, InputAdornment, MenuItem, Select } from "@mui/material"
import useAuth from "hooks/useAuth"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import ROLE_TYPE_LIST from "shared/roleTypeList"

const ShaxmatkaModeSelect = ({ value = "VIEW", setValue = () => {} }) => {
	const [{ user }] = useAuth()
	const { t } = useTranslation()
	const [readonlySelect, setReadonlySelect] = useState(false)
	const [disabledSelect, setDisabledSelect] = useState(false)

	useEffect(() => {
		if (user && user?.user?.role === ROLE_TYPE_LIST.MANAGER.code) {
			setReadonlySelect(true)
			setDisabledSelect(true)
		}
	}, [])

	const options = [
		{
			label: t("shaxmatka.mode.view"),
			code: "VIEW"
		},
		{
			label: t("shaxmatka.mode.edit"),
			code: "EDIT"
		}
	]

	return (
		<FormControl
			fullWidth
			color="formColor"
			sx={{ width: "200px", marginRight: 2, marginTop: 0, marginBottom: 0 }}
		>
			<Select
				className="shaxmatka-select-mode"
				labelId="select-mode-label"
				id="select-mode-select"
				onChange={(event) => setValue(event.target.value)}
				value={value}
				color="formColor"
				variant="outlined"
				readOnly={readonlySelect}
				disabled={disabledSelect}
				role="presentation"
				MenuProps={{
					id: "select-mode-select-menu",
					disableScrollLock: true,
					PaperProps: {
						style: {
							maxHeight: 300
						}
					}
				}}
				startAdornment={
					<InputAdornment position="start">
						{value === "VIEW" ? (
							<i
								className={`bi bi-eye adornment-icon view-icon${
									readonlySelect || disabledSelect ? " is-view-only" : ""
								}`}
							/>
						) : (
							<i className="bi bi-pencil-square adornment-icon edit-icon" />
						)}
					</InputAdornment>
				}
			>
				{options.map((item, index) => (
					<MenuItem value={item.code} key={`mode-select-${index + 1}`}>
						{item.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}

export default ShaxmatkaModeSelect
