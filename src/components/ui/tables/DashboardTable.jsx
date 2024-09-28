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
import ModalActionButton from "../action-buttons/ModalActionButton"
import TableColumnToggleDrawer from "components/TableColumnToggleDrawer"
import useColumnToggle from "hooks/useColumnToggle"
import addActiveInTableCell from "utils/addActiveInTableCell"
import {
	homeTypeVariants,
	repairTypeVariants,
	residentTypeVariants
} from "shared/tableColVariantsList"
import { Trans, useTranslation } from "react-i18next"

const DashboardTable = ({
	dataPath = "",
	emitTableColumns = {},
	emitRefetch = {},
	actionModal = null
}) => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const headCells = [
		{ code: "id", label: "#" },
		{ code: "name", label: t("common.table.blockName") },
		{ code: "number", label: t("common.table.homeNumber") },
		{
			code: "details",
			label: t("common.table.homeDetails")
		},
		{
			code: "repaired",
			label: t("common.table.repairedPrice")
		},
		{
			code: "norepaired",
			label: t("common.table.noRepairedPrice")
		},
		{ code: "start", label: t("common.table.startPrice") },
		{ code: "isrepaired", label: t("common.table.repairType") },
		{ code: "islive", label: t("common.table.residentType") },
		{ code: "status", label: t("common.table.status") }
	]
	const columns = [
		{ code: "id" },
		{ code: "name" },
		{ code: "number" },
		{ code: "details", type: "details" },
		{ code: "repaired", type: "priceCurrency" },
		{ code: "norepaired", type: "priceCurrency" },
		{ code: "start", type: "priceCurrency" },
		{
			code: "isrepaired",
			type: "customStatus",
			variants: repairTypeVariants
		},
		{
			code: "islive",
			type: "customStatus",
			variants: residentTypeVariants
		},
		{
			code: "status",
			type: "customStatus",
			variants: homeTypeVariants
		}
	]
	const { tableData, tableHeadCells, tableColumnCells, setTableHeadCells } =
		useColumnToggle(
			"dashboard",
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
	}, [dataPath])

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
															{column.type ? (
																column.type === "details" ? (
																	<div>
																		<span className="mx-1">{row?.stage}</span>|
																		<span className="mx-1">{row?.rooms}</span>|
																		<span className="mx-1">
																			{row?.square}
																			<Trans i18nKey="common.global.meter">
																				m<sup>2</sup>
																			</Trans>
																		</span>
																	</div>
																) : (
																	setTableCellType(
																		column,
																		row[column.code],
																		row
																	)
																)
															) : (
																row[column.code]
															)}
														</TableCell>
													))}
													<TableCell align="right">
														{actionModal && (
															<ModalActionButton
																icon={actionModal.icon}
																btnColor={actionModal.btnColor}
																setOpen={actionModal.setOpen}
																setData={actionModal.setData}
																data={row}
																disabled={
																	actionModal.nonDisableStatus &&
																	row[
																		actionModal.nonDisableStatus.columnCode
																	] !== actionModal.nonDisableStatus.code
																}
															/>
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

export default DashboardTable
