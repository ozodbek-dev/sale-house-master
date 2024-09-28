import {
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material"
import { Fragment } from "react"
import { Trans, useTranslation } from "react-i18next"
import {
	homeTypeVariants,
	repairTypeVariants,
	residentTypeVariants
} from "shared/tableColVariantsList"
import setTableCellType from "utils/setTableCellType"

const ShaxmatkaBlocksTable = ({
	isLoading = false,
	isError = false,
	blocks = [],
	toggleSelectionItem = () => {}
}) => {
	const { t } = useTranslation()
	return (
		<TableContainer className="sheet-table-wrapper">
			<Table
				stickyHeader
				sx={{ minWidth: 750, height: "max-content" }}
				aria-labelledby="tableTitle"
				className="sheet-table"
			>
				<TableHead className="sheet-table-head">
					<TableRow>
						<TableCell
							className="sheet-table-head-cell"
							key="head-cell-index-number"
						>
							№
						</TableCell>
						<TableCell className="sheet-table-head-cell" key="head-cell-number">
							{t("shaxmatka.table.number")}
						</TableCell>
						<TableCell className="sheet-table-head-cell" key="head-cell-rooms">
							{t("shaxmatka.table.rooms")}
						</TableCell>
						<TableCell className="sheet-table-head-cell" key="head-cell-square">
							{t("shaxmatka.table.square")}
						</TableCell>
						<TableCell className="sheet-table-head-cell" key="head-cell-stage">
							{t("shaxmatka.table.stage")}
						</TableCell>
						<TableCell
							className="sheet-table-head-cell"
							key="head-cell-repaired"
						>
							<Trans i18nKey="shaxmatka.table.repaired">
								1 m<sup>2</sup> ta'mirli narxi
							</Trans>
						</TableCell>
						<TableCell
							className="sheet-table-head-cell"
							key="head-cell-norepaired"
						>
							<Trans i18nKey="shaxmatka.table.norepaired">
								1 m<sup>2</sup> ta'mirsiz narxi
							</Trans>
						</TableCell>
						<TableCell
							className="sheet-table-head-cell"
							key="head-cell-isrepaired"
						>
							{t("shaxmatka.table.isrepaired")}
						</TableCell>
						<TableCell className="sheet-table-head-cell" key="head-cell-islive">
							{t("shaxmatka.table.islive")}
						</TableCell>
						<TableCell className="sheet-table-head-cell" key="head-cell-status">
							{t("shaxmatka.table.status")}
						</TableCell>
					</TableRow>
				</TableHead>
				{isLoading ? (
					<TableBody className="overflow-hidden">
						<TableRow>
							<TableCell colSpan={10}>
								<LinearProgress />
							</TableCell>
						</TableRow>
					</TableBody>
				) : isError ? (
					<TableBody className="overflow-hidden">
						<TableRow>
							<TableCell colSpan={10}>
								<div className="flex flex-col items-center">
									{t("shaxmatka.table.error")}
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				) : blocks && blocks.length > 0 ? (
					<Fragment>
						<TableBody className="sheet-table-body">
							{blocks.map(
								(block, index) =>
									block?.homes &&
									block?.homes.map((row, rowIndex) => (
										<TableRow
											hover
											tabIndex={-1}
											key={"row-" + rowIndex}
											className={`sheet-table-row block-${index}-home home-item status-${
												row.status
											}${row.disabled ? " is-disabled" : ""}`}
											id={`home-${row.id}`}
											onClick={() => toggleSelectionItem(row.id, index)}
										>
											<TableCell className="sheet-table-body-cell">
												{rowIndex + 1}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.number || "—"}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.rooms || "—"}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.square
													? setTableCellType({ type: "area" }, row.square, row)
													: "—"}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.stage}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.repaired
													? setTableCellType(
															{ type: "priceCurrency" },
															row.repaired,
															row
													  )
													: "—"}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.norepaired
													? setTableCellType(
															{ type: "priceCurrency" },
															row.norepaired,
															row
													  )
													: "—"}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.isrepaired
													? setTableCellType(
															{
																type: "customStatus",
																variants: repairTypeVariants
															},
															row.isrepaired,
															row
													  )
													: "—"}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.islive
													? setTableCellType(
															{
																type: "customStatus",
																variants: residentTypeVariants
															},
															row.islive,
															row
													  )
													: "—"}
											</TableCell>
											<TableCell className="sheet-table-body-cell">
												{row.status
													? setTableCellType(
															{
																type: "customStatus",
																variants: homeTypeVariants
															},
															row.status,
															row
													  )
													: "—"}
											</TableCell>
										</TableRow>
									))
							)}
						</TableBody>
					</Fragment>
				) : (
					<TableBody>
						<TableRow>
							<TableCell colSpan={10}>
								<span className="no-data-found-wrapper">
									<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
									{t("common.global.noDataFound")}
								</span>
							</TableCell>
						</TableRow>
					</TableBody>
				)}
			</Table>
		</TableContainer>
	)
}

export default ShaxmatkaBlocksTable
