import { ButtonBase, Grid } from "@mui/material"
import React, { Fragment } from "react"
import { Trans } from "react-i18next"
import { NumericFormat } from "react-number-format"
import REPAIR_TYPE from "shared/repairTypeList"

const ShaxmatkaRow = ({
	homesData,
	blockIndex,
	floorNumber,
	size,
	toggleSelectionItem = () => {}
}) => {
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
							.map((item) =>
								item?.contract?.id ? (
									<Grid
										item={true}
										sm={1}
										xs={1}
										key={`home-${item.id}`}
										className={`sheet-home-cell floor-${floorNumber}`}
									>
										<ButtonBase
											className={`block-${blockIndex}-home home-item status-${
												item.status
											}${item.disabled ? " is-disabled" : ""}`}
											id={`home-${item.id}`}
											onClick={() => toggleSelectionItem(item.id, blockIndex)}
										>
											{!(item.stage && parseInt(item.stage) < 0) ? (
												<Fragment>
													<div className="home-item-data">
														<span className="whitespace-nowrap mr-1">
															№: {item.number}
														</span>
														{item?.contract?.sum &&
															item?.contract?.discount &&
															item?.contract?.square && (
																<NumericFormat
																	value={
																		(parseFloat(item.contract.sum) -
																			parseFloat(item.contract.discount)) /
																		parseFloat(item.contract.square)
																	}
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
														{item?.contract?.sum &&
															item?.contract?.discount && (
																<NumericFormat
																	value={
																		item.contract.sum - item.contract.discount
																	}
																	allowNegative={false}
																	displayType={"text"}
																	thousandSeparator={" "}
																	decimalScale={1}
																	className="w-full text-center"
																	suffix={
																		item?.isvalute === "1" ? " $" : " UZS"
																	}
																/>
															)}
													</div>
													<div className="home-item-data">
														<span>{item.rooms}x</span>
														<span>
															<NumericFormat
																value={item?.contract?.square}
																allowNegative={false}
																displayType={"text"}
																decimalScale={2}
																className="w-full text-right"
															/>
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
									</Grid>
								) : (
									<Grid
										item={true}
										sm={1}
										xs={1}
										key={`home-${item.id}`}
										className={`sheet-home-cell floor-${floorNumber}`}
									>
										<ButtonBase
											className={`block-${blockIndex}-home home-item status-${
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
									</Grid>
								)
							)
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

export default ShaxmatkaRow
