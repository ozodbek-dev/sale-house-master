import { Button } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import OrderActionModal from "./OrderActionModal"
import BaseTable from "components/ui/tables/BaseTable"
import SearchInput from "components/SearchInput"
import OrderFiltersComponent from "components/ui/filters/OrderFiltersComponent"
import { orderTypeVariants } from "shared/tableColVariantsList"
import { useTranslation } from "react-i18next"

const Order = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("order.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [open, setOpen] = useState(false)
	const [openOrderModal, setOpenOrderModal] = useState(false)
	const [expanded, setExpanded] = useState(false)
	const [orderData, setOrderData] = useState({})

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
					</div>
					<div className="header-actions action-buttons-box py-3 px-4 my-shadow-2 rounded-lg flex items-center justify-center ml-4">
						<Button
							variant="action"
							color="info"
							onClick={() => setRefetch(true)}
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
				{expanded && (
					<div className="my-shadow-2 rounded-lg px-4 w-full mt-2">
						<OrderFiltersComponent />
					</div>
				)}
			</div>

			<div className="component-table-wrapper">
				<BaseTable
					emitRefetch={{ refetch, setRefetch }}
					dataPath="admin/order/index"
					emitTableColumns={{ open, setOpen }}
					tableName="order"
					headCells={[
						{ code: "custom", label: t("common.table.custom") },
						// { code: "id", label: "#" },
						{ code: "object", label: t("common.table.objectName") },
						{ code: "block", label: t("common.table.blockName") },
						{ code: "home_number", label: t("common.table.homeNumber") },
						{ code: "home_stage", label: t("common.table.stage") },
						{ code: "home_rooms", label: t("common.table.rooms") },
						{ code: "date", label: t("common.table.date") },
						{ code: "status", label: t("common.table.status") }
					]}
					columns={[
						{
							code: "custom",
							type: "nestedChain",
							childStrings: ["surname", "name", "middlename"]
						},
						{ code: "home", type: "nested", childStr: "blocks.objects.name" },
						{ code: "home", type: "nested", childStr: "blocks.name" },
						{ code: "home", type: "nested", childStr: "number" },
						{ code: "home", type: "nested", childStr: "stage" },
						{ code: "home", type: "nested", childStr: "rooms" },
						{ code: "date", type: "date" },
						{
							code: "status",
							type: "customStatus",
							variants: orderTypeVariants
						}
					]}
					actionModal={{
						icon: "bi bi-eye",
						btnColor: "info",
						setOpen: setOpenOrderModal,
						setData: setOrderData
					}}
				/>
			</div>
			{openOrderModal && (
				<OrderActionModal
					open={openOrderModal}
					setOpen={setOpenOrderModal}
					data={orderData}
					setRefetch={setRefetch}
				/>
			)}
		</div>
	)
}

export default Order
