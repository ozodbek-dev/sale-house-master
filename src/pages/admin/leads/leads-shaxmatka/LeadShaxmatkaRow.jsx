import { ButtonBase, CircularProgress, Fab, Grid } from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useLead from "hooks/useLead"
import useNotification from "hooks/useNotification"
import React, { Fragment, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { NumericFormat } from "react-number-format"
import REPAIR_TYPE from "shared/repairTypeList"

const LeadShaxmatkaRow = ({
	homesData,
	blockIndex,
	floorNumber,
	size,
	toggleSelectionItem = () => {}
}) => {
	const { leadData } = useLead()
	const axiosPrivate = useAxiosPrivate()
	const sendNotification = useNotification()

	/* const handleSetHomeToLead = async (homeId) => {
		if (leadData && leadData.id && user && user.user?.id && !isSubmitting) {
			try {
				setIsSubmitting(true)
				let values = {
					lead_id: leadData.id,
					home_id: homeId,
					user_id: user.user?.id
				}
				const response = await axiosPrivate.post(
					"/operator/lead/addhome",
					JSON.stringify(values),
					{
						headers: { "Content-Type": "application/json" }
					}
				)
				console.log("response = ", response)
			} catch (error) {
				sendNotification({
					msg: error?.response?.data?.message || error?.message,
					variant: "error"
				})
				setIsSubmitting(false)
			}
		}
	} */

	return (
		<Fragment>
			<Grid
				container
				rowSpacing={1}
				columns={{
					xs: parseInt(size),
					sm: parseInt(size)
				}}
				key={`container-${floorNumber}`}
				className="sheet-home-row"
			>
				<Grid item={true} sm={1} xs={1}>
					<ButtonBase className="sheet-home-row-floor h-full w-8 !-ml-3 !mr-1 text-sm font-medium">
						{floorNumber}
					</ButtonBase>
				</Grid>
				{homesData.filter((home) => home.stage === floorNumber).length > 0
					? homesData
							.filter((home) => home.stage === floorNumber)
							.map((item) => (
								<Grid
									item={true}
									sm={1}
									xs={1}
									key={`home-${item.id}`}
									className={`sheet-home-cell !min-w-[160px] floor-${floorNumber}`}
								>
									<ButtonBase
										className={`block-${blockIndex}-home !max-w-[150px] home-item status-${
											item.status
										}${item.disabled ? " is-disabled" : ""}`}
										id={`home-${item.id}`}
										onClick={() => toggleSelectionItem(item.id, blockIndex)}
									>
										{!(item.stage && parseInt(item.stage) < 0) ? (
											<Fragment>
												<div className="home-item-data">
													<span className="whitespace-nowrap">
														№: {item.number}
													</span>
													{item.isrepaired === REPAIR_TYPE.REPAIRED.code ? (
														<NumericFormat
															value={item.repaired || ""}
															allowNegative={false}
															displayType={"text"}
															thousandSeparator={" "}
															decimalScale={1}
															className="w-full text-right"
															suffix={item?.isvalute === "1" ? " $" : ""}
														/>
													) : (
														<NumericFormat
															value={item.norepaired || ""}
															allowNegative={false}
															displayType={"text"}
															thousandSeparator={" "}
															decimalScale={1}
															className="w-full text-right"
															suffix={item?.isvalute === "1" ? " $" : ""}
														/>
													)}
												</div>
												<div className="home-item-data">
													{item.isrepaired === REPAIR_TYPE.REPAIRED.code ? (
														<NumericFormat
															value={
																item.repaired && item.square
																	? item.repaired * item.square
																	: 0
															}
															allowNegative={false}
															displayType={"text"}
															thousandSeparator={" "}
															decimalScale={1}
															className="w-full text-center"
															suffix={item?.isvalute === "1" ? " $" : " UZS"}
														/>
													) : (
														<NumericFormat
															value={
																item.norepaired && item.square
																	? item.norepaired * item.square
																	: 0
															}
															allowNegative={false}
															displayType={"text"}
															thousandSeparator={" "}
															decimalScale={1}
															className="w-full text-center"
															suffix={item?.isvalute === "1" ? " $" : " UZS"}
														/>
													)}
												</div>
												<div className="home-item-data">
													<span>{item.rooms}x</span>
													<span>
														<NumericFormat
															value={item?.square}
															allowNegative={false}
															displayType={"text"}
															decimalScale={2}
															className="w-full text-right"
														/>{" "}
														<Trans i18nKey="common.global.meter">
															m<sup>2</sup>
														</Trans>
													</span>
												</div>
											</Fragment>
										) : (
											<div className="h-[68px] flex items-center justify-center text-xl">
												P
											</div>
										)}
									</ButtonBase>
									<LeadShaxmatkaRowCellHomeAdd
										leadId={leadData?.id}
										homeId={item.id}
										axios={axiosPrivate}
										sendNotification={sendNotification}
									/>
									{/* <Fab
										color="success"
										aria-label="add"
										className="!h-6 !w-6 !min-h-[24px] !min-w-[24px] !-top-[0.2rem] !-right-[0.2rem] !absolute"
										onClick={() => handleSetHomeToLead(item.id)}
									>
										{isSubmitting ? (
											<CircularProgress size={10} color="inherit" />
										) : (
											<i className="bi bi-plus flex" />
										)}
									</Fab> */}
									{/* <div className="bg-green-700 text-white rounded-full h-6 w-6 -top-[0.2rem] -right-[0.2rem] absolute flex items-center justify-center z-10">
										<i className="bi bi-plus" />
									</div> */}
								</Grid>
							))
					: [1].map((item) => (
							<Grid
								item={true}
								sm={1}
								xs={1}
								key={`home-empty-${item}`}
								className={`sheet-home-cell sheet-home-empty-cell floor-${floorNumber}`}
							>
								<ButtonBase className="home-item is-empty">
									<div className="home-item-data"></div>
								</ButtonBase>
							</Grid>
					  ))}
			</Grid>
		</Fragment>
	)
}

const LeadShaxmatkaRowCellHomeAdd = ({
	leadId = null,
	homeId = null,
	axios = () => {},
	sendNotification = () => {}
}) => {
	const { t } = useTranslation()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSetHomeToLead = async () => {
		if (leadId && !isSubmitting && axios) {
			try {
				setIsSubmitting(true)
				let values = {
					home_id: homeId
				}
				const response = await axios.post(
					`/operator/lead/addhome/${leadId}`,
					JSON.stringify(values),
					{
						headers: { "Content-Type": "application/json" }
					}
				)
				if (response.data && response.data.status) {
					sendNotification({
						msg: t("lead.shaxmatka.alerts.success"),
						variant: "success"
					})
				}
				setIsSubmitting(false)
			} catch (error) {
				sendNotification({
					msg: error?.response?.data?.message || error?.message,
					variant: "error"
				})
				setIsSubmitting(false)
			}
		} else {
			sendNotification({
				msg: t("lead.shaxmatka.alerts.warning"),
				variant: "warning"
			})
		}
	}

	return (
		<Fab
			color="success"
			aria-label="add"
			className="!h-6 !w-6 !min-h-[24px] !min-w-[24px] !-top-[0.2rem] !-right-[0.2rem] !absolute"
			onClick={() => handleSetHomeToLead()}
			disabled={isSubmitting}
		>
			{isSubmitting ? (
				<CircularProgress size={10} color="inherit" />
			) : (
				<i className="bi bi-plus flex" />
			)}
		</Fab>
	)
}

export default LeadShaxmatkaRow
