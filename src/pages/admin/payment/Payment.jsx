import { Button } from "@mui/material"
import BaseTable from "components/ui/tables/BaseTable"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { paymentTypeVariants } from "shared/tableColVariantsList"

const Payment = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("payment.title")}
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
					dataPath="dictionary/payments"
					emitTableColumns={{ open, setOpen }}
					tableName="payments"
					headCells={[
						{ code: "id", label: t("common.table.paymentId") },
						{ code: "contract", label: t("common.table.contractNumber") },
						{ code: "date", label: t("common.table.date") },
						{ code: "sum", label: t("common.table.paymentAmount") },
						{ code: "type_id", label: t("common.table.typeId") },
						{ code: "staff", label: t("common.table.staff") }
					]}
					columns={[
						{ code: "id" },
						{ code: "contract", type: "nested", childStr: "name" },
						{ code: "date", type: "date" },
						{ code: "sum", type: "priceCurrency" },
						{
							code: "type_id",
							type: "customStatus",
							variants: paymentTypeVariants
						},
						{ code: "staff", type: "nested", childStr: "name" }
					]}
					actionGetCheque={true}
				/>
			</div>
		</div>
	)
}

export default Payment
