import { Drawer, FormControlLabel, Switch } from "@mui/material"
import React from "react"

const TableColumnToggleDrawer = ({
	open,
	setOpen,
	tableData,
	setTableHeadCells
}) => {
	const handleChange = (event, code) => {
		let foundItem = tableData.find((item) => item.code === code)
		if (foundItem) {
			foundItem.isActive = event.target.checked
		}
		setTableHeadCells(tableData)
	}

	return (
		<Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
			<div className="table-column-drawer-wrapper">
				{tableData &&
					tableData.map((column) => (
						<FormControlLabel
							key={column.code}
							value={column.code}
							control={
								<Switch
									color="secondary"
									checked={column.isActive}
									onChange={(event) => handleChange(event, column.code)}
								/>
							}
							labelPlacement="start"
							label={<div dangerouslySetInnerHTML={{ __html: column.label }} />}
							className="table-column-drawer-item"
						/>
					))}
			</div>
		</Drawer>
	)
}

export default TableColumnToggleDrawer
