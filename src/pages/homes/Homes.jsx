import { Button, CircularProgress } from "@mui/material"
import BlocksSlider from "components/BlocksSlider"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import HOME_TYPE from "shared/homeTypeList"
import OrderAddModal from "../admin/order/OrderAddModal"
import DashboardFiltersComponent from "components/ui/filters/DashboardFiltersComponent"
import SuccessTooltip from "components/ui/tooltips/SuccessTooltip"
import BaseLightTooltip from "components/ui/tooltips/BaseLightTooltip"
import DashboardTable from "components/ui/tables/DashboardTable"
import InfoTooltip from "components/ui/tooltips/InfoTooltip"
import { useTranslation } from "react-i18next"

const Homes = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const [blockId, setBlockId] = useState("")
	const [blocksError, setBlocksError] = useState(false)
	const [openOrderModal, setOpenOrderModal] = useState(false)
	const [homeData, setHomeData] = useState({})

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("homes.title")}
			</div>
		)
	}, [i18n.language])
	const [refetch, setRefetch] = useState(false)
	const [open, setOpen] = useState(false)
	const [expanded, setExpanded] = useState(false)

	return (
		<div className="component-list-wrapper">
			<BlocksSlider
				blockId={blockId}
				setBlockId={setBlockId}
				setBlocksError={setBlocksError}
			/>
			<div className="component-list-header mb-2">
				<div className="header-actions-container pt-3 pb-2 flex flex-row items-center">
					<div className="header-actions filter-box flex items-center my-shadow-2 rounded-lg px-4 w-full">
						<Button
							variant="filterOutlined"
							color="primary"
							startIcon={<i className="bi bi-filter" />}
							className="!mr-2 !my-2"
							onClick={() => setExpanded((prev) => !prev)}
						>
							{t("common.button.filter")}
						</Button>
					</div>
					<div className="header-actions action-buttons-box py-3 px-4 my-shadow-2 rounded-lg flex items-center justify-center ml-4">
						<Button
							variant="action"
							color="info"
							onClick={() => {
								setRefetch(true)
							}}
							disable={`${refetch}`}
						>
							<i
								className={`bi bi-arrow-repeat${
									refetch ? " animate-spin" : ""
								}`}
							/>
						</Button>
						<SuccessTooltip
							placement="top"
							arrow={true}
							title={t("homes.tooltip.debtsByBlock")}
						>
							<Link
								to={`${process.env.REACT_APP_BACKEND_URL}/debitorsExport/${blockId}`}
								className="no-underline"
							>
								<Button variant="action" color="success" className="!ml-2">
									<i className="bi bi-download" />
								</Button>
							</Link>
						</SuccessTooltip>
						<BaseLightTooltip
							placement="top"
							arrow={true}
							title={t("homes.tooltip.freeHomesByBlock")}
						>
							<Link
								to={`${process.env.REACT_APP_BACKEND_URL}/freehomes/${blockId}`}
								className="no-underline"
							>
								<Button variant="action" color="secondary" className="!ml-2">
									<i className="bi bi-building-down" />
								</Button>
							</Link>
						</BaseLightTooltip>
						<InfoTooltip
							placement="top"
							arrow={true}
							title={t("homes.tooltip.detailsByBlock")}
						>
							<Link
								to={`${process.env.REACT_APP_BACKEND_URL}/information/${blockId}`}
								className="no-underline"
							>
								<Button variant="action" color="info" className="!ml-2">
									<i className="bi bi-database-down" />
								</Button>
							</Link>
						</InfoTooltip>
						<Button
							variant="action"
							color="default"
							className="!ml-2"
							onClick={() => setOpen(true)}
						>
							<i className="bi bi-gear" />
						</Button>
					</div>
				</div>

				{expanded && (
					<div className="my-shadow-2 rounded-lg px-4 w-full mt-3">
						<DashboardFiltersComponent />
					</div>
				)}
			</div>
			<div className="component-table-wrapper flex-auto">
				{blockId ? (
					<DashboardTable
						emitRefetch={{ refetch, setRefetch }}
						emitTableColumns={{ open, setOpen }}
						dataPath={`dictionary/homesblock/${blockId}`}
						actionModal={{
							icon: "bi bi-file-earmark-plus",
							btnColor: "info",
							setOpen: setOpenOrderModal,
							setData: setHomeData,
							nonDisableStatus: {
								code: HOME_TYPE.ACTIVE.code,
								columnCode: "status"
							}
						}}
					/>
				) : !blocksError ? (
					<div className="circular-progress-box">
						<CircularProgress size={30} />
					</div>
				) : (
					<div className="my-6">
						<span className="no-data-found-wrapper">
							<i className="bi bi-exclamation-octagon text-xl mr-1 leading-3" />{" "}
							{t("common.global.noDataFound")}
						</span>
					</div>
				)}
			</div>
			{openOrderModal && (
				<OrderAddModal
					open={openOrderModal}
					setOpen={setOpenOrderModal}
					data={homeData}
					setRefetch={setRefetch}
				/>
			)}
		</div>
	)
}

export default Homes
