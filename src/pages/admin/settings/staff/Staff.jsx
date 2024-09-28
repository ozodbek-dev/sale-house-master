import { Button } from "@mui/material"
import BaseTable from "components/ui/tables/BaseTable"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import StaffAddEditModal from "./StaffAddEditModal"
import { roleTypeVariants } from "shared/tableColVariantsList"
import SimpleSearchInput from "components/SimpleSearchInput"
import { useTranslation } from "react-i18next"

const Staff = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("settings.staff.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [openStaffModal, setOpenStaffModal] = useState(false)
	const [open, setOpen] = useState(false)
	const [itemId, setItemId] = useState("")

	return (
		<div className="component-list-wrapper">
			<div className="component-list-header mb-2">
				<div className="header-actions-container py-3 flex flex-row items-center">
					<div className="header-actions filter-box flex items-center my-shadow-2 rounded-lg px-4 w-full">
						<Button
							variant="filterOutlined"
							color="primary"
							startIcon={<i className="bi bi-filter" />}
							className="!mr-2"
						>
							{t("common.button.filter")}
						</Button>
						<SimpleSearchInput />
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
							onClick={() => setOpenStaffModal(true)}
						>
							<i className="bi bi-plus-circle" />
						</Button>
						<Button
							variant="action"
							color="default"
							onClick={() => setOpen(true)}
						>
							<i className="bi bi-gear" />
						</Button>
					</div>
				</div>
			</div>

			<div className="component-table-wrapper">
				<BaseTable
					emitRefetch={{ refetch, setRefetch }}
					dataPath="admin/staff/index"
					emitTableColumns={{ open, setOpen }}
					tableName="staff"
					headCells={[
						{ code: "name", label: t("common.table.staffName") },
						{ code: "login", label: t("common.table.login") },
						{ code: "role", label: t("common.table.staffRole") }
					]}
					columns={[
						{ code: "name" },
						{ code: "login" },
						{
							code: "role",
							type: "customStatus",
							variants: roleTypeVariants
						}
					]}
					actionModalEdit={{
						setOpen: setOpenStaffModal,
						setItemId: setItemId
					}}
				/>
			</div>
			{openStaffModal && (
				<StaffAddEditModal
					open={openStaffModal}
					setOpen={setOpenStaffModal}
					itemId={itemId}
					setItemId={setItemId}
					setRefetch={setRefetch}
				/>
			)}
		</div>
	)
}

export default Staff
