import { Button, Chip, Divider } from "@mui/material"
import ImagePreviewDialog from "components/ui/dialogs/ImagePreviewDialog"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import useNavigationByRole from "hooks/useNavigationByRole"
import OrderAddModal from "pages/admin/order/OrderAddModal"
import { Fragment, useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"
import { Link } from "react-router-dom"
import HOME_TYPE from "shared/homeTypeList"
import {
	homeTypeVariants,
	repairTypeVariants,
	residentTypeVariants
} from "shared/tableColVariantsList"

const ShaxmatkaHomeDetail = ({
	selectedHome = [],
	blocks = [],
	refetchFn = () => {},
	orderHome = false,
	showContract = false,
	onlyHomeDetails = false
}) => {
	const { linkFn } = useNavigationByRole()
	const { t } = useTranslation()
	const [homeData, setHomeData] = useState({})
	const [blockName, setBlockName] = useState({})
	const [refetch, setRefetch] = useState(false)
	const [openOrderModal, setOpenOrderModal] = useState(false)
	const [openHomeLayoutImageDialog, setOpenHomeLayoutImageDialog] =
		useState(false)

	useEffect(() => {
		if (selectedHome.length > 0 && blocks.length > 0) {
			setHomeData(
				blocks[selectedHome[0].blockIndex].homes.find(
					(item) => item.id === selectedHome[0].id
				)
			)
			setBlockName(blocks[selectedHome[0].blockIndex]?.name)
		}
	}, [selectedHome])

	useEffect(() => {
		if (refetch) {
			refetchFn()
			setRefetch(false)
		}
	}, [refetch])

	const setHomeType = (item, typeArr) => {
		let result = typeArr.filter((variant) => variant.code === item)
		if (result.length > 0) {
			return (
				<Chip
					label={t(result[0].label)}
					variant="tableBadge"
					color={result[0].color}
				/>
			)
		}
		return ""
	}

	return (
		<div className="sheet-actions-home-detail-wrapper">
			{blockName && Object.keys(homeData).length > 0 && (
				<Fragment>
					<div className="home-detail-header">
						<div className="home-detail-title">
							{t("shaxmatka.homeDetail.title", {
								blockName: blockName,
								homeNumber: homeData?.number
							})}
						</div>
					</div>
					<div className="home-detail-body">
						{homeData?.plan && homeData?.plan?.link ? (
							<div className="home-detail home-image-wrapper">
								<img
									src={`${process.env.REACT_APP_BACKEND_URL}/${homeData?.plan?.link}`}
									alt={homeData?.plan?.name || "home-image"}
								/>
								<Button
									type="button"
									initial="hidden"
									animate="show"
									viewport={{ once: true, amount: 0.25 }}
									variant="action"
									className="home-image-view-btn"
									onClick={() => setOpenHomeLayoutImageDialog(true)}
								>
									<i className="bi bi-image" />
								</Button>
							</div>
						) : (
							<div className="home-detail home-image-wrapper">
								<img
									src={require("assets/images/placeholder-image.jpg")}
									alt="placeholder-image"
								/>
							</div>
						)}

						{!onlyHomeDetails && homeData?.contract?.id && (
							<Fragment>
								<div className="home-detail">
									<div className="home-detail-item">
										{t("shaxmatka.homeDetail.contractNumber")}:
									</div>
									<div className="home-detail-item-value">
										{homeData?.contract?.name || "—"}
									</div>
								</div>
								<Divider />
								<div className="home-detail">
									<div className="home-detail-item">
										{t("shaxmatka.homeDetail.custom")}:
									</div>
									<div className="home-detail-item-value">
										{homeData?.contract?.custom ? (
											<Link
												to={linkFn(
													`/BASE/client/view/${homeData.contract.custom?.id}`
												)}
												className="underline font-medium"
											>
												{homeData.contract.custom?.surname}{" "}
												{homeData.contract.custom?.name}
											</Link>
										) : (
											"—"
										)}
									</div>
								</div>
								<Divider />
								<div className="home-detail">
									<div className="home-detail-item">
										{t("shaxmatka.homeDetail.phone")}:
									</div>
									<div className="home-detail-item-value">
										{homeData?.contract?.custom?.phone ? (
											<PhoneFormat value={homeData.contract.custom.phone} />
										) : (
											"—"
										)}
									</div>
								</div>
								<Divider />
								{homeData?.contract?.custom?.phone2 && (
									<Fragment>
										<div className="home-detail">
											<div className="home-detail-item">
												{t("shaxmatka.homeDetail.phone2")}:
											</div>
											<div className="home-detail-item-value">
												<PhoneFormat value={homeData.contract.custom.phone2} />
											</div>
										</div>
										<Divider />
									</Fragment>
								)}
							</Fragment>
						)}

						<div className="home-detail">
							<div className="home-detail-item">
								{t("shaxmatka.homeDetail.homeNumber")}:
							</div>
							<div className="home-detail-item-value">
								{homeData?.number || "—"}
							</div>
						</div>
						<Divider />
						<div className="home-detail">
							<div className="home-detail-item">
								{t("shaxmatka.homeDetail.stage")}:
							</div>
							<div className="home-detail-item-value">
								{homeData?.stage || "—"}
							</div>
						</div>
						<Divider />
						<div className="home-detail">
							<div className="home-detail-item">
								{t("shaxmatka.homeDetail.rooms")}:
							</div>
							<div className="home-detail-item-value">
								{homeData?.rooms || "—"}
							</div>
						</div>
						<Divider />

						{!onlyHomeDetails && homeData?.contract?.id ? (
							<Fragment>
								<div className="home-detail">
									<div className="home-detail-item">
										{t("shaxmatka.homeDetail.areaAll")}:
									</div>
									<div className="home-detail-item-value">
										{homeData?.contract?.square ? (
											<>
												<NumericFormat
													value={homeData?.contract?.square}
													allowNegative={false}
													displayType={"text"}
													decimalScale={2}
													className="w-full text-right"
												/>{" "}
												<Trans i18nKey="common.global.meter">
													m<sup>2</sup>
												</Trans>
											</>
										) : (
											"—"
										)}
									</div>
								</div>
								<Divider />
								<div className="home-detail">
									<div className="home-detail-item">
										<Trans i18nKey="shaxmatka.homeDetail.priceForSquare">
											m<sup>2</sup> narxi
										</Trans>
										:
									</div>
									<div className="home-detail-item-value">
										{homeData?.contract?.sum &&
										homeData?.contract?.discount &&
										homeData?.contract?.square ? (
											<CurrencyFormat
												value={
													(parseFloat(homeData.contract.sum) -
														parseFloat(homeData.contract.discount)) /
													parseFloat(homeData.contract.square)
												}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
												decimalScale={1}
											/>
										) : (
											"—"
										)}
									</div>
								</div>
								<Divider />
								<div className="home-detail">
									<div className="home-detail-item">
										{t("shaxmatka.homeDetail.startPrice")}:
									</div>
									<div className="home-detail-item-value">
										{homeData?.contract?.start_price ? (
											<CurrencyFormat
												value={homeData.contract.start_price}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
												decimalScale={1}
											/>
										) : (
											"—"
										)}
									</div>
								</div>
							</Fragment>
						) : (
							<Fragment>
								<div className="home-detail">
									<div className="home-detail-item">
										{t("shaxmatka.homeDetail.areaAll")}:
									</div>
									<div className="home-detail-item-value">
										{homeData?.square ? (
											<>
												<NumericFormat
													value={homeData?.square}
													allowNegative={false}
													displayType={"text"}
													decimalScale={2}
													className="w-full text-right"
												/>{" "}
												<Trans i18nKey="common.global.meter">
													m<sup>2</sup>
												</Trans>
											</>
										) : (
											"—"
										)}
									</div>
								</div>
								<Divider />
								<div className="home-detail">
									<div className="home-detail-item">
										<Trans i18nKey="shaxmatka.homeDetail.repaired">
											m<sup>2</sup> ta'mirli
										</Trans>
										:
									</div>
									<div className="home-detail-item-value">
										{homeData?.repaired ? (
											<CurrencyFormat
												value={homeData.repaired}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
												decimalScale={1}
											/>
										) : (
											"—"
										)}
									</div>
								</div>
								<Divider />
								<div className="home-detail">
									<div className="home-detail-item">
										<Trans i18nKey="shaxmatka.homeDetail.norepaired">
											m<sup>2</sup> ta'mirsiz
										</Trans>
										:
									</div>
									<div className="home-detail-item-value">
										{homeData?.norepaired ? (
											<CurrencyFormat
												value={homeData.norepaired}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
												decimalScale={1}
											/>
										) : (
											"—"
										)}
									</div>
								</div>
								<Divider />
								<div className="home-detail">
									<div className="home-detail-item">
										{t("shaxmatka.homeDetail.startPrice")}:
									</div>
									<div className="home-detail-item-value">
										{homeData?.start ? (
											<CurrencyFormat
												value={homeData.start}
												suffix={homeData?.isvalute === "1" ? " $" : " UZS"}
												decimalScale={1}
											/>
										) : (
											"—"
										)}
									</div>
								</div>
							</Fragment>
						)}

						<Divider />
						<div className="home-detail">
							<div className="home-detail-item">
								{t("shaxmatka.homeDetail.residentType")}:
							</div>
							<div className="home-detail-item-value">
								{homeData?.islive
									? setHomeType(homeData.islive, residentTypeVariants)
									: "—"}
							</div>
						</div>
						<Divider />
						<div className="home-detail">
							<div className="home-detail-item">
								{t("shaxmatka.homeDetail.repairType")}:
							</div>
							<div className="home-detail-item-value">
								{homeData?.isrepaired
									? setHomeType(homeData.isrepaired, repairTypeVariants)
									: "—"}
							</div>
						</div>
						<Divider />
						<div className="home-detail">
							<div className="home-detail-item">
								{t("shaxmatka.homeDetail.position")}:
							</div>
							<div className="home-detail-item-value">
								{homeData?.status
									? setHomeType(homeData.status, homeTypeVariants)
									: "—"}
							</div>
						</div>
					</div>
					{orderHome &&
						homeData?.status &&
						homeData.status === HOME_TYPE.ACTIVE.code && (
							<div className="mt-8">
								<Button
									color="success"
									variant="contained"
									fullWidth
									onClick={() => setOpenOrderModal(true)}
								>
									{t("shaxmatka.homeDetail.orderHome")}
								</Button>
							</div>
						)}
					{showContract && homeData?.contract && homeData?.contract?.id && (
						<div className="mt-8">
							<Link
								to={linkFn(`/BASE/contract/view/${homeData.contract.id}`)}
								className="no-underline"
							>
								<Button color="info" variant="outlined" fullWidth>
									{t("shaxmatka.homeDetail.goToContract")}
								</Button>
							</Link>
						</div>
					)}
				</Fragment>
			)}

			{openOrderModal && (
				<OrderAddModal
					open={openOrderModal}
					setOpen={setOpenOrderModal}
					data={homeData}
					setRefetch={setRefetch}
				/>
			)}

			{openHomeLayoutImageDialog && (
				<ImagePreviewDialog
					open={openHomeLayoutImageDialog}
					setOpen={setOpenHomeLayoutImageDialog}
					url={homeData?.plan?.link}
				/>
			)}
		</div>
	)
}

export default ShaxmatkaHomeDetail
