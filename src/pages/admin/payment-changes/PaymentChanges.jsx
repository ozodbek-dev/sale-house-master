import { Button } from "@mui/material"
import BaseTable from "components/ui/tables/BaseTable"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { paymentTypeVariants } from "shared/tableColVariantsList"

const PaymentChanges = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("paymentChange.title")}
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
							className="!mr-2"
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
				<BaseTable
					emitRefetch={{ refetch, setRefetch }}
					dataPath="dictionary/changes"
					emitTableColumns={{ open, setOpen }}
					tableName="paymentChanges"
					headCells={[
						{ code: "id", label: "#" },
						{ code: "oldsum", label: t("common.table.oldSum") },
						{ code: "oldtype", label: t("common.table.oldType") },
						{ code: "newsum", label: t("common.table.newSum") },
						{ code: "newtype", label: t("common.table.newType") },
						{ code: "date", label: t("common.table.changeDate") },
						{ code: "staff", label: t("common.table.staff") }
					]}
					columns={[
						{ code: "id" },
						{ code: "oldsum", type: "priceCurrency" },
						{
							code: "oldtype",
							type: "customStatus",
							variants: paymentTypeVariants
						},
						{ code: "newsum", type: "priceCurrency" },
						{
							code: "newtype",
							type: "customStatus",
							variants: paymentTypeVariants
						},
						{ code: "date", type: "date" },
						{ code: "staff", type: "nested", childStr: "name" }
					]}
					actionContractView={true}
				/>
			</div>
		</div>
	)
}

export default PaymentChanges
