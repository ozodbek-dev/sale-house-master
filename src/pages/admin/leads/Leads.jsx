import { Button, Tab, Tabs } from "@mui/material"
import SearchInput from "components/SearchInput"
import BaseTable from "components/ui/tables/BaseTable"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import useNotification from "hooks/useNotification"
import useLead from "hooks/useLead"
import LeadAddEditModal from "./LeadAddEditModal"
import useNavigationByRole from "hooks/useNavigationByRole"
import LeadCommentModal from "./LeadCommentModal"
import { useTranslation } from "react-i18next"

const Leads = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const { navigateFn } = useNavigationByRole()
	const { leadData, setLeadData } = useLead()
	const sendNotification = useNotification()
	const [refetch, setRefetch] = useState(false)
	const [tabValue, setTabValue] = useState("1")
	const [open, setOpen] = useState(false)
	const [openAddEditModal, setOpenAddEditModal] = useState(false)
	const [openCommentModal, setOpenCommentModal] = useState(false)
	const [itemId, setItemId] = useState("")

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("lead.title")}
			</div>
		)
	}, [i18n.language])

	const getDataFn = (data) => {
		setLeadData(data)
		// console.log("leadData = ", leadData)
		sendNotification({
			msg: t("lead.alerts.success.copy"),
			variant: "success"
		})
		// console.log("getDataFn data = ", data)
	}

	return (
		<div className="component-list-wrapper">
			<div className="component-list-header mb-2">
				<div className="header-actions-container py-3 flex flex-row items-center">
					<div className="header-actions filter-box flex items-center my-shadow-2 rounded-lg px-4 w-full">
						<SearchInput inputKey="name" />
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
						<Button
							variant="action"
							color="success"
							className="!mx-2"
							onClick={() => setOpenAddEditModal(true)}
						>
							<i className="bi bi-plus-circle" />
						</Button>
						<Button
							variant="action"
							color="secondary"
							onClick={() => {
								navigateFn("/BASE/lead/shaxmatka")
							}}
						>
							<i className="bi bi-grid-3x3-gap" />
						</Button>
					</div>
				</div>
			</div>

			<div className="component-table-wrapper">
				<Tabs
					value={tabValue}
					onChange={(event, newValue) => setTabValue(newValue)}
					className="leads-tabs"
				>
					<Tab label={t("lead.tab.base")} value="1" />
					<Tab label={t("lead.tab.bought")} value="2" />
					<Tab label={t("lead.tab.cancelled")} value="0" />
				</Tabs>

				<div className="mt-3">
					{tabValue === "1" && (
						<BaseTable
							emitRefetch={{ refetch, setRefetch }}
							dataPath="dictionary/leads"
							dataPathQuery={{ type: "1" }}
							emitTableColumns={{ open, setOpen }}
							tableName="leadsBase"
							headCells={[
								{ code: "id", label: "#" },
								{ code: "name", label: t("common.fields.name") },
								{ code: "phone", label: t("common.fields.phone") },
								{ code: "date", label: t("common.fields.date") }
							]}
							columns={[
								{ code: "id" },
								{ code: "name" },
								{ code: "phone" },
								{ code: "date", type: "date" }
							]}
							actionDone={{
								link: "operator/lead/done",
								successMsg: t("lead.alerts.success.accept"),
								hasTooltip: true,
								tooltipProps: {
									title: t("lead.action.acceptBought"),
									enterDelay: 1000,
									leaveDelay: 0
								}
							}}
							actionSendMessage={{
								setOpen: setOpenCommentModal,
								setItemId: setItemId,
								hasTooltip: true,
								tooltipProps: {
									title: t("lead.action.writeComment"),
									enterDelay: 1000,
									leaveDelay: 0
								}
							}}
							actionReject={{
								link: "operator/lead/reject",
								successMsg: t("lead.alerts.success.cancelled"),
								hasTooltip: true,
								tooltipProps: {
									title: t("lead.action.acceptCancellation"),
									enterDelay: 1000,
									leaveDelay: 0
								}
							}}
							actionCopyRowData={{
								handlerFn: getDataFn,
								hasTooltip: true,
								tooltipProps: {
									title: t("lead.action.currentLead"),
									enterDelay: 1000,
									leaveDelay: 0
								}
							}}
							actionModalEdit={{
								setOpen: setOpenAddEditModal,
								setItemId: setItemId
							}}
							actionInfo={true}
						/>
					)}

					{tabValue === "2" && (
						<BaseTable
							emitRefetch={{ refetch, setRefetch }}
							dataPath="dictionary/leads"
							dataPathQuery={{ type: "2" }}
							emitTableColumns={{ open, setOpen }}
							tableName="leadsHomeBought"
							headCells={[
								{ code: "id", label: "#" },
								{ code: "name", label: t("common.fields.name") },
								{ code: "phone", label: t("common.fields.phone") },
								{ code: "date", label: t("common.fields.date") }
							]}
							columns={[
								{ code: "id" },
								{ code: "name" },
								{ code: "phone" },
								{ code: "date", type: "date" }
							]}
							actionInfo={true}
						/>
					)}

					{tabValue === "0" && (
						<BaseTable
							emitRefetch={{ refetch, setRefetch }}
							dataPath="dictionary/leads"
							dataPathQuery={{ type: "0" }}
							emitTableColumns={{ open, setOpen }}
							tableName="leadsCancelled"
							headCells={[
								{ code: "id", label: "#" },
								{ code: "name", label: t("common.fields.name") },
								{ code: "phone", label: t("common.fields.phone") },
								{ code: "date", label: t("common.fields.date") }
							]}
							columns={[
								{ code: "id" },
								{ code: "name" },
								{ code: "phone" },
								{ code: "date", type: "date" }
							]}
							actionInfo={true}
						/>
					)}
				</div>

				{/* <Grid
					container
					spacing={1}
					rowSpacing={1}
					columns={{ xs: 12, sm: 12, lg: 12 }}
				>
					<Grid item={true} lg={4} sm={6} xs={12}>
						<div>
							<div className="type-title text-lg font-medium text-center mb-2">
								Boshlang'ich
							</div>
							<div className="type-table-wrapper">
								<BaseTable
									emitRefetch={{ refetch, setRefetch }}
									dataPath="dictionary/leads?type=ACTIVE"
									emitTableColumns={{ open, setOpen }}
									tableName="leadsBase"
									headCells={[
										{ code: "id", label: "#" },
										{ code: "name", label: t("common.fields.name") },
										{ code: "phone", label: t("common.fields.phone") },
										{ code: "date", label: t("common.fields.date") }
									]}
									columns={[
										{ code: "id" },
										{ code: "name" },
										{ code: "phone" },
										{ code: "date", type: "date" }
									]}
									actionCopyRowData={{
										handlerFn: getDataFn
									}}
									actionModalEdit={{
										setOpen: setOpenAddEditModal,
										setItemId: setItemId
									}}
									actionInfo={true}
								/>
							</div>
						</div>
					</Grid>
					<Grid item={true} lg={4} sm={6} xs={12}>
						<div>
							<div className="type-title text-lg font-medium text-center mb-2">
								Uy sotib olgan
							</div>
							<div className="type-table-wrapper">
								<BaseTable
									emitRefetch={{ refetch, setRefetch }}
									dataPath="dictionary/leads?type=COMPLETE"
									emitTableColumns={{ open, setOpen }}
									tableName="leadsHomeBought"
									headCells={[
										{ code: "id", label: "#" },
										{ code: "name", label: t("common.fields.name") },
										{ code: "phone", label: t("common.fields.phone") },
										{ code: "date", label: t("common.fields.date") }
									]}
									columns={[
										{ code: "id" },
										{ code: "name" },
										{ code: "phone" },
										{ code: "date", type: "date" }
									]}
									actionInfo={true}
								/>
							</div>
						</div>
					</Grid>
					<Grid item={true} lg={4} sm={6} xs={12}>
						<div>
							<div className="type-title text-lg font-medium text-center mb-2">
								Bekor qilingan
							</div>
							<div className="type-table-wrapper">
								<BaseTable
									emitRefetch={{ refetch, setRefetch }}
									dataPath="dictionary/leads?type=REJECTED"
									emitTableColumns={{ open, setOpen }}
									tableName="leadsCancelled"
									headCells={[
										{ code: "id", label: "#" },
										{ code: "name", label: t("common.fields.name") },
										{ code: "phone", label: t("common.fields.phone") },
										{ code: "date", label: t("common.fields.date") }
									]}
									columns={[
										{ code: "id" },
										{ code: "name" },
										{ code: "phone" },
										{ code: "date", type: "date" }
									]}
									actionInfo={true}
								/>
							</div>
						</div>
					</Grid>
				</Grid> */}

				{openAddEditModal && (
					<LeadAddEditModal
						open={openAddEditModal}
						setOpen={setOpenAddEditModal}
						itemId={itemId}
						setItemId={setItemId}
						setRefetch={setRefetch}
					/>
				)}

				{openCommentModal && (
					<LeadCommentModal
						open={openCommentModal}
						setOpen={setOpenCommentModal}
						itemId={itemId}
						setItemId={setItemId}
					/>
				)}
			</div>
		</div>
	)
}

export default Leads
