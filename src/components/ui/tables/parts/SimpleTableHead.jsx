import { TableCell, TableHead, TableRow } from "@mui/material"
import React, { Fragment } from "react"

const SimpleTableHead = (props) => {
	const { headCells } = props

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell, headCellIndex) => (
					<Fragment key={"head-cell-" + headCell.code}>
						<TableCell
							align={headCell.numeric ? "right" : "left"}
							padding={headCell.disablePadding ? "none" : "normal"}
						>
							<div dangerouslySetInnerHTML={{ __html: headCell.label }} />
						</TableCell>
					</Fragment>
				))}
			</TableRow>
		</TableHead>
	)
}

export default SimpleTableHead
