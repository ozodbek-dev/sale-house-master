import { Button } from "@mui/material"
import SimplePaginationTable from "components/ui/tables/SimplePaginationTable"
import useNavigationByRole from "hooks/useNavigationByRole"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

const Objects = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const { navigateFn } = useNavigationByRole()
	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("object.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [open, setOpen] = useState(false)

	return (
		<div className="component-list-wrapper">
			<div className="component-list-header mb-2">
				<div className="header-actions-container py-3 flex flex-row items-center">
					<div className="header-actions filter-box flex items-center my-shadow-2 rounded-lg px-4 w-full h-14"></div>
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
								navigateFn("/BASE/object/add")
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
				<SimplePaginationTable
					emitRefetch={{ refetch, setRefetch }}
					dataPath="dictionary/objects"
					emitTableColumns={{ open, setOpen }}
					tableName="objects"
					headCells={[
						{ code: "id", label: "#" },
						{ code: "name", label: t("common.table.name") },
						{ code: "regions", label: t("common.table.regionName") },
						{ code: "companies", label: t("common.table.companyName") },
						{ code: "city", label: t("common.table.city") },
						{ code: "address", label: t("common.table.address") },
						{ code: "start", label: t("common.table.startDate") },
						{ code: "end", label: t("common.table.endDate") },
						{ code: "stage", label: t("common.table.homeFloor") },
						{ code: "padez", label: t("common.table.blocksNumber") }
					]}
					columns={[
						{ code: "id" },
						{ code: "name" },
						{ code: "regions", type: "nested", childStr: "name" },
						{ code: "companies", type: "nested", childStr: "name" },
						{ code: "city" },
						{ code: "address" },
						{ code: "start", type: "date" },
						{ code: "end", type: "date" },
						{ code: "stage" },
						{ code: "padez" }
					]}
				/>
			</div>
		</div>
	)
}

export default Objects
