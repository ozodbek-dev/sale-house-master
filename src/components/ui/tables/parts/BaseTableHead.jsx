import { TableCell, TableHead, TableRow } from "@mui/material"
import React, { Fragment } from "react"
import { useTranslation } from "react-i18next"

const BaseTableHead = (props) => {
	const { headCells } = props
	const { t } = useTranslation()

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell, headCellIndex) => (
					<Fragment key={"head-cell-" + headCell.code}>
						<TableCell
							align={headCell?.numeric ? "right" : "left"}
							padding={headCell?.disablePadding ? "none" : "normal"}
						>
							<div dangerouslySetInnerHTML={{ __html: headCell.label }} />
						</TableCell>
					</Fragment>
				))}
				<TableCell padding="normal" align="right">
					{t("common.table.actions")}
				</TableCell>
			</TableRow>
		</TableHead>
	)
}

export default BaseTableHead
