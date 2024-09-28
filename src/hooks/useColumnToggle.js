import { useEffect } from "react"
import useLocalStorage from "./useLocalStorage"
import i18n from "../config/i18n"

const useColumnToggle = (
	tableName,
	tableHeadCells = [],
	tableColumnCells = []
) => {
	const [value, setValue] = useLocalStorage("table", {})

	useEffect(() => {
		if (
			tableName &&
			!value[tableName] &&
			tableHeadCells &&
			tableHeadCells.length > 0
		) {
			let newValue = { ...value, [tableName]: tableHeadCells }
			setValue(newValue)
		} else {
			if (
				JSON.stringify(getTableOriginData(tableHeadCells)) !==
				JSON.stringify(getTableOriginData(value[tableName]))
			) {
				value[tableName] = tableHeadCells
				setValue(value)
			}
		}
		/* i18n.on("languageChanged", (lng) => {
			if (
				tableName &&
				!value[tableName] &&
				tableHeadCells &&
				tableHeadCells.length > 0
			) {
				let newValue = { ...value, [tableName]: tableHeadCells }
				setValue(newValue)
			} else {
				if (
					JSON.stringify(getTableOriginData(tableHeadCells)) !==
					JSON.stringify(getTableOriginData(value[tableName]))
				) {
					value[tableName] = tableHeadCells
					setValue(value)
				}
			}
		}) */
	}, [i18n.language])

	const getTableOriginData = (data) => {
		if (data) {
			return data.map((item) => ({ code: item?.code, label: item?.label }))
		}
		return []
	}

	const setTableColumnValues = (values) => {
		setValue({ ...value, [tableName]: values })
	}

	const getTableColumnCells = () => {
		if (value[tableName]) {
			let columns = []
			value[tableName].forEach((row, index) => {
				if (row.isActive) {
					columns.push(tableColumnCells[index])
				}
			})
			return columns
		}
		return []
	}

	const getTableHeadCells = () => {
		if (value[tableName]) {
			return value[tableName].filter((column) => column.isActive)
		}
		return []
	}

	return {
		tableData: value[tableName],
		tableHeadCells: getTableHeadCells(),
		tableColumnCells: getTableColumnCells(),
		setTableHeadCells: setTableColumnValues
	}
}

export default useColumnToggle
