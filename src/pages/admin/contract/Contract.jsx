import { Button } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import SearchInput from "components/SearchInput"
import ContractFiltersComponent from "components/ui/filters/ContractFiltersComponent"
import ContractTable from "components/ui/tables/ContractTable"
import useNavigationByRole from "hooks/useNavigationByRole"
import { useTranslation } from "react-i18next"

const Contract = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const { navigateFn } = useNavigationByRole()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("contract.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [open, setOpen] = useState(false)
	const [expanded, setExpanded] = useState(false)

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
							onClick={() => setExpanded((prev) => !prev)}
						>
							{t("common.button.filter")}
						</Button>
						<SearchInput inputKey="name" />
						<div className="ml-auto flex flex-row">
							<div className="flex items-center">
								<div className="w-4 h-4 rounded-sm bg-cyan-200 mr-1"></div>
								{t("contract.completed")}
							</div>
							<div className="flex ml-4 items-center">
								<div className="w-4 h-4 rounded-sm bg-red-300 mr-1"></div>
								{t("contract.cancelled")}
							</div>
						</div>
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
								navigateFn("/BASE/contract/add")
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
				{expanded && (
					<div className="my-shadow-2 rounded-lg px-4 w-full mt-2">
						<ContractFiltersComponent />
					</div>
				)}
			</div>

			<div className="component-table-wrapper">
				<ContractTable
					emitRefetch={{ refetch, setRefetch }}
					dataPath="dictionary/contracts"
					emitTableColumns={{ open, setOpen }}
					tableName="contract"
					actionInfo={true}
				/>
			</div>
		</div>
	)
}

export default Contract
