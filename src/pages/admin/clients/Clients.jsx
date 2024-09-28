import { Button } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import SearchInput from "components/SearchInput"
import BaseTable from "components/ui/tables/BaseTable"
import useNavigationByRole from "hooks/useNavigationByRole"
import { clientTypeVariants } from "shared/tableColVariantsList"
import { useTranslation } from "react-i18next"

const Clients = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const { navigateFn } = useNavigationByRole()
	const [refetch, setRefetch] = useState(false)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("client.title")}
			</div>
		)
	}, [i18n.language])

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
							onClick={() => {
								navigateFn("/BASE/client/add")
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
					dataPath="dictionary/customs"
					emitTableColumns={{ open, setOpen }}
					tableName="clients"
					headCells={[
						{ code: "id", label: "#" },
						{ code: "name", label: t("common.table.personName") },
						{ code: "surname", label: t("common.table.surname") },
						{ code: "middlename", label: t("common.table.middleName") },
						{ code: "phone", label: t("common.table.phone") },
						{ code: "client_type", label: t("common.table.clientType") }
					]}
					columns={[
						{ code: "id" },
						{ code: "name" },
						{ code: "surname" },
						{ code: "middlename" },
						{ code: "phone" },
						{
							code: "client_type",
							type: "customStatus",
							variants: clientTypeVariants
						}
					]}
					actionInfo={true}
				/>
			</div>
		</div>
	)
}

export default Clients
