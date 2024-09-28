import { Button } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import BlockAddModal from "./BlockAddModal"
import SearchInput from "components/SearchInput"
import BaseTable from "components/ui/tables/BaseTable"
import BlockAddEditImageModal from "./BlockAddEditImageModal"
import { useTranslation } from "react-i18next"

const Block = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("block.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)
	const [openBlockModal, setOpenBlockModal] = useState(false)
	const [openBlockAddEditImageModal, setOpenBlockAddEditImageModal] =
		useState(false)
	const [blockData, setBlockData] = useState({})
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
							onClick={() => setOpenBlockModal(true)}
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
					dataPath="dictionary/blocks"
					emitTableColumns={{ open, setOpen }}
					tableName="block"
					headCells={[
						{ code: "name", label: t("common.table.name") },
						{ code: "room_number", label: t("common.table.homesOnFloor") },
						{ code: "rooms", label: t("common.table.homesAll") },
						{ code: "objects", label: t("common.table.objectName") }
					]}
					columns={[
						{ code: "name" },
						{ code: "room_number" },
						{
							code: "rooms",
							type: "multiply",
							childStrings: ["stage", ""],
							fields: ["objects", "room_number"]
						},
						{ code: "objects", type: "nested", childStr: "name" }
					]}
					actionModal={{
						icon: "bi bi-images",
						btnColor: "info",
						setOpen: setOpenBlockAddEditImageModal,
						setData: setBlockData
					}}
				/>
			</div>

			{openBlockAddEditImageModal && (
				<BlockAddEditImageModal
					open={openBlockAddEditImageModal}
					setOpen={setOpenBlockAddEditImageModal}
					data={blockData}
				/>
			)}

			{openBlockModal && (
				<BlockAddModal
					open={openBlockModal}
					setOpen={setOpenBlockModal}
					setRefetch={setRefetch}
				/>
			)}
		</div>
	)
}

export default Block
