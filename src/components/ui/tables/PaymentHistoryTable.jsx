import { Fragment, useState } from "react"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import { LinearProgress, TableHead } from "@mui/material"
import { useQuery } from "react-query"
import setTableCellType from "utils/setTableCellType"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import GenerateCheque from "../action-buttons/GenerateCheque"
import moment from "moment"
import { paymentTypeVariants } from "shared/tableColVariantsList"
import { useTranslation } from "react-i18next"

export default function PaymentHistoryTable({ dataPath = "" }) {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [tableRows, setTableRows] = useState([])
	const columns = [
		{ code: "date", type: "date" },
		{ code: "sum", type: "priceCurrency" },
		{
			code: "type_id",
			type: "customStatus",
			variants: paymentTypeVariants
		},
		{ code: "staff", type: "nested", childStr: "name" }
	]
	const headCells = [
		{ code: "date", label: t("common.table.date") },
		{ code: "sum", label: t("common.table.sum") },
		{ code: "type_id", label: t("common.table.typeId") },
		{ code: "staff", label: t("common.table.staff") }
	]

	const { error, isLoading, isFetching, isError } = useQuery({
		queryKey: dataPath + "Key",
		queryFn: async function () {
			const response = await axiosPrivate.get(`/${dataPath}`)
			return response.data
		},
		onSuccess: (result) => {
			if (result && result.data && result.data.length > 0) {
				result.data.sort((x, y) => moment(y.date) - moment(x.date))
				// let newArr = result.data.filter(item => item.sum && parseFloat(item.sum) !== 0)
				// setTableRows(newArr)
				setTableRows([...result.data])
			} else {
				setTableRows([])
			}
		},
		enabled: !hasError,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	return (
		<Box className="base-table w-full h-full flex flex-col">
			<TableContainer className="flex-auto h-full">
				<Table
					stickyHeader
					sx={{ minWidth: 750, height: "max-content" }}
					aria-labelledby="tableTitle"
				>
					<TableHead>
						<TableRow>
							<TableCell key="head-cell-index-number">№</TableCell>
							{headCells.map((headCell) => (
								<TableCell key={"head-cell-" + headCell.code}>
									<div dangerouslySetInnerHTML={{ __html: headCell.label }} />
								</TableCell>
							))}
							<TableCell>{t("common.table.actions")}</TableCell>
						</TableRow>
					</TableHead>
					{isLoading || isFetching ? (
						<TableBody className="overflow-hidden">
							<TableRow>
								<TableCell colSpan={headCells.length + 2}>
									<LinearProgress />
								</TableCell>
							</TableRow>
						</TableBody>
					) : isError ? (
						<TableBody className="overflow-hidden">
							<TableRow>
								<TableCell colSpan={headCells.length + 2}>
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
					) : tableRows && tableRows.length > 0 ? (
						<Fragment>
							<TableBody className="overflow-hidden">
								{tableRows.map((row, rowIndex) => (
									<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
										<TableCell>{rowIndex + 1}</TableCell>
										{columns.map((column, columnIndex) => (
											<TableCell
												align={
													headCells[columnIndex].numeric ? "right" : "left"
												}
												key={"column-" + columnIndex}
											>
												{column.type
													? setTableCellType(column, row[column.code], row)
													: row[column.code]}
											</TableCell>
										))}
										<TableCell>
											<GenerateCheque id={row.id} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Fragment>
					) : (
						<TableBody>
							<TableRow>
								<TableCell colSpan={headCells.length + 2}>
									<span className="no-data-found-wrapper">
										<i className="bi bi-exclamation-octagon text-xl mr-1" />{" "}
										{t("common.global.noDataFound")}
									</span>
								</TableCell>
							</TableRow>
						</TableBody>
					)}
				</Table>
			</TableContainer>
		</Box>
	)
}
