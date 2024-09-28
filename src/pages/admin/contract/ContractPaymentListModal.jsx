import {
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import moment from "moment"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"

const ContractPaymentListModal = (props) => {
	const { open, setOpen, data: contractData } = props
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)

	const handleClose = () => {
		setOpen(false)
	}

	const setPaymentStatus = (sum, left, date) => {
		if (sum && left) {
			if (
				parseInt(sum) === 0 &&
				parseInt(left) === 0 &&
				moment(date) < moment()
			) {
				return (
					<Chip
						label={t("contract.modal.paymentList.action.paid")}
						variant="tableBadge"
						color="success"
					/>
				)
			} else if (parseInt(sum) !== 0 && parseInt(left) === 0) {
				return (
					<Chip
						label={t("contract.modal.paymentList.action.paid")}
						variant="tableBadge"
						color="success"
					/>
				)
			} else if (parseInt(sum) - parseInt(left) !== 0) {
				return (
					<Chip
						label={t("contract.modal.paymentList.action.halfPaid")}
						variant="tableBadge"
						color="warning"
					/>
				)
			} else {
				return (
					<Chip
						label={t("contract.modal.paymentList.action.notPaid")}
						variant="tableBadge"
						color="error"
					/>
				)
			}
		}
		return ""
	}

	const {
		data: rows,
		isLoading,
		isFetching,
		isError,
		error
	} = useQuery({
		queryKey: "contractPaymentList",
		queryFn: async function () {
			const response = await axiosPrivate.get(
				`/admin/contract/list/${contractData?.id}`
			)
			return response.data.data
		},
		enabled: !hasError && !!contractData?.id,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="lg"
			disableEscapeKeyDown={true}
		>
			<DialogTitle id="payment-dialog-title">
				<span className="pr-5">
					{t("contract.modal.paymentList.title", { value: contractData?.name })}
				</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div className="mt-2">
					{contractData?.id && (
						<TableContainer className="flex-auto h-full">
							<Table
								stickyHeader
								sx={{ minWidth: 750, height: "max-content" }}
								aria-labelledby="tableTitle"
							>
								<TableHead>
									<TableRow>
										<TableCell>№</TableCell>
										<TableCell>{t("common.table.date")}</TableCell>
										<TableCell>{t("common.table.sum")}</TableCell>
										<TableCell>{t("common.table.paid")}</TableCell>
										<TableCell>{t("common.table.status")}</TableCell>
									</TableRow>
								</TableHead>
								{isLoading || isFetching ? (
									<TableBody className="overflow-hidden">
										<TableRow>
											<TableCell colSpan={5}>
												<LinearProgress />
											</TableCell>
										</TableRow>
									</TableBody>
								) : isError ? (
									<TableBody className="overflow-hidden">
										<TableRow>
											<TableCell colSpan={5}>
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
								) : rows && rows.length > 0 ? (
									<TableBody className="overflow-hidden">
										{rows.map((row, rowIndex) => {
											return (
												<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
													<TableCell>{rowIndex + 1}</TableCell>
													<TableCell>
														{moment(row.payment_date).format("DD/MM/YYYY")}
													</TableCell>
													<TableCell>
														<CurrencyFormat value={row.sum} />
													</TableCell>
													<TableCell>
														<CurrencyFormat value={row.sum - row.left} />
													</TableCell>
													<TableCell>
														{setPaymentStatus(
															row.sum,
															row.left,
															row.payment_date
														)}
													</TableCell>
												</TableRow>
											)
										})}
									</TableBody>
								) : (
									<TableBody>
										<TableRow>
											<TableCell colSpan={5}>
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
					)}
					<div className="mt-4">
						<Link
							to={`${process.env.REACT_APP_BACKEND_URL}/payment-table/${contractData?.id}`}
							className="no-underline"
						>
							<Button variant="contained" color="primary">
								{t("contract.modal.paymentList.downloadPaymentList")}
							</Button>
						</Link>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ContractPaymentListModal
