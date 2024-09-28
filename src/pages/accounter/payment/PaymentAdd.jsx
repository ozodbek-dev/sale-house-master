import {
	Button,
	ButtonBase,
	Chip,
	CircularProgress,
	Grid,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from "@mui/material"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import { motion } from "framer-motion"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { fadeUp } from "utils/motion"
import PaymentAddModal from "./PaymentAddModal"
import { useQuery } from "react-query"
import moment from "moment"
import GenerateCheque from "components/ui/action-buttons/GenerateCheque"
import { paymentTypeVariants } from "shared/tableColVariantsList"
import { useTranslation } from "react-i18next"

const PaymentAdd = () => {
	const { t, i18n } = useTranslation()
	const [contractsLoading, setContractsLoading] = useState(false)
	const [open, setOpen] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [selectedContract, setSelectedContract] = useState("")
	const [selectedContractId, setSelectedContractId] = useState("")
	const axiosPrivate = useAxiosPrivate()
	const [contractsList, setContractsList] = useState([])
	const [clientName, setClientName] = useState("")

	const { setComponent } = useTopPanel()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("payment.add.title")}
			</div>
		)
	}, [i18n.language])

	const handleKeyDown = async (event) => {
		if (event.keyCode === 13) {
			setContractsLoading(true)
			setSelectedContractId("")
			setSelectedContract("")
			Array.from(document.getElementsByClassName("contract-item")).forEach(
				(item) => item.classList.remove("item-selected")
			)
			const response = await axiosPrivate.get(
				`/dictionary/contractsearch?name=${clientName}`
			)
			if (response.data && response.data.status) {
				setContractsList(response.data.data)
			}
			setContractsLoading(false)
		}
	}

	const {
		data: rows,
		error,
		isLoading,
		isFetching,
		isError,
		refetch
	} = useQuery({
		queryKey: "paymentList",
		queryFn: async function () {
			const response = await axiosPrivate.get(
				`/dictionary/contract/${selectedContractId}`
			)
			return response.data.data
		},
		onSuccess: (result) => {
			if (result && result.payments && result.payments.length > 0) {
				result.payments.sort((x, y) => moment(y.date) - moment(x.date))
				// result.payments = result.payments.filter(
				// 	(item) => item.sum && parseFloat(item.sum) !== 0
				// )
			}
		},
		enabled: !hasError && !!selectedContractId,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	useEffect(() => {
		if (selectedContractId) {
			refetch()
		}
	}, [selectedContractId])

	const handleContract = (contract) => {
		Array.from(document.getElementsByClassName("contract-item")).forEach(
			(item) =>
				item.id !== `contract-${contract?.id}` &&
				item.classList.remove("item-selected")
		)
		document
			.getElementById(`contract-${contract?.id}`)
			.classList.toggle("item-selected")
		if (selectedContractId === contract?.id) {
			setSelectedContractId("")
			setSelectedContract("")
		} else {
			setSelectedContractId(contract?.id)
			setSelectedContract(contract)
		}
	}

	const setPaymentType = (item) => {
		if (paymentTypeVariants && paymentTypeVariants.length > 0 && !isNaN(item)) {
			let result = paymentTypeVariants.filter(
				(variant) => variant.code === item
			)
			if (result.length > 0) {
				return (
					<Chip
						label={t(result[0].label)}
						variant="tableBadge"
						color={result[0].color}
					/>
				)
			}
		}
		return ""
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
						label={t("payment.action.paid")}
						variant="tableBadge"
						color="success"
					/>
				)
			} else if (parseInt(sum) !== 0 && parseInt(left) === 0) {
				return (
					<Chip
						label={t("payment.action.paid")}
						variant="tableBadge"
						color="success"
					/>
				)
			} else if (parseInt(sum) - parseInt(left) !== 0) {
				return (
					<Chip
						label={t("payment.action.halfPaid")}
						variant="tableBadge"
						color="warning"
					/>
				)
			} else {
				return (
					<Chip
						label={t("payment.action.notPaid")}
						variant="tableBadge"
						color="error"
					/>
				)
			}
		}
		return ""
	}

	return (
		<div className="component-add-edit-wrapper mx-4">
			<div className="component-add-edit-body mt-3 pb-6">
				<div className="flex flex-row">
					<div className="w-1/2">
						<Grid
							container
							spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
						>
							<Grid item={true} lg={6} md={8} sm={12} xs={12}>
								<TextField
									component={motion.div}
									variants={fadeUp(30, "tween", 0, 0.5)}
									initial="hidden"
									animate="show"
									viewport={{ once: true, amount: 0.25 }}
									color="formColor"
									variant="outlined"
									fullWidth
									id="client-name-field"
									name="client-name-field"
									label={t("payment.add.clientName")}
									value={clientName}
									onChange={(event) => setClientName(event.target.value)}
									onKeyDown={handleKeyDown}
									autoComplete="off"
								/>
							</Grid>
						</Grid>
						<div className="contracts-database-wrapper">
							<div className="contracts-database-body flex flex-col">
								{contractsLoading ? (
									<div className="circular-progress-box py-5">
										<CircularProgress size={30} />
									</div>
								) : contractsList && contractsList.length > 0 ? (
									contractsList.map((contract) => (
										<ButtonBase
											className="contract-item"
											id={`contract-${contract.id}`}
											key={contract.id}
											onClick={() => handleContract(contract)}
										>
											<div className="contract-item-detail">
												<span className="name">
													{t("payment.add.contract.name")}: {contract?.name}
												</span>
												<span className="sum">
													{t("payment.add.contract.sum")}:{" "}
													<CurrencyFormat
														value={contract?.sum}
														suffix={contract?.isvalute === "1" ? " $" : " UZS"}
													/>
												</span>
											</div>
											<div className="contract-item-detail">
												<span className="home">
													{t("payment.add.contract.homeDetails", {
														number: contract?.homes?.number,
														stage: contract?.homes?.stage,
														rooms: contract?.homes?.rooms
													})}
												</span>
												<span className="phone">
													{t("payment.add.contract.phone")}:{" "}
													<PhoneFormat value={contract?.custom?.phone} />
												</span>
											</div>
											<div className="contract-item-detail">
												<span className="custom-name">
													{contract?.custom?.surname} {contract?.custom?.name}{" "}
													{contract?.custom?.middlename}
												</span>
												<span className="start-price">
													{t("payment.add.contract.startPrice")}:{" "}
													<CurrencyFormat
														value={contract?.start_price}
														suffix={contract?.isvalute === "1" ? " $" : " UZS"}
													/>
												</span>
											</div>
										</ButtonBase>
									))
								) : (
									<div className="mt-6">
										<span className="no-data-found-wrapper">
											<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
											{t("common.global.noDataFound")}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
					{selectedContract?.id && (
						<div className="contract-details-wrapper flex flex-col mt-2 w-1/2 px-4">
							<div className="contract-details-header mt-2">
								<div className="contract-details-title text-center text-xl text-base-color">
									{t("payment.add.contract.details")}
								</div>
							</div>
							<div className="contract-details-body mt-3">
								<div className="contract-detail-item">
									<span>
										{t("payment.add.contract.objectName")}:{" "}
										{selectedContract?.homes?.blocks?.objects?.name}{" "}
										{selectedContract?.homes?.blocks?.name}
									</span>
									<span>
										{t("payment.add.contract.homeNumber")}:{" "}
										{selectedContract?.homes?.number}
									</span>
								</div>
								<div className="contract-detail-item">
									<span>
										{t("payment.add.contract.totalSum")}:{" "}
										<CurrencyFormat
											value={selectedContract?.sum}
											suffix={
												selectedContract?.isvalute === "1" ? " $" : " UZS"
											}
										/>
									</span>
									<span>
										{t("payment.add.contract.startSum")}:{" "}
										<CurrencyFormat
											value={selectedContract?.start_price}
											suffix={
												selectedContract?.isvalute === "1" ? " $" : " UZS"
											}
										/>
									</span>
								</div>
								<div className="contract-detail-item">
									<span>
										{t("payment.add.contract.leftSum")}:{" "}
										<CurrencyFormat
											value={selectedContract?.left}
											suffix={
												selectedContract?.isvalute === "1" ? " $" : " UZS"
											}
										/>
									</span>
									<span>
										{t("payment.add.contract.paidSum")}:{" "}
										<CurrencyFormat
											value={selectedContract?.sum - selectedContract?.left}
											suffix={
												selectedContract?.isvalute === "1" ? " $" : " UZS"
											}
										/>
									</span>
								</div>
								<div className="contract-detail-item">
									<span>
										{t("payment.add.contract.discount")}:{" "}
										<CurrencyFormat
											value={selectedContract?.discount}
											suffix={
												selectedContract?.isvalute === "1" ? " $" : " UZS"
											}
										/>
									</span>
									<span></span>
								</div>
							</div>
						</div>
					)}
				</div>

				{selectedContract?.id && (
					<div className="text-center mt-6">
						{selectedContract?.status === "3" ? (
							<Button color="error" variant="contained" fullWidth>
								<span>{t("payment.add.contract.cancelled")}</span>
							</Button>
						) : selectedContract?.status === "2" ? (
							<Button color="error" variant="contained" fullWidth>
								<span className="h-10 flex items-center text-lg">
									{t("payment.add.contract.completed")}
								</span>
							</Button>
						) : (
							<Button
								color="primary"
								variant="contained"
								onClick={() => setOpen(true)}
							>
								{t("common.button.pay")}
							</Button>
						)}
					</div>
				)}

				{selectedContract?.id && (
					<div className="payments-table-wrapper mt-6">
						<Grid
							container
							spacing={{ xs: 2, sm: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, lg: 12 }}
						>
							<Grid item={true} sm={6} xs={12}>
								<div className="payment-table w-full h-full flex flex-col">
									<div className="my-2 text-lg font-medium text-base-color">
										{t("payment.add.paymentTable.title")}
									</div>
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
																	error?.response?.data?.details[0]
																		?.message && (
																		<div>
																			<span className="text-red-600 font-medium">
																				{t("common.errors.message")}
																			</span>
																			<span>
																				{
																					error?.response?.data?.details[0]
																						?.message
																				}
																			</span>
																		</div>
																	)}
															</div>
														</TableCell>
													</TableRow>
												</TableBody>
											) : rows && rows.list && rows.list.length > 0 ? (
												<TableBody className="overflow-hidden">
													{rows.list.map((row, rowIndex) => {
														return (
															<TableRow
																hover
																tabIndex={-1}
																key={"row-" + rowIndex}
															>
																<TableCell>{rowIndex + 1}</TableCell>
																<TableCell>
																	{moment(row.payment_date).format(
																		"DD/MM/YYYY"
																	)}
																</TableCell>
																<TableCell>
																	<CurrencyFormat
																		value={row.sum}
																		suffix={
																			selectedContract?.isvalute === "1"
																				? " $"
																				: " UZS"
																		}
																	/>
																</TableCell>
																<TableCell>
																	<CurrencyFormat
																		value={row.sum - row.left}
																		suffix={
																			selectedContract?.isvalute === "1"
																				? " $"
																				: " UZS"
																		}
																	/>
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
								</div>
							</Grid>
							<Grid item={true} sm={6} xs={12}>
								<div className="payment-history-table">
									<div className="my-2 text-lg font-medium text-base-color">
										{t("payment.add.paymentHistoryTable.title")}
									</div>
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
													<TableCell>{t("common.table.typeId")}</TableCell>
													<TableCell>{t("common.table.actions")}</TableCell>
												</TableRow>
											</TableHead>
											{isLoading || isFetching ? (
												<TableBody className="overflow-hidden">
													<TableRow>
														<TableCell colSpan={4}>
															<LinearProgress />
														</TableCell>
													</TableRow>
												</TableBody>
											) : isError ? (
												<TableBody className="overflow-hidden">
													<TableRow>
														<TableCell colSpan={4}>
															<div className="flex flex-col items-center">
																{error?.response?.data?.message && (
																	<span className="text-red-600 font-medium">
																		{error?.response?.data?.message}
																	</span>
																)}
																{error?.response?.data?.details &&
																	error?.response?.data?.details[0]
																		?.message && (
																		<div>
																			<span className="text-red-600 font-medium">
																				{t("common.errors.message")}
																			</span>
																			<span>
																				{
																					error?.response?.data?.details[0]
																						?.message
																				}
																			</span>
																		</div>
																	)}
															</div>
														</TableCell>
													</TableRow>
												</TableBody>
											) : rows && rows.payments && rows.payments.length > 0 ? (
												<TableBody className="overflow-hidden">
													{rows.payments.map((row, rowIndex) => {
														return (
															<TableRow
																hover
																tabIndex={-1}
																key={"row-" + rowIndex}
															>
																<TableCell>{rowIndex + 1}</TableCell>
																<TableCell>
																	{moment(row.date).format("DD/MM/YYYY")}
																</TableCell>
																<TableCell>
																	<CurrencyFormat
																		value={row.sum}
																		suffix={
																			selectedContract?.isvalute === "1"
																				? " $"
																				: " UZS"
																		}
																	/>
																</TableCell>
																<TableCell>
																	{setPaymentType(row.type_id)}
																</TableCell>
																<TableCell>
																	<GenerateCheque id={row.id} />
																</TableCell>
															</TableRow>
														)
													})}
												</TableBody>
											) : (
												<TableBody>
													<TableRow>
														<TableCell colSpan={4}>
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
								</div>
							</Grid>
						</Grid>
					</div>
				)}
			</div>
			{open && (
				<PaymentAddModal
					open={open}
					setOpen={setOpen}
					refetch={refetch}
					data={selectedContract}
				/>
			)}
		</div>
	)
}

export default PaymentAdd
