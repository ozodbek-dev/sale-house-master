import React, { Fragment } from "react"
import ShaxmatkaRow from "./ShaxmatkaRow"
import HOME_TYPE from "shared/homeTypeList"
import { useTranslation } from "react-i18next"

const ShaxmatkaBlockItem = ({
	blockItem,
	blockIndex,
	toggleSelectionItem = () => {}
}) => {
	const { t } = useTranslation()
	const getRoomsByStatus = (statusCode) => {
		return blockItem?.homes.length > 0
			? blockItem?.homes.filter((item) => item.status === statusCode).length
			: 0
	}

	const getFullFloorsNumberByBlock = (block) => {
		let a = Array.from(new Set(block.homes.map((item) => item.stage)))
		if (a.includes("-1")) {
			a.push("0")
		}
		a.sort((x, y) => x - y)
		return a.reverse()
	}

	return (
		<Fragment>
			<div className="mt-2 ml-10 leading-4">
				<span className="font-medium text-lg text-line-1">
					{blockItem?.name}
				</span>
				<span className="text-sm leading-4">
					({t("shaxmatka.homeType.free")}:{" "}
					{getRoomsByStatus(HOME_TYPE.ACTIVE.code)},{" "}
					{t("shaxmatka.homeType.ordered")}:{" "}
					{getRoomsByStatus(HOME_TYPE.TIME.code)},{" "}
					{t("shaxmatka.homeType.sold")}:{" "}
					{getRoomsByStatus(HOME_TYPE.ORDERED.code)})
				</span>
			</div>
			{getFullFloorsNumberByBlock(blockItem).map((floorNumber, index) => (
				<div
					className={`sheet-row floor-${floorNumber}`}
					key={`block-${blockItem?.id}-row-${index}`}
					id={`block-${blockItem?.id}-row-${index}`}
				>
					<ShaxmatkaRow
						homesData={blockItem?.homes}
						blockIndex={blockIndex}
						floorNumber={floorNumber}
						size={new Set(blockItem?.homes.map((item) => item.stage)).size}
						toggleSelectionItem={toggleSelectionItem}
					/>
				</div>
			))}
			<div className="mt-2 ml-10 leading-4">
				<span className="font-medium text-lg text-line-1">
					{blockItem?.name}
				</span>
				<span className="text-sm leading-4">
					({t("shaxmatka.homeType.free")}:{" "}
					{getRoomsByStatus(HOME_TYPE.ACTIVE.code)},{" "}
					{t("shaxmatka.homeType.ordered")}:{" "}
					{getRoomsByStatus(HOME_TYPE.TIME.code)},{" "}
					{t("shaxmatka.homeType.sold")}:{" "}
					{getRoomsByStatus(HOME_TYPE.ORDERED.code)})
				</span>
			</div>
		</Fragment>
	)
}

export default ShaxmatkaBlockItem
