import React, { Fragment, useEffect, useState } from "react"
import {
	Button,
	ButtonBase,
	Checkbox,
	FormControl,
	FormControlLabel,
	Grid
} from "@mui/material"
import CustomSlider from "./CustomSlider"
import getShaxmatkaFilterData from "utils/getShaxmatkaFilterData"
import setShaxmatkaHomesDisabled from "utils/setShaxmatkaHomesDisabled"
import { Trans, useTranslation } from "react-i18next"

const ShaxmatkaFilter = ({
	blocks = [],
	filterExpanded = false,
	resetFilter = false,
	setResetFilter = () => {}
}) => {
	const { t } = useTranslation()
	const [initialFilterData, setInitialFilterData] = useState([])

	const [roomsValue, setRoomsValue] = useState([])
	const [selectedRooms, setSelectedRooms] = useState([])

	const [repairedPriceMinVal, setRepairedPriceMinVal] = useState(null)
	const [repairedPriceMaxVal, setRepairedPriceMaxVal] = useState(null)
	const [repairedPriceMarks, setRepairedPriceMarks] = useState([])
	const [repairedPriceValue, setRepairedPriceValue] = useState([])

	const [squareMinVal, setSquareMinVal] = useState(null)
	const [squareMaxVal, setSquareMaxVal] = useState(null)
	const [squareMarks, setSquareMarks] = useState([])
	const [squareValue, setSquareValue] = useState([])

	const [stageMinVal, setStageMinVal] = useState(null)
	const [stageMaxVal, setStageMaxVal] = useState(null)
	const [stageMarks, setStageMarks] = useState([])
	const [stageValue, setStageValue] = useState([])

	const [onlyFreesValue, setOnlyFreesValue] = useState(false)

	const toggleHomeRoomsNumber = (value) => {
		if (
			document
				.getElementById(`home-filter-rooms-number-${value}`)
				.className.includes("item-selected")
		) {
			document
				.getElementById(`home-filter-rooms-number-${value}`)
				.classList.remove("item-selected")
			let newSelectedRooms = selectedRooms.filter((item) => item !== value)
			setSelectedRooms(newSelectedRooms)
		} else {
			document
				.getElementById(`home-filter-rooms-number-${value}`)
				.classList.add("item-selected")
			let newSelectedRooms = [...selectedRooms, value]
			setSelectedRooms(newSelectedRooms)
		}
	}

	const handleRepairedPriceChange = (event, newValue) => {
		if (JSON.stringify(repairedPriceValue) !== JSON.stringify(newValue)) {
			setRepairedPriceValue(newValue)
			setShaxmatkaHomesDisabled(blocks, {
				selectedRooms,
				repairedPrice: newValue,
				square: squareValue,
				stage: stageValue,
				onlyFree: onlyFreesValue
			})
		}
	}

	const handleSquareChange = (event, newValue) => {
		if (JSON.stringify(squareValue) !== JSON.stringify(newValue)) {
			setSquareValue(newValue)
			setShaxmatkaHomesDisabled(blocks, {
				selectedRooms,
				repairedPrice: repairedPriceValue,
				square: newValue,
				stage: stageValue,
				onlyFree: onlyFreesValue
			})
		}
	}

	const handleStageChange = (event, newValue) => {
		if (JSON.stringify(stageValue) !== JSON.stringify(newValue)) {
			setStageValue(newValue)
			setShaxmatkaHomesDisabled(blocks, {
				selectedRooms,
				repairedPrice: repairedPriceValue,
				square: squareValue,
				stage: newValue,
				onlyFree: onlyFreesValue
			})
		}
	}

	const handleOnlyFreesChange = (event) => {
		setOnlyFreesValue(event.target.checked)
		setShaxmatkaHomesDisabled(blocks, {
			selectedRooms,
			repairedPrice: repairedPriceValue,
			square: squareValue,
			stage: stageValue,
			onlyFree: event.target.checked
		})
	}

	useEffect(() => {
		if (blocks.length > 0) {
			let { rooms, repairedPrice, square, stage } =
				getShaxmatkaFilterData(blocks)
			setInitialFilterData({ rooms, repairedPrice, square, stage })
			setRoomsValue(rooms.marks)

			setRepairedPriceMinVal(repairedPrice.min)
			setRepairedPriceMaxVal(repairedPrice.max)
			setRepairedPriceValue([repairedPrice.min, repairedPrice.max])
			setRepairedPriceMarks(repairedPrice.marks)

			setSquareMinVal(square.min)
			setSquareMaxVal(square.max)
			setSquareValue([square.min, square.max])
			setSquareMarks(square.marks)

			setStageMinVal(stage.min)
			setStageMaxVal(stage.max)
			setStageValue([stage.min, stage.max])
			setStageMarks(stage.marks)

			setSelectedRooms(rooms.marks.map((item) => item.value))
		}
	}, [])

	useEffect(() => {
		if (filterExpanded) {
			setShaxmatkaHomesDisabled(blocks, {
				selectedRooms,
				repairedPrice: repairedPriceValue,
				square: squareValue,
				stage: stageValue,
				onlyFree: onlyFreesValue
			})
		}
	}, [selectedRooms])

	useEffect(() => {
		if (resetFilter) {
			handleResetFilter()
			setResetFilter(false)
		}
	}, [resetFilter])

	const handleResetFilter = () => {
		setRepairedPriceValue([
			initialFilterData.repairedPrice.min,
			initialFilterData.repairedPrice.max
		])
		setSquareValue([initialFilterData.square.min, initialFilterData.square.max])
		setStageValue([initialFilterData.stage.min, initialFilterData.stage.max])
		setSelectedRooms(initialFilterData.rooms.marks.map((item) => item.value))
		setOnlyFreesValue(false)
		Array.from(
			document.getElementsByClassName("home-filter-rooms-number")
		).forEach((item) => item.classList.add("item-selected"))
	}

	return (
		<Fragment>
			{roomsValue && roomsValue.length > 0 && (
				<div className="mx-6 flex justify-between flex-col">
					<span className="text-center">{t("common.filter.roomsNumber")}</span>
					<Grid
						container
						rowSpacing={1}
						columns={{
							xs: 5,
							sm: 5
						}}
						className="!my-0.5"
					>
						{roomsValue.map((item) => (
							<Grid
								item={true}
								sm={1}
								xs={1}
								key={`home-filter-rooms-${item.value}`}
							>
								<ButtonBase
									className="home-filter-rooms-number item-selected"
									id={`home-filter-rooms-number-${item.value}`}
									onClick={() => toggleHomeRoomsNumber(item.value)}
								>
									{item.value}
								</ButtonBase>
							</Grid>
						))}
					</Grid>
				</div>
			)}

			{repairedPriceMarks &&
				repairedPriceMarks.length > 0 &&
				repairedPriceMinVal &&
				repairedPriceMaxVal && (
					<div className="mx-8 flex justify-between flex-col h-[80px] mt-4">
						<CustomSlider
							value={repairedPriceValue}
							handleChange={handleRepairedPriceChange}
							label={
								<span>
									<Trans i18nKey="common.filter.noRepairedPrice">
										1 m<sup>2</sup> ta'mirsiz narxi
									</Trans>
								</span>
							}
							marks={repairedPriceMarks}
							min={repairedPriceMinVal}
							max={repairedPriceMaxVal}
							suffix={" UZS"}
							allowNegative={false}
						/>
					</div>
				)}

			{squareMarks &&
				squareMarks.length > 0 &&
				squareMinVal &&
				squareMaxVal && (
					<div className="mx-8 flex justify-between flex-col h-[80px] mt-4">
						<CustomSlider
							value={squareValue}
							handleChange={handleSquareChange}
							label={t("common.filter.areaAll")}
							marks={squareMarks}
							min={squareMinVal}
							max={squareMaxVal}
							customFormat={true}
							suffix={
								<span>
									{" "}
									<Trans i18nKey="common.global.meter">
										m<sup>2</sup>
									</Trans>
								</span>
							}
							allowNegative={false}
						/>
					</div>
				)}

			{stageMarks && stageMarks.length > 0 && stageMinVal && stageMaxVal && (
				<div className="mx-8 flex justify-between flex-col h-[80px] mt-4">
					<CustomSlider
						value={stageValue}
						handleChange={handleStageChange}
						label={t("common.filter.stage")}
						marks={stageMarks}
						min={stageMinVal}
						max={stageMaxVal}
						suffix={""}
						allowNegative={true}
					/>
				</div>
			)}

			<div className="mx-6 flex justify-between flex-col mt-2">
				<FormControl fullWidth color="formColor" type="checkbox">
					<FormControlLabel
						control={
							<Checkbox
								id="only-free-homes-switch"
								name="onlyFreeHomesSwitch"
								checked={onlyFreesValue}
								onChange={handleOnlyFreesChange}
							/>
						}
						label={t("common.filter.onlyEmptyHomes")}
					/>
				</FormControl>
			</div>

			<div className="text-center mt-2">
				<Button
					color="info"
					variant="contained"
					onClick={() => handleResetFilter()}
				>
					{t("common.button.clearFilter")}
				</Button>
			</div>
		</Fragment>
	)
}

export default ShaxmatkaFilter
