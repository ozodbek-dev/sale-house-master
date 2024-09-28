import { Button, CircularProgress, Grid } from "@mui/material"
import BackButton from "components/ui/BackButton"
import PaymentHistoryTable from "components/ui/tables/PaymentHistoryTable"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useTopPanel from "hooks/useTopPanel"
import moment from "moment"
import React, { Fragment, useEffect, useState } from "react"
import { useQueries } from "react-query"
import { Link, useParams } from "react-router-dom"
import CLIENT_TYPE from "shared/clientTypeList"
import REPAIR_TYPE from "shared/repairTypeList"
import getLabelByTypeList from "utils/getLabelByTypeList"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import ContractCancellationModal from "./ContractCancellationModal"
import SuccessTooltip from "components/ui/tooltips/SuccessTooltip"
import InfoTooltip from "components/ui/tooltips/InfoTooltip"
import BaseTooltipCustomWidth from "components/ui/tooltips/BaseTooltipCustomWidth"
import useAuth from "hooks/useAuth"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import UploadContractPaymentsListAndHistory from "./UploadContractPaymentsListAndHistory"
import ContractPaymentSimpleListModal from "./ContractPaymentSimpleListModal"
import ImagePreviewDialog from "components/ui/dialogs/ImagePreviewDialog"
import { Trans, useTranslation } from "react-i18next"

const ContractView = () => {
	const { id } = useParams()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [{ user }] = useAuth()
	const [hasError, setHasError] = useState(false)
	const [open, setOpen] = useState(false)
	const [totalLeftByMonth, setTotalLeftByMonth] = useState(0)
	const [cancellationOpen, setCancellationOpen] = useState(false)
	const [uploadPaymentsListOpen, setUploadPaymentsListOpen] = useState(false)
	const [uploadPaymentsHistoryOpen, setUploadPaymentsHistoryOpen] =
		useState(false)
	const [openHomeLayoutImageDialog, setOpenHomeLayoutImageDialog] =
		useState(false)
	const { setComponent } = useTopPanel()

	const [contractQuery, paymentsListQuery] = useQueries([
		{
			queryKey: "contractSingle",
			queryFn: async function () {
				const response = await axiosPrivate.get(`/admin/contract/edit/${id}`)
				return response.data.data
			},
			onSuccess: (data) => {},
			enabled: !hasError && !!id,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "contractPaymentList",
			queryFn: async function () {
				const response = await axiosPrivate.get(`/admin/contract/list/${id}`)
				return response.data.data
			},
			onSuccess: (data) => {
				let leftTotal = 0
				data.forEach((item, index) => {
					if (moment(item.payment_date, "YYYY-MM-DD").isBefore(moment())) {
						leftTotal += +item.left
					}
				})
				setTotalLeftByMonth(leftTotal)
			},
			enabled: !hasError && !!id,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		}
	])

	useEffect(() => {
		setComponent(
			<div className="flex flex-row items-center">
				<BackButton />
				<div className="text-base-color text-xl font-medium flex flex-row">
					{t("contract.view.title")} №{" "}
					<BaseTooltipCustomWidth
						arrow={true}
						placement="bottom"
						enterDelay={1000}
						leaveTouchDelay={0}
						title={contractQuery?.data?.name}
						width={"800px"}
						fontSize={"1rem"}
					>
						<span className="text-line-1 max-w-[800px] ml-1">
							{contractQuery?.data?.name}
						</span>
					</BaseTooltipCustomWidth>
				</div>
			</div>
		)
	}, [contractQuery?.data, i18n.language])

	return (
		<div className="component-add-edit-wrapper mx-4">
			{contractQuery.isLoading || contractQuery.isFetching ? (
				<div className="circular-progress-box py-5">
					<CircularProgress size={35} />
				</div>
			) : (
				contractQuery?.data && (
					<Fragment>
						<div className="component-add-edit-header mt-3">
							<Grid container spacing={2} columns={{ xs: 12, sm: 12, lg: 12 }}>
								<Grid item={true} lg={2} md={4} sm={6} xs={12}>
									<Button
										color="secondary"
										variant="contained"
										className="!h-full"
										fullWidth
									>
										<div className="flex flex-col p-2">
											<span className="text-lg leading-5 mb-1">
												{t("contract.view.header.sum")}
											</span>
											<span className="text-sm">
												<CurrencyFormat
													value={contractQuery?.data?.sum}
													suffix={
														contractQuery?.data?.isvalute === "1"
															? " $"
															: " UZS"
													}
												/>
											</span>
										</div>
									</Button>
								</Grid>
								<Grid item={true} lg={2} md={4} sm={6} xs={12}>
									<Button
										color="info"
										variant="contained"
										className="!h-full"
										fullWidth
									>
										<div className="flex flex-col p-2">
											<span className="text-lg leading-5 mb-1">
												{t("contract.view.header.startPrice")}
											</span>
											<span className="text-sm">
												<CurrencyFormat
													value={contractQuery?.data?.start_price}
													suffix={
														contractQuery?.data?.isvalute === "1"
															? " $"
															: " UZS"
													}
												/>
											</span>
										</div>
									</Button>
								</Grid>
								<Grid item={true} lg={2} md={4} sm={6} xs={12}>
									<Button
										color="warning"
										variant="contained"
										className="!h-full"
										fullWidth
									>
										<div className="flex flex-col p-2">
											<span className="text-lg leading-5 mb-1">
												<Trans i18nKey="contract.view.header.priceForSquare">
													1 m<sup>2</sup> uchun to'lov miqdori
												</Trans>
											</span>
											<span className="text-sm">
												<CurrencyFormat
													value={contractQuery?.data?.price}
													suffix={
														contractQuery?.data?.isvalute === "1"
															? " $"
															: " UZS"
													}
												/>
											</span>
										</div>
									</Button>
								</Grid>
								<Grid item={true} lg={2} md={4} sm={6} xs={12}>
									<Button
										color="success"
										variant="contained"
										className="!h-full"
										fullWidth
									>
										<div className="flex flex-col p-2">
											<span className="text-lg leading-5 mb-1">
												{t("contract.view.header.discount")}
											</span>
											<span className="text-sm">
												<CurrencyFormat
													value={contractQuery?.data?.discount}
													suffix={
														contractQuery?.data?.isvalute === "1"
															? " $"
															: " UZS"
													}
												/>
											</span>
										</div>
									</Button>
								</Grid>
								<Grid item={true} lg={2} md={4} sm={6} xs={12}>
									<Button
										variant="contained"
										fullWidth
										sx={{
											backgroundColor: "#1f52d8",
											"&:hover": {
												backgroundColor: "#173da1"
											}
										}}
										className="!h-full"
									>
										<div className="flex flex-col p-2">
											<span className="text-lg leading-5 mb-1">
												{t("contract.view.header.monthlyLeft")}
											</span>
											<span className="text-sm">
												{totalLeftByMonth ? (
													<CurrencyFormat
														value={totalLeftByMonth}
														allowNegative={true}
														suffix={
															contractQuery?.data?.isvalute === "1"
																? " $"
																: " UZS"
														}
													/>
												) : (
													t("contract.view.header.noMonthlyLeft")
												)}
											</span>
										</div>
									</Button>
								</Grid>
								<Grid item={true} lg={2} md={4} sm={6} xs={12}>
									<Button
										color="error"
										variant="contained"
										className="!h-full"
										fullWidth
									>
										<div className="flex flex-col p-2">
											<span className="text-lg leading-5 mb-1">
												{t("contract.view.header.leftPrice")}
											</span>
											<span className="text-sm">
												<CurrencyFormat
													value={contractQuery?.data?.left}
													allowNegative={true}
													suffix={
														contractQuery?.data?.isvalute === "1"
															? " $"
															: " UZS"
													}
												/>
											</span>
										</div>
									</Button>
								</Grid>
							</Grid>
						</div>
						{contractQuery?.data?.comment && (
							<div className="contract-comment my-shadow-2 rounded-lg p-4 w-full mt-4 mb-1">
								<div>
									<span className="font-medium text-base-color">
										{t("contract.view.header.comment")}:
									</span>{" "}
									{contractQuery?.data?.comment}
								</div>
							</div>
						)}
						<div className="component-add-edit-body">
							<div className="py-3 flex flex-row">
								<div className="base-data w-full">
									<div className="home-data flex items-center justify-between my-shadow-2 rounded-lg p-4 w-full mb-4">
										<div className="home-data-item flex flex-col">
											<span className="data-item-title text-base font-medium text-base-color">
												{t("contract.view.homeDetail.objectName")}:
											</span>
											<span className="data-item-value text-base">
												{contractQuery?.data?.homes?.blocks?.objects?.name}
											</span>
										</div>
										<div className="home-data-item flex flex-col">
											<span className="data-item-title text-base font-medium text-base-color">
												{t("contract.view.homeDetail.blockName")}:
											</span>
											<span className="data-item-value text-base">
												{contractQuery?.data?.homes?.blocks?.name}
											</span>
										</div>
										<div className="home-data-item flex flex-col">
											<span className="data-item-title text-base font-medium text-base-color">
												{t("contract.view.homeDetail.homeNumber")}:
											</span>
											<span className="data-item-value text-base">
												{contractQuery?.data?.homes?.number}
											</span>
										</div>
										<div className="home-data-item flex flex-col">
											<span className="data-item-title text-base font-medium text-base-color">
												{t("contract.view.homeDetail.stage")}:
											</span>
											<span className="data-item-value text-base">
												{contractQuery?.data?.homes?.stage}
											</span>
										</div>
										<div className="home-data-item flex flex-col">
											<span className="data-item-title text-base font-medium text-base-color">
												{t("contract.view.homeDetail.rooms")}:
											</span>
											<span className="data-item-value text-base">
												{contractQuery?.data?.homes?.rooms}
											</span>
										</div>
										<div className="home-data-item flex flex-col">
											<span className="data-item-title text-base font-medium text-base-color">
												{t("contract.view.homeDetail.area")}:
											</span>
											<span className="data-item-value text-base">
												{contractQuery?.data?.homes?.square}{" "}
												<Trans i18nKey="common.global.meter">
													m<sup>2</sup>
												</Trans>
											</span>
										</div>
										<div className="home-data-item flex flex-col">
											<span className="data-item-title text-base font-medium text-base-color">
												{t("contract.view.homeDetail.isrepaired")}:
											</span>
											<span className="data-item-value text-base">
												{getLabelByTypeList(
													REPAIR_TYPE,
													contractQuery?.data?.isrepaired
												)}
											</span>
										</div>
										<div className="home-data-item flex flex-col">
											<span className="data-item-title text-base font-medium text-base-color">
												{t("common.button.homePlan")}:
											</span>
											<span className="data-item-value text-base">
												<Button
													type="button"
													variant="contained"
													className="!-mb-[10px] !w-[100px]"
													disabled={
														!(
															contractQuery?.data?.homes?.plan &&
															contractQuery?.data?.homes?.plan?.link
														)
													}
													onClick={() => setOpenHomeLayoutImageDialog(true)}
												>
													<i className="bi bi-image text-lg" />
												</Button>
											</span>
										</div>
									</div>

									<div className="client-data flex items-center my-shadow-2 rounded-lg p-4 w-full">
										{contractQuery?.data?.custom?.client_type ===
										CLIENT_TYPE.PHYSICAL.code ? (
											<Grid
												container
												spacing={{ xs: 2, sm: 3, mdm: 3, lg: 3 }}
												rowSpacing={1}
												columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
											>
												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientPhysical.custom")}:
														</span>
														<span className="data-item-value text-base font-medium underline">
															{contractQuery?.data?.custom?.surname}{" "}
															{contractQuery?.data?.custom?.name}{" "}
															{contractQuery?.data?.custom?.middlename}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientPhysical.birthday")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.birthday
																? moment(
																		contractQuery?.data?.custom?.detail
																			?.birthday
																  ).format("DD/MM/YYYY")
																: ""}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientPhysical.phone")}:
														</span>
														<span className="data-item-value text-base flex flex-col">
															<PhoneFormat
																value={contractQuery?.data?.custom?.phone}
															/>
															<PhoneFormat
																value={contractQuery?.data?.custom?.phone2}
															/>
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientPhysical.passportSeries")}
															:
														</span>
														<span className="data-item-value text-base">
															{
																contractQuery?.data?.custom?.detail
																	?.passport_series
															}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientPhysical.issue")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.issue
																? moment(
																		contractQuery?.data?.custom?.detail?.issue
																  ).format("DD/MM/YYYY")
																: ""}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientPhysical.authority")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.authority}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientPhysical.home")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.home}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientPhysical.workPlace")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.work_place}
														</span>
													</div>
												</Grid>
											</Grid>
										) : (
											<div>
												<span className="no-data-found-wrapper">
													<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
													{t("common.global.noDataFound")}
												</span>
											</div>
										)}
										{contractQuery?.data?.custom?.client_type ===
										CLIENT_TYPE.LEGAL.code ? (
											<Grid
												container
												spacing={{ xs: 2, sm: 3, mdm: 3, lg: 3 }}
												rowSpacing={1}
												columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
											>
												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientLegal.name")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.name}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientLegal.phone")}:
														</span>
														<span className="data-item-value text-base">
															<PhoneFormat
																value={contractQuery?.data?.custom?.phone}
															/>
															<PhoneFormat
																value={contractQuery?.data?.custom?.phone2}
															/>
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientLegal.address")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.home}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientLegal.accountNumber")}:
														</span>
														<span className="data-item-value text-base">
															{
																contractQuery?.data?.custom?.detail
																	?.account_number
															}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientLegal.tin")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.inn}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientLegal.mfo")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.mfo}
														</span>
													</div>
												</Grid>

												<Grid item={true} lg={3} md={4} sm={6} xs={12}>
													<div className="home-data-item flex flex-col">
														<span className="data-item-title text-base font-medium text-base-color">
															{t("contract.view.clientLegal.oked")}:
														</span>
														<span className="data-item-value text-base">
															{contractQuery?.data?.custom?.detail?.oked}
														</span>
													</div>
												</Grid>
											</Grid>
										) : (
											<div>
												<span className="no-data-found-wrapper">
													<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
													{t("common.global.noDataFound")}
												</span>
											</div>
										)}
									</div>

									<div className="contract-staff-details my-shadow-2 rounded-lg p-4 w-full mt-4 mb-1 border border-base-color bg-base-color-active-deprecated-f-30">
										<div>
											<span className="font-medium text-base-color">
												{t("contract.view.staff")}:
											</span>{" "}
											{contractQuery?.data?.staff?.name}
										</div>
									</div>

									<div className="mt-4 mb-6">
										{id && (
											<Fragment>
												<div className="payment-history-title my-2 text-lg font-medium text-base-color">
													{t("contract.view.paymentHistory")}
												</div>
												<PaymentHistoryTable
													dataPath={`dictionary/paymentscontract/${id}`}
												/>
											</Fragment>
										)}
									</div>
								</div>
								<div className="actions-box w-[280px] ml-6">
									<div className="p-4 my-shadow-2 rounded-lg flex items-center justify-center">
										<InfoTooltip
											arrow={true}
											placement="top"
											title={t("contract.view.action.refresh")}
										>
											<Button
												variant="action"
												color="info"
												onClick={contractQuery.refetch}
											>
												<i className="bi bi-arrow-repeat" />
											</Button>
										</InfoTooltip>
										<SuccessTooltip
											arrow={true}
											placement="top"
											title={t("contract.view.action.download")}
										>
											<Link
												to={`${process.env.REACT_APP_BACKEND_URL}/doc/${contractQuery?.data?.id}`}
												className="no-underline"
											>
												<Button
													variant="action"
													color="success"
													className="!mx-4"
												>
													<i className="bi bi-download" />
												</Button>
											</Link>
										</SuccessTooltip>
									</div>

									<Button
										color="primary"
										variant="outlined"
										fullWidth
										className="!py-2 !my-4 !h-auto"
										onClick={() => setOpen(true)}
									>
										<div className="flex flex-col">
											<i className="bi bi-bookmarks text-2xl" />
											<span className="text-base">
												{t("contract.view.paymentTable")}
											</span>
										</div>
									</Button>

									<Button
										color="success"
										variant="outlined"
										fullWidth
										className="!py-2 !h-auto !mb-4"
										onClick={() => setUploadPaymentsListOpen(true)}
									>
										<div className="flex flex-col">
											<span className="relative flex items-center justify-center">
												<i className="bi bi-currency-dollar text-lg absolute bottom-0 mr-4 bg-white flex" />
												<i className="bi bi-bookmarks text-2xl" />
											</span>
											<span className="text-base">
												{t("contract.view.action.uploadPaymentTable")}
											</span>
										</div>
									</Button>

									<Button
										color="info"
										variant="outlined"
										fullWidth
										className="!py-2 !h-auto !mb-4"
										onClick={() => setUploadPaymentsHistoryOpen(true)}
									>
										<div className="flex flex-col">
											<span className="relative flex items-center justify-center">
												<i className="bi bi-currency-dollar text-lg absolute bottom-0 mr-4 bg-white flex" />
												<i className="bi bi-bookmarks text-2xl" />
											</span>
											<span className="text-base">
												{t("contract.view.action.uploadPayments")}
											</span>
										</div>
									</Button>

									{contractQuery?.data?.status === "2" && (
										<Button
											color="error"
											variant="contained"
											fullWidth
											className="!mb-4"
										>
											<span>{t("contract.view.completed")}</span>
										</Button>
									)}

									{contractQuery?.data?.status !== "3" &&
										user?.user?.role !== ROLE_TYPE_LIST.MANAGER.code && (
											<Button
												color="error"
												variant="outlined"
												fullWidth
												onClick={() => setCancellationOpen(true)}
											>
												<span>{t("common.button.cancel")}</span>
											</Button>
										)}
								</div>
							</div>
						</div>
					</Fragment>
				)
			)}
			{open && (
				<ContractPaymentSimpleListModal
					open={open}
					setOpen={setOpen}
					data={contractQuery?.data}
					paymentsListQuery={paymentsListQuery}
				/>
			)}

			{openHomeLayoutImageDialog &&
				contractQuery?.data?.homes?.plan &&
				contractQuery?.data?.homes?.plan?.link && (
					<ImagePreviewDialog
						open={openHomeLayoutImageDialog}
						setOpen={setOpenHomeLayoutImageDialog}
						url={contractQuery?.data?.homes?.plan?.link}
					/>
				)}

			{cancellationOpen && (
				<ContractCancellationModal
					open={cancellationOpen}
					setOpen={setCancellationOpen}
					data={contractQuery?.data}
					refetch={contractQuery.refetch}
				/>
			)}

			{uploadPaymentsListOpen && (
				<UploadContractPaymentsListAndHistory
					open={uploadPaymentsListOpen}
					setOpen={setUploadPaymentsListOpen}
					dialogData={{
						title: t(
							"contract.view.uploadPaymentsListAndHistory.title.paymentTable"
						),
						successMsg: t(
							"contract.view.uploadPaymentsListAndHistory.alerts.success.paymentTable"
						),
						path: `paymentlist/${contractQuery?.data?.id}`,
						postValueKey: "list"
					}}
					options={[
						{
							label: t(
								"contract.view.uploadPaymentsListAndHistory.options.paymentSum"
							),
							code: "sum",
							disabled: false
						},
						{
							label: t(
								"contract.view.uploadPaymentsListAndHistory.options.paymentDate"
							),
							code: "date",
							disabled: false
						}
					]}
				/>
			)}

			{uploadPaymentsHistoryOpen && (
				<UploadContractPaymentsListAndHistory
					open={uploadPaymentsHistoryOpen}
					setOpen={setUploadPaymentsHistoryOpen}
					dialogData={{
						title: t(
							"contract.view.uploadPaymentsListAndHistory.title.payments"
						),
						successMsg: t(
							"contract.view.uploadPaymentsListAndHistory.alerts.success.payments"
						),
						path: `payment/${contractQuery?.data?.id}`,
						postValueKey: "payments"
					}}
					options={[
						{
							label: t(
								"contract.view.uploadPaymentsListAndHistory.options.paymentSum"
							),
							code: "sum",
							disabled: false
						},
						{
							label: t(
								"contract.view.uploadPaymentsListAndHistory.options.paymentDate"
							),
							code: "date",
							disabled: false
						},
						{
							label: t(
								"contract.view.uploadPaymentsListAndHistory.options.typeId"
							),
							code: "type_id",
							disabled: false
						}
					]}
				/>
			)}
		</div>
	)
}

export default ContractView
