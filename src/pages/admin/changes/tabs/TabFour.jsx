import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { tabItem } from "utils/motion"
import TabPanel from "components/ui/tabs/TabPanel"
import {
	Chip,
	Fab,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import moment from "moment"
import PaymentUpdateModal from "../PaymentUpdateModal"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import { paymentTypeVariants } from "shared/tableColVariantsList"
import { useTranslation } from "react-i18next"

const TabFour = ({
	appear,
	selectedContract,
	setSelectedContract,
	selectedContractId
}) => {
	const { t } = useTranslation()
	const [payments, setPayments] = useState([])
	const [selectedPayment, setSelectedPayment] = useState("")
	const [open, setOpen] = useState(false)
	const axiosPrivate = useAxiosPrivate()

	useEffect(() => {
		if (
			selectedContract &&
			selectedContract.payments &&
			selectedContract.payments.length > 0
		) {
			selectedContract.payments.sort((x, y) => moment(y.date) - moment(x.date))
			setPayments(selectedContract.payments)
		} else {
			setPayments([])
		}
	}, [selectedContract])

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

	const refetchFn = async () => {
		try {
			const response = await axiosPrivate.get(
				`/dictionary/contract/${selectedContractId}`,
				{ headers: { "Content-Type": "application/json" } }
			)
			if (response.data && response.data.status && response.data.data) {
				setSelectedContract(response.data.data)
			}
		} catch (error) {
			console.log(error?.response?.data?.message || error?.message)
		}
	}

	const handlePaymentUpdate = (paymentData) => {
		setSelectedPayment(paymentData)
		setOpen(true)
	}

	return (
		<motion.div
			variants={tabItem({
				duration: 0
			})}
			initial="hidden"
			animate={appear ? "show" : "hidden"}
		>
			<TabPanel value={0} index={0} className="-mx-6">
				{selectedContract ? (
					<div className="flex justify-between mt-4">
						{payments && (
							<Grid
								container
								spacing={{ xs: 2, sm: 3, lg: 3 }}
								rowSpacing={1}
								columns={{ xs: 12, sm: 12, lg: 20 }}
							>
								<Grid item={true} lg={12} sm={6} xs={12}>
									<div className="changes-table">
										<TableContainer className="flex-auto w-full h-full">
											<Table
												stickyHeader
												sx={{ width: "inherit" }}
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
												<TableBody className="overflow-hidden">
													{payments.map((row, rowIndex) => (
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
																<Fab
																	color="warning"
																	variant="action"
																	aria-label="edit"
																	onClick={() => handlePaymentUpdate(row)}
																>
																	<i className="bi bi-pencil-square" />
																</Fab>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</div>
								</Grid>
							</Grid>
						)}
					</div>
				) : (
					<div className="text-gray-400 flex items-center mt-2">
						<i className="bi bi-exclamation-octagon text-lg mr-1 flex items-center" />{" "}
						<span className="text-sm">
							{t("change.tab.payment.noPaymentHistoryFound")}
						</span>
					</div>
				)}

				{open && (
					<PaymentUpdateModal
						open={open}
						setOpen={setOpen}
						data={selectedPayment}
						refetch={refetchFn}
						currency={selectedContract?.isvalute}
					/>
				)}
			</TabPanel>
		</motion.div>
	)
}

export default TabFour
