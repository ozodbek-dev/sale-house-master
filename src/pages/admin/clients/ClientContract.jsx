import { Button, Grid } from "@mui/material"
import PaymentHistoryTable from "components/ui/tables/PaymentHistoryTable"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import { Fragment, useState } from "react"
import { Link } from "react-router-dom"
import REPAIR_TYPE from "shared/repairTypeList"
import getLabelByTypeList from "utils/getLabelByTypeList"
import SuccessTooltip from "components/ui/tooltips/SuccessTooltip"
import ContractPaymentListModal from "../contract/ContractPaymentListModal"
import ContractCancellationModal from "../contract/ContractCancellationModal"
import InfoTooltip from "components/ui/tooltips/InfoTooltip"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import useAuth from "hooks/useAuth"
import ImagePreviewDialog from "components/ui/dialogs/ImagePreviewDialog"
import { Trans, useTranslation } from "react-i18next"

const ClientContract = ({ contractData = {}, refetchFn = () => {} }) => {
	const { t } = useTranslation()
	const [open, setOpen] = useState(false)
	const [{ user }] = useAuth()
	const [cancellationOpen, setCancellationOpen] = useState(false)
	const [openHomeLayoutImageDialog, setOpenHomeLayoutImageDialog] =
		useState(false)

	return (
		<div className="component-add-edit-wrapper p-4 my-shadow-2 rounded-lg mt-4">
			{contractData && (
				<Fragment>
					<div className="component-add-edit-header mt-3">
						<Grid
							container
							spacing={{ xs: 2, sm: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, lg: 15 }}
						>
							<Grid item={true} lg={3} sm={6} xs={12}>
								<Button
									color="secondary"
									variant="contained"
									fullWidth
									className="!h-full"
								>
									<div className="flex flex-col p-2">
										<span className="text-lg leading-5 mb-1">
											{t("client.contract.header.sum")}
										</span>
										<span className="text-sm">
											<CurrencyFormat
												value={contractData?.sum}
												suffix={contractData?.isvalute === "1" ? " $" : " UZS"}
											/>
										</span>
									</div>
								</Button>
							</Grid>
							<Grid item={true} lg={3} sm={6} xs={12}>
								<Button
									color="info"
									variant="contained"
									fullWidth
									className="!h-full"
								>
									<div className="flex flex-col p-2">
										<span className="text-lg leading-5 mb-1">
											{t("client.contract.header.startPrice")}
										</span>
										<span className="text-sm">
											<CurrencyFormat
												value={contractData?.start_price}
												suffix={contractData?.isvalute === "1" ? " $" : " UZS"}
											/>
										</span>
									</div>
								</Button>
							</Grid>
							<Grid item={true} lg={3} sm={6} xs={12}>
								<Button
									color="warning"
									variant="contained"
									fullWidth
									className="!h-full"
								>
									<div className="flex flex-col p-2">
										<span className="text-lg leading-5 mb-1">
											<Trans i18nKey="client.contract.header.priceForSquare">
												1 m<sup>2</sup> uchun to'lov miqdori
											</Trans>
										</span>
										<span className="text-sm">
											<CurrencyFormat
												value={contractData?.price}
												suffix={contractData?.isvalute === "1" ? " $" : " UZS"}
											/>
										</span>
									</div>
								</Button>
							</Grid>
							<Grid item={true} lg={3} sm={6} xs={12}>
								<Button
									color="success"
									variant="contained"
									fullWidth
									className="!h-full"
								>
									<div className="flex flex-col p-2">
										<span className="text-lg leading-5 mb-1">
											{t("client.contract.header.discount")}
										</span>
										<span className="text-sm">
											<CurrencyFormat
												value={contractData?.discount}
												suffix={contractData?.isvalute === "1" ? " $" : " UZS"}
											/>
										</span>
									</div>
								</Button>
							</Grid>
							<Grid item={true} lg={3} sm={6} xs={12}>
								<Button
									color="error"
									variant="contained"
									fullWidth
									className="!h-full"
								>
									<div className="flex flex-col p-2">
										<span className="text-lg leading-5 mb-1">
											{t("client.contract.header.leftPrice")}
										</span>
										<span className="text-sm">
											<CurrencyFormat
												value={contractData?.left}
												allowNegative={true}
												suffix={contractData?.isvalute === "1" ? " $" : " UZS"}
											/>
										</span>
									</div>
								</Button>
							</Grid>
						</Grid>
					</div>
					{contractData?.comment && (
						<div className="contract-comment my-shadow-2 rounded-lg p-4 w-full mt-4 mb-1">
							<div>
								<span className="font-medium text-base-color">
									{t("client.contract.header.comment")}:
								</span>{" "}
								{contractData?.comment}
							</div>
						</div>
					)}
					<div className="component-add-edit-body">
						<div className="py-3 flex flex-row">
							<div className="base-data w-full">
								<div className="home-data flex items-center justify-between my-shadow-2 rounded-lg p-4 w-full mb-4">
									<div className="home-data-item flex flex-col">
										<span className="data-item-title text-base font-medium text-base-color">
											{t("client.contract.homeDetail.objectName")}:
										</span>
										<span className="data-item-value text-base">
											{contractData?.homes?.blocks?.objects?.name}
										</span>
									</div>
									<div className="home-data-item flex flex-col">
										<span className="data-item-title text-base font-medium text-base-color">
											{t("client.contract.homeDetail.blockName")}:
										</span>
										<span className="data-item-value text-base">
											{contractData?.homes?.blocks?.name}
										</span>
									</div>
									<div className="home-data-item flex flex-col">
										<span className="data-item-title text-base font-medium text-base-color">
											{t("client.contract.homeDetail.homeNumber")}:
										</span>
										<span className="data-item-value text-base">
											{contractData?.homes?.number}
										</span>
									</div>
									<div className="home-data-item flex flex-col">
										<span className="data-item-title text-base font-medium text-base-color">
											{t("client.contract.homeDetail.stage")}:
										</span>
										<span className="data-item-value text-base">
											{contractData?.homes?.stage}
										</span>
									</div>
									<div className="home-data-item flex flex-col">
										<span className="data-item-title text-base font-medium text-base-color">
											{t("client.contract.homeDetail.rooms")}:
										</span>
										<span className="data-item-value text-base">
											{contractData?.homes?.rooms}
										</span>
									</div>
									<div className="home-data-item flex flex-col">
										<span className="data-item-title text-base font-medium text-base-color">
											{t("client.contract.homeDetail.area")}:
										</span>
										<span className="data-item-value text-base">
											{contractData?.homes?.square}{" "}
											<Trans i18nKey="common.global.meter">
												m<sup>2</sup>
											</Trans>
										</span>
									</div>
									<div className="home-data-item flex flex-col">
										<span className="data-item-title text-base font-medium text-base-color">
											{t("client.contract.homeDetail.isrepaired")}:
										</span>
										<span className="data-item-value text-base">
											{getLabelByTypeList(
												REPAIR_TYPE,
												contractData?.isrepaired
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
														contractData?.homes?.plan &&
														contractData?.homes?.plan?.link
													)
												}
												onClick={() => setOpenHomeLayoutImageDialog(true)}
											>
												<i className="bi bi-image text-lg" />
											</Button>
										</span>
									</div>
								</div>

								<div className="contract-staff-details my-shadow-2 rounded-lg p-4 w-full mt-4 mb-1 border border-base-color bg-base-color-active-deprecated-f-30">
									<div>
										<span className="font-medium text-base-color">
											{t("client.contract.staff")}:
										</span>{" "}
										{contractData?.staff?.name}
									</div>
								</div>

								<div className="mt-4 mb-6">
									{contractData?.id && (
										<Fragment>
											<div className="payment-history-title my-2 text-lg font-medium text-base-color">
												{t("client.contract.paymentHistory")}
											</div>
											<PaymentHistoryTable
												dataPath={`dictionary/paymentscontract/${contractData?.id}`}
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
										title={t("client.contract.action.refresh")}
									>
										<Button variant="action" color="info" onClick={refetchFn}>
											<i className="bi bi-arrow-repeat" />
										</Button>
									</InfoTooltip>
									<SuccessTooltip
										arrow={true}
										placement="top"
										title={t("client.contract.action.download")}
									>
										<Link
											to={`${process.env.REACT_APP_BACKEND_URL}/doc/${contractData?.id}`}
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
											{t("client.contract.paymentTable")}
										</span>
									</div>
								</Button>

								{contractData?.status === "2" && (
									<Button
										color="error"
										variant="contained"
										fullWidth
										className="!mb-4"
									>
										<span>{t("client.contract.completed")}</span>
									</Button>
								)}

								{contractData?.status !== "3" &&
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
			)}
			{open && (
				<ContractPaymentListModal
					open={open}
					setOpen={setOpen}
					data={contractData}
				/>
			)}

			{openHomeLayoutImageDialog &&
				contractData?.homes?.plan &&
				contractData?.homes?.plan?.link && (
					<ImagePreviewDialog
						open={openHomeLayoutImageDialog}
						setOpen={setOpenHomeLayoutImageDialog}
						url={contractData?.homes?.plan?.link}
					/>
				)}

			{cancellationOpen && (
				<ContractCancellationModal
					open={cancellationOpen}
					setOpen={setCancellationOpen}
					data={contractData}
					refetch={refetchFn}
				/>
			)}
		</div>
	)
}

export default ClientContract
