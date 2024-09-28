import * as React from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import { LinearProgress, Pagination } from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import { useQuery } from "react-query"
import setTableCellType from "utils/setTableCellType"
import SimpleTableHead from "./parts/SimpleTableHead"
import useColumnToggle from "hooks/useColumnToggle"
import TableColumnToggleDrawer from "components/TableColumnToggleDrawer"
import addActiveInTableCell from "utils/addActiveInTableCell"
import { useTranslation } from "react-i18next"

export default function SimplePaginationTable({
	dataPath = "",
	headCells = [],
	columns = [],
	tableName = "",
	emitTableColumns = {},
	emitRefetch = {}
}) {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const { tableData, tableHeadCells, tableColumnCells, setTableHeadCells } =
		useColumnToggle(
			tableName,
			addActiveInTableCell(headCells),
			addActiveInTableCell(columns)
		)

	const [hasError, setHasError] = React.useState(false)
	const {
		error,
		data: rows,
		isLoading,
		isFetching,
		isError,
		refetch
	} = useQuery({
		queryKey: dataPath + "Key",
		queryFn: async function () {
			const response = await axiosPrivate.get(`/${dataPath}?page=${page}`)
			return response.data?.data
		},
		onSettled: () => {
			emitRefetch.setRefetch(false)
		},
		enabled: !hasError,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	const [page, setPage] = React.useState(1)

	React.useEffect(() => {
		refetch()
	}, [page])

	React.useEffect(() => {
		if (emitRefetch && emitRefetch.refetch) {
			refetch()
		}
	}, [emitRefetch.refetch])

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	return (
		<Box className="base-table w-full h-full flex flex-col">
			<TableContainer className="flex-auto h-full">
				<Table
					stickyHeader
					sx={{ minWidth: 750, height: "max-content" }}
					aria-labelledby="tableTitle"
				>
					{tableHeadCells && tableColumnCells && (
						<React.Fragment>
							<SimpleTableHead headCells={tableHeadCells} />
							{isLoading || isFetching ? (
								<TableBody className="overflow-hidden">
									<TableRow>
										<TableCell colSpan={tableHeadCells.length}>
											<LinearProgress />
										</TableCell>
									</TableRow>
								</TableBody>
							) : isError ? (
								<TableBody className="overflow-hidden">
									<TableRow>
										<TableCell colSpan={tableHeadCells.length}>
											<div className="flex flex-col items-center">
												{error?.response?.data?.message && (
													<span className="text-red-600 font-medium">
														{error?.response?.data?.message}
													</span>
												)}
												{error?.response?.data?.details &&
													error?.response?.data?.details[0]?.message && (
														<div>
															<span className="text-red-600 font-medium">
																{t("common.errors.message")}
															</span>
															<span>
																{error?.response?.data?.details[0]?.message}
															</span>
														</div>
													)}
											</div>
										</TableCell>
									</TableRow>
								</TableBody>
							) : rows && rows.data && rows.data.length > 0 ? (
								<React.Fragment>
									<TableBody className="overflow-hidden">
										{rows.data.map((row, rowIndex) => {
											return (
												<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
													{tableColumnCells.map((column, columnIndex) => (
														<TableCell
															align={
																tableHeadCells[columnIndex].numeric
																	? "right"
																	: "left"
															}
															key={"column-" + columnIndex}
														>
															{column.type
																? setTableCellType(
																		column,
																		row[column.code],
																		row
																  )
																: row[column.code]}
														</TableCell>
													))}
												</TableRow>
											)
										})}
									</TableBody>
								</React.Fragment>
							) : (
								<TableBody>
									<TableRow>
										<TableCell colSpan={tableHeadCells.length}>
											<span className="no-data-found-wrapper">
												<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
												{t("common.global.noDataFound")}
											</span>
										</TableCell>
									</TableRow>
								</TableBody>
							)}
						</React.Fragment>
					)}
				</Table>
			</TableContainer>
			{rows && rows.data && rows.data.length > 0 && (
				<div className="p-3 mb-2 mt-4 flex items-center justify-center rounded-lg my-shadow-2">
					<Pagination
						count={Math.ceil(rows.total / rows.per_page) || 1}
						page={page}
						onChange={handleChangePage}
						variant="outlined"
						color="primary"
						showFirstButton
						showLastButton
					/>
				</div>
			)}

			{emitTableColumns && Object.keys(emitTableColumns).length === 2 && (
				<TableColumnToggleDrawer
					open={emitTableColumns.open}
					setOpen={emitTableColumns.setOpen}
					tableData={tableData}
					setTableHeadCells={setTableHeadCells}
				/>
			)}
		</Box>
	)
}
