import { Button } from "@mui/material"
import SearchInput from "components/SearchInput"
import SimpleSearchTable from "components/ui/tables/SimpleSearchTable"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { clientTypeVariants } from "shared/tableColVariantsList"

const Arrears = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("arrear.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [open, setOpen] = useState(false)

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
							className="!mr-2"
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
							color="default"
							onClick={() => setOpen(true)}
						>
							<i className="bi bi-gear" />
						</Button>
					</div>
				</div>
			</div>

			<div className="component-table-wrapper">
				<SimpleSearchTable
					emitRefetch={{ refetch, setRefetch }}
					dataPath="dictionary/debitors"
					emitTableColumns={{ open, setOpen }}
					tableName="arrears"
					headCells={[
						{ code: "name", label: t("common.table.contractName") },
						{ code: "homes", label: t("common.table.homeNumber") },
						{ code: "custom", label: t("common.table.custom") },
						{ code: "client_type", label: t("common.table.clientType") },
						{ code: "square", label: t("common.table.square") },
						{
							code: "price",
							label: t("common.table.priceForSquare")
						},
						{ code: "sum", label: t("common.table.contractSum") },
						{ code: "start_price", label: t("common.table.startPrice") },
						{ code: "left", label: t("common.table.arrear") },
						{ code: "peniya", label: t("common.table.penalty") },
						{ code: "date", label: t("common.table.date") }
					]}
					columns={[
						{ code: "name" },
						{ code: "homes", type: "nested", childStr: "number" },
						{
							code: "custom",
							type: "nestedChain",
							childStrings: ["surname", "name", "middlename"]
						},
						{
							code: "client_type",
							type: "customStatus",
							variants: clientTypeVariants
						},
						{ code: "square", type: "area" },
						{ code: "price", type: "priceCurrency" },
						{ code: "sum", type: "priceCurrency" },
						{ code: "start_price", type: "priceCurrency" },
						{ code: "left", type: "priceCurrency" },
						{ code: "peniya", type: "priceCurrency" },
						{ code: "date", type: "date" }
					]}
				/>
			</div>
		</div>
	)
}

export default Arrears
