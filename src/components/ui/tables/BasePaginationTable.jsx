import * as React from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import { LinearProgress, Pagination } from "@mui/material"
import { useSearchParams } from "react-router-dom"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import { useQuery } from "react-query"
import BaseTableHead from "./parts/BaseTableHead"
import setTableCellType from "utils/setTableCellType"
import DeleteActionButton from "../action-buttons/DeleteActionButton"
import EditActionButton from "../action-buttons/EditActionButton"
import InfoActionButton from "../action-buttons/InfoActionButton"
import AddActionButton from "../action-buttons/AddActionButton"
import ListActionButton from "../action-buttons/ListActionButton"
import EditModalActionButton from "../action-buttons/EditModalActionButton"
import TableColumnToggleDrawer from "components/TableColumnToggleDrawer"
import useColumnToggle from "hooks/useColumnToggle"
import GenerateCheque from "../action-buttons/GenerateCheque"
import addActiveInTableCell from "utils/addActiveInTableCell"
import ContractViewActionButton from "../action-buttons/ContractViewActionButton"
import { useTranslation } from "react-i18next"

export default function BasePaginationTable({
	dataPath = "",
	headCells = [],
	columns = [],
	tableName = "",
	emitTableColumns = {},
	emitRefetch = {},
	actionContractView = null,
	actionInfo = null,
	actionCustomInfo = null,
	actionEdit = null,
	actionDelete = null,
	actionAdd = null,
	actionList = null,
	actionModalEdit = null,
	actionGetCheque = null
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
	const [queryPath, setQueryPath] = React.useState("")

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
			const response = await axiosPrivate.get(queryPath)
			return response?.data?.data
		},
		onSettled: () => {
			emitRefetch.setRefetch(false)
		},
		enabled: false,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	const [searchParams, setSearchParams] = useSearchParams()
	const [page, setPage] = React.useState(
		(searchParams.get("page") && parseInt(searchParams.get("page"))) || 1
	)

	React.useEffect(() => {
		if (queryPath && queryPath.length > 0) {
			refetch()
		}
	}, [queryPath])

	React.useEffect(() => {
		createQueryPath()
	}, [searchParams])

	React.useEffect(() => {
		if (emitRefetch && emitRefetch.refetch) {
			refetch()
		}
	}, [emitRefetch.refetch])

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
		searchParams.set("page", newPage)
		setSearchParams(searchParams)
	}

	const createQueryPath = () => {
		let newQueryPath = `/${dataPath}`
		let localSearchParams = Object.fromEntries([...searchParams])
		Object.keys(localSearchParams).forEach((item, index) => {
			if (index === 0) {
				newQueryPath += `?${item}=${localSearchParams[item]}`
			} else {
				newQueryPath += `&${item}=${localSearchParams[item]}`
			}
		})
		setQueryPath(newQueryPath)
		if (!isNaN(localSearchParams.page)) {
			setPage(parseInt(localSearchParams.page))
		}
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
							<BaseTableHead headCells={tableHeadCells} />
							{isLoading || isFetching ? (
								<TableBody className="overflow-hidden">
									<TableRow>
										<TableCell colSpan={tableHeadCells.length + 1}>
											<LinearProgress />
										</TableCell>
									</TableRow>
								</TableBody>
							) : isError ? (
								<TableBody className="overflow-hidden">
									<TableRow>
										<TableCell colSpan={tableHeadCells.length + 1}>
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
																tableHeadCells[columnIndex]?.numeric
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
													<TableCell align="right">
														{actionContractView && (
															<ContractViewActionButton
																link={`/admin/contract/view/${
																	row?.payment?.contract_id
																		? `${row.payment.contract_id}`
																		: ""
																}`}
															/>
														)}
														{actionInfo && (
															<InfoActionButton link={`/view/${row.id}`} />
														)}
														{actionCustomInfo && (
															<InfoActionButton
																link={`${actionCustomInfo.baseLink}/${
																	row[actionCustomInfo.linkIdCode]
																}`}
															/>
														)}
														{actionEdit && (
															<EditActionButton link={`/edit/${row.id}`} />
														)}
														{actionModalEdit && (
															<EditModalActionButton
																setItemId={actionModalEdit.setItemId}
																setOpen={actionModalEdit.setOpen}
																id={row.id}
															/>
														)}
														{actionDelete && (
															<DeleteActionButton
																link={actionDelete.link}
																data={{ [actionDelete.key]: row.id }}
																refetch={refetch}
															/>
														)}
														{actionAdd && (
															<AddActionButton
																link={`/${row.id}/${actionAdd.link}`}
															/>
														)}
														{actionList && (
															<ListActionButton
																link={`/${row.id}/${actionList.link}`}
															/>
														)}
														{actionGetCheque && (
															<GenerateCheque id={row.id} sum={row.sum} />
														)}
													</TableCell>
												</TableRow>
											)
										})}
									</TableBody>
								</React.Fragment>
							) : (
								<TableBody>
									<TableRow>
										<TableCell colSpan={tableHeadCells.length + 1}>
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
