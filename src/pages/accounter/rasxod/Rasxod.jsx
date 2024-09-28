import { Button } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import SimplePaginationTable from "components/ui/tables/SimplePaginationTable"
import RasxodAddModal from "./RasxodAddModal"
import { paymentTypeVariants } from "shared/tableColVariantsList"
import SimpleSearchInput from "components/SimpleSearchInput"
import { useTranslation } from "react-i18next"

const Rasxod = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("expense.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [openRasxodModal, setOpenRasxodModal] = useState(false)
	const [open, setOpen] = useState(false)

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
							onClick={() => setOpenRasxodModal(true)}
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
					dataPath="accounter/rasxod/index"
					emitTableColumns={{ open, setOpen }}
					tableName="rasxod"
					headCells={[
						{ code: "id", label: t("common.table.expenseNumber") },
						{ code: "sum", label: t("common.table.expenseSum") },
						{
							code: "payment_type",
							label: t("common.table.expensePaymentType")
						},
						{ code: "comment", label: t("common.table.expenseComment") }
					]}
					columns={[
						{ code: "id" },
						{ code: "sum", type: "price" },
						{
							code: "payment_type",
							type: "customStatus",
							variants: paymentTypeVariants
						},
						{ code: "comment" }
					]}
				/>
			</div>
			{open && (
				<RasxodAddModal
					open={openRasxodModal}
					setOpen={setOpenRasxodModal}
					setRefetch={setRefetch}
				/>
			)}
		</div>
	)
}

export default Rasxod
