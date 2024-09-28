import { Button } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import CurrencyAddModal from "./CurrencyAddModal"
import SimplePaginationTable from "components/ui/tables/SimplePaginationTable"
import { useTranslation } from "react-i18next"

const Currency = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("currency.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [openCurrencyModal, setOpenCurrencyModal] = useState(false)
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
							onClick={() => setOpenCurrencyModal(true)}
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
					dataPath="admin/valute/index"
					emitTableColumns={{ open, setOpen }}
					tableName="currency"
					headCells={[
						{ code: "id", label: "#" },
						{ code: "sum", label: t("common.table.currencyInSum") },
						{ code: "date", label: t("common.table.date") },
						{ code: "staff", label: t("common.table.staff") }
					]}
					columns={[
						{ code: "id" },
						{ code: "sum", type: "price" },
						{ code: "date", type: "dateTime" },
						{ code: "staff", type: "nested", childStr: "name" }
					]}
				/>
			</div>

			{openCurrencyModal && (
				<CurrencyAddModal
					open={openCurrencyModal}
					setOpen={setOpenCurrencyModal}
					setRefetch={setRefetch}
				/>
			)}
		</div>
	)
}

export default Currency
