import { Button } from "@mui/material"
import SearchInput from "components/SearchInput"
import BaseTable from "components/ui/tables/BaseTable"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

const Companies = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("settings.companies.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()

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
							onClick={() => {
								navigate("/admin/settings/company/add")
							}}
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
					dataPath="dictionary/companies"
					emitTableColumns={{ open, setOpen }}
					tableName="companies"
					headCells={[
						{ code: "name", label: t("common.table.name") },
						{ code: "address", label: t("common.table.address") },
						{ code: "director", label: t("common.table.director") }
					]}
					columns={[
						{ code: "name" },
						{ code: "address" },
						{ code: "director" }
					]}
					actionEdit={true}
				/>
			</div>
		</div>
	)
}

export default Companies
