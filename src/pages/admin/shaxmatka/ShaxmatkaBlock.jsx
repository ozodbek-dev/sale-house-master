import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	Tab,
	Tabs,
	TextField
} from "@mui/material"
import SimpleCheckbox from "components/ui/simple-fields/checkbox/SimpleCheckbox"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormCurrencyField from "components/ui/form/FormCurrencyField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useTopPanel from "hooks/useTopPanel"
import { Fragment, useEffect, useState } from "react"
import { useQueries } from "react-query"
import { useParams } from "react-router-dom"
import * as yup from "yup"
import FormNumberField from "components/ui/form/FormNumberField"
import useNotification from "hooks/useNotification"
import FormRadioGroupField from "components/ui/form/FormRadioGroupField"
import ORDER_TYPE from "shared/orderTypeList"
import BackButton from "components/ui/BackButton"
import FormTextField from "components/ui/form/FormTextField"
import useFormSubmit from "hooks/useFormSubmit"
import ShaxmatkaBlocksTable from "./shaxmatka-parts/ShaxmatkaBlocksTable"
import ShaxmatkaModeSelect from "./shaxmatka-parts/ShaxmatkaModeSelect"
import Shaxmatka2BlockItem from "./shaxmatka-parts/Shaxmatka2BlockItem"
import ShaxmatkaBlockItem from "./shaxmatka-parts/ShaxmatkaBlockItem"
import ShaxmatkaFilter from "components/ui/shaxmatka-filters/ShaxmatkaFilter"
import ShaxmatkaHomeDetail from "./shaxmatka-parts/ShaxmatkaHomeDetail"
import {
	currencyTypeSelectOptions,
	repairTypeSelectOptions,
	residentTypeSelectOptions
} from "shared/selectOptionsList"
import FormLayoutField from "components/ui/form/FormLayoutField"
import FormSimpleSelectField from "components/ui/form/FormSimpleSelectField"
import useCurrency from "hooks/useCurrency"
import CurrencySubContent from "components/ui/text-formats/CurrencySubContent"
import { Trans, useTranslation } from "react-i18next"

const validationSchema = yup.object({
	number: yup.string().optional(),
	rooms: yup.number().required("shaxmatka.validation.rooms"),
	square: yup.number().required("shaxmatka.validation.square"),
	start: yup.number().required("shaxmatka.validation.start"),
	plan_id: yup.string().optional(),
	isvalute: yup.string().optional(),
	islive: yup.string().required("shaxmatka.validation.islive"),
	repaired: yup.number().required("shaxmatka.validation.repaired"),
	norepaired: yup.number().required("shaxmatka.validation.norepaired"),
	isrepaired: yup.string().required("shaxmatka.validation.isrepaired")
})

const ShaxmatkaBlock = () => {
	const { objectId } = useParams()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const { setComponent } = useTopPanel()
	const { currencyData } = useCurrency()
	const [shaxmatkaMode, setShaxmatkaMode] = useState("VIEW")
	const [resetFilter, setResetFilter] = useState(false)
	const [filterExpanded, setFilterExpanded] = useState(false)
	const [homeExpanded, setHomeExpanded] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [blocks, setBlocks] = useState([])
	const [tabValue, setTabValue] = useState(0)
	const [selectedHomeBlockId, setSelectedHomeBlockId] = useState(1)
	const [editWithPlanActive, setEditWithPlanActive] = useState(false)
	const [editTypeMultiple, setEditTypeMultiple] = useState(false)
	const [openNumerationDialog, setOpenNumerationDialog] = useState(false)
	const [selectedHomes, setSelectedHomes] = useState([])
	const sendNotification = useNotification()
	const { submit, isSubmitting } = useFormSubmit()
	const [isMultipleSubmitting, setIsMultipleSubmitting] = useState(false)

	const formik = useFormik({
		initialValues: {
			number: "",
			rooms: "",
			square: "",
			isvalute: "0",
			islive: null,
			repaired: "",
			norepaired: "",
			isrepaired: null,
			start: "",
			plan_id: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			let newValues = {
				rooms: values.rooms,
				number: values.number,
				square: values.square,
				repaired: values.repaired,
				norepaired: values.norepaired,
				start: values.start,
				isvalute: values.isvalute,
				isrepaired: values.isrepaired,
				islive: values.islive,
				plan_id: values.plan_id
			}
			/* if (editTypeMultiple) {
				newValues = {
					rooms: values.rooms,
					square: values.square,
					repaired: values.repaired,
					norepaired: values.norepaired,
					start: values.start,
					isrepaired: values.isrepaired,
					islive: values.islive,
					plan_id: values.plan_id,
					_method: "put"
				}
			} */
			if (!editTypeMultiple && selectedHomes.length === 1) {
				submit(
					{ type: "put", contentType: "formData" },
					newValues,
					"/admin/home",
					"Xona",
					selectedHomes[0]?.id,
					false,
					handleResponse
				)
			} else if (editTypeMultiple) {
				/* newValues = {
					rooms: values.rooms,
					square: values.square,
					repaired: values.repaired,
					norepaired: values.norepaired,
					start: values.start,
					isrepaired: values.isrepaired,
					islive: values.islive,
					_method: "put"
				}
				if(editWithPlanActive) {
					newValues.plan_id = values.plan_id
				}
				else {

				} */
				setIsMultipleSubmitting(true)
				try {
					let multipleResponse = await Promise.all(
						selectedHomes.map((item) =>
							axiosPrivate.post(
								`/admin/home/update/${item?.id}`,
								parseToFormData(
									getMultipleHomeNewValuesByPlanActive(
										values,
										item?.id,
										item?.blockIndex
									)
								),
								{
									headers: { "Content-Type": "multipart/form-data" }
								}
							)
						)
					)
					handleMultipleResponse(multipleResponse)
				} catch (error) {
					sendNotification({
						msg: error?.response?.data?.message || error?.message,
						variant: "error"
					})
					setIsMultipleSubmitting(false)
				}
			}
		}
	})

	const [objectQuery, blocksQuery] = useQueries([
		{
			queryKey: "objectSingle",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`/admin/object/edit/${objectId}`
				)
				return response.data.data
			},
			enabled: !hasError && !!objectId,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "objectBlocks",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`/admin/home/object/${objectId}`
				)
				return response.data.data
			},
			onSuccess: (data) => {
				setBlocks(JSON.parse(JSON.stringify(data)))
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		}
	])

	const getMultipleHomeNewValuesByPlanActive = (values, homeId, blockIndex) => {
		let newValues = {
			rooms: values.rooms,
			square: values.square,
			repaired: values.repaired,
			norepaired: values.norepaired,
			start: values.start,
			isvalute: values.isvalute,
			isrepaired: values.isrepaired,
			islive: values.islive,
			_method: "put"
		}
		if (editWithPlanActive) {
			newValues.plan_id = values.plan_id
		} else {
			let home = blocksQuery.data[blockIndex]?.homes.filter(
				(item) => item.id === homeId
			)[0]
			newValues.plan_id = home.plan_id || ""
		}
		return newValues
	}

	const parseToFormData = (values) => {
		let formData = new FormData()
		for (let key in values) {
			formData.append(key, values[key])
		}
		return formData
	}

	const resetSelection = () => {
		Array.from(document.getElementsByClassName("home-item")).forEach((item) =>
			item.classList.remove("item-selected")
		)
	}

	const resetFilledHomeValues = (homeId, blockIndex) => {
		if (homeId) {
			blocks[blockIndex].homes.splice(
				blocks[blockIndex].homes.findIndex((item) => item.id === homeId),
				1,
				blocksQuery.data[blockIndex].homes.filter(
					(item) => item.id === homeId
				)[0]
			)
			setBlocks([...blocks])
		}
	}

	const checkRoomActive = (id, blockIndex) => {
		if (shaxmatkaMode === "VIEW") {
			return true
		}
		if (
			blocksQuery.data[blockIndex]?.homes.filter((item) => item.id === id)[0]
				.status !== ORDER_TYPE.NEW.code
		) {
			sendNotification({
				msg: t("shaxmatka.alerts.warning.invalidHome"),
				variant: "warning"
			})
			return false
		}
		return true
	}

	const toggleSelectionItem = (id, blockIndex) => {
		setSelectedHomeBlockId(blocksQuery.data[blockIndex]?.id)
		if (checkRoomActive(id, blockIndex)) {
			if (editTypeMultiple) {
				document
					.querySelector(`.block-${blockIndex}-home#home-${id}`)
					.classList.toggle("item-selected")
				if (selectedHomes.find((item) => item.id === id)) {
					selectedHomes.splice(selectedHomes.map((el) => el.id).indexOf(id), 1)
					resetFilledHomeValues(id, blockIndex)
				} else {
					if (selectedHomes.length === 0) {
						setMultipleHomeValuesToForm(id, blockIndex)
					} else {
						setFormDataToHome({ id: id, blockIndex: blockIndex })
						setBlocks([...blocks])
					}
					selectedHomes.push({ id: id, blockIndex: blockIndex })
				}
				setSelectedHomes(selectedHomes)
			} else {
				Array.from(document.getElementsByClassName("home-item")).forEach(
					(item) =>
						item.id !== `home-${id}` && item.classList.remove("item-selected")
				)
				document
					.querySelector(`.block-${blockIndex}-home#home-${id}`)
					.classList.toggle("item-selected")
				formik.resetForm()
				if (selectedHomes.find((item) => item.id === id)) {
					setHomeExpanded(false)
					setSelectedHomes([])
					resetFilledHomeValues(id, blockIndex)
				} else {
					setHomeExpanded(true)
					resetFilledHomeValues(
						selectedHomes[0]?.id,
						selectedHomes[0]?.blockIndex
					)
					setSelectedHomes([{ id: id, blockIndex: blockIndex }])
					setHomeValuesToForm(id, blockIndex)
				}
			}
		}
	}

	const handleWithPlanActive = (value) => {
		if (value) {
			if (selectedHomes.length > 1) {
				let firstSelectedHome = blocksQuery.data[
					selectedHomes[0].blockIndex
				]?.homes.filter((item) => item.id === selectedHomes[0].id)[0]
				selectedHomes.forEach(() => {
					formik.setFieldValue("plan_id", firstSelectedHome.plan_id || "")
				})
			}
		} else {
			/* selectedHomes.forEach((selectedHomeItem) => {
				let currHome = blocksQuery.data[
					selectedHomeItem.blockIndex
				]?.homes.filter((item) => item.id === selectedHomeItem.id)[0]
				formik.setFieldValue("plan_id", currHome.plan_id || "")
			}) */
			formik.setFieldValue("plan_id", "")
		}
		setEditWithPlanActive(value)
	}

	const handleEditType = (value) => {
		selectedHomes.forEach((selectedHome) => {
			blocks[selectedHome.blockIndex]?.homes.splice(
				blocks[selectedHome.blockIndex]?.homes.findIndex(
					(item) => item.id === selectedHome.id
				),
				1,
				blocksQuery.data[selectedHome.blockIndex]?.homes.filter(
					(item) => item.id === selectedHome.id
				)[0]
			)
		})
		setBlocks([...blocks])
		resetSelection()
		setSelectedHomes([])
		formik.resetForm()
		setEditTypeMultiple(value)
		if (!value) {
			setHomeExpanded(false)
			setEditWithPlanActive(false)
		}
	}

	const handleResponse = (response) => {
		blocksQuery.refetch()
		formik.resetForm()
		resetSelection()
		setSelectedHomes([])
		setHomeExpanded(false)
	}

	const handleMultipleResponse = (multipleResponse) => {
		let result = multipleResponse.reduce((acc, curr) => {
			return acc && curr && curr.data && curr.data.status
		}, true)
		if (result) {
			sendNotification({
				msg: t("shaxmatka.alerts.success.homesUpdated"),
				variant: "success"
			})
			formik.resetForm()
			resetSelection()
			setSelectedHomes([])
			blocksQuery.refetch()
			// setHomeExpanded(false)
			// setEditTypeMultiple(false)
		}
		setIsMultipleSubmitting(false)
	}

	const setHomeValuesToForm = (homeId, blockIndex) => {
		let home = blocksQuery.data[blockIndex]?.homes.filter(
			(item) => item.id === homeId
		)[0]
		let newValues = {
			rooms: home.rooms || "",
			number: home.number || "",
			square: home.square || "",
			isvalute: home.isvalute || "0",
			islive: home.islive || "",
			repaired: home.repaired || "",
			norepaired: home.norepaired || "",
			isrepaired: home.isrepaired || "",
			start: home.start || "",
			plan_id: home.plan_id || ""
		}
		console.log("newValues = ", newValues)
		formik.setValues(newValues)
	}

	const setMultipleHomeValuesToForm = (homeId, blockIndex) => {
		// console.log("blocksQuery.data[blockIndex] = ", blocksQuery.data[blockIndex])
		let home = blocksQuery.data[blockIndex]?.homes.filter(
			(item) => item.id === homeId
		)[0]
		let newValues = {
			rooms: home.rooms || "",
			square: home.square || "",
			isvalute: home.isvalute || "0",
			islive: home.islive || "",
			repaired: home.repaired || "",
			norepaired: home.norepaired || "",
			isrepaired: home.isrepaired || "",
			start: home.start || ""
		}
		if (editWithPlanActive) {
			newValues.plan_id = home.plan_id || ""
		}
		formik.setValues(newValues)
	}

	const setFormDataToHome = (selectedH) => {
		// console.log("selectedH = ", selectedH)
		let selectedHomeData =
			blocks[selectedH.blockIndex]?.homes[
				blocks[selectedH.blockIndex]?.homes.findIndex(
					(item) => item.id === selectedH.id
				)
			]
		let formikNewValues = {
			rooms: formik.values.rooms,
			square: formik.values.square,
			repaired: formik.values.repaired,
			norepaired: formik.values.norepaired,
			start: formik.values.start,
			isrepaired: formik.values.isrepaired,
			islive: formik.values.islive
		}
		if (editWithPlanActive) {
			formikNewValues.plan_id = formik.values.plan_id || ""
		}
		blocks[selectedH.blockIndex].homes[
			blocks[selectedH.blockIndex].homes.findIndex(
				(item) => item.id === selectedH.id
			)
		] = {
			...selectedHomeData,
			...formikNewValues
		}
	}

	const setSingleHomeDataFromForm = () => {
		if (selectedHomes.length > 0) {
			setFormDataToHome(selectedHomes[0])
			setBlocks([...blocks])
		}
	}

	const setMultipleHomeDataFromForm = () => {
		if (selectedHomes.length > 0) {
			selectedHomes.forEach((selectedHome) => {
				setFormDataToHome(selectedHome)
			})
			setBlocks([...blocks])
		}
	}

	const handleCurrencyChange = (value) => {
		formik.setFieldValue("isvalute", value, true)
		if (currencyData && currencyData.sum) {
			if (value === "1") {
				formik.setFieldValue(
					"repaired",
					parseFloat(
						parseFloat(
							(formik.values.repaired || "0") / currencyData.sum
						).toFixed(1)
					),
					true
				)
				formik.setFieldValue(
					"norepaired",
					parseFloat(
						parseFloat(
							(formik.values.norepaired || "0") / currencyData.sum
						).toFixed(1)
					),
					true
				)
				formik.setFieldValue(
					"start",
					parseFloat(
						parseFloat((formik.values.start || "0") / currencyData.sum).toFixed(
							1
						)
					),
					true
				)
			} else if (value === "0") {
				formik.setFieldValue(
					"repaired",
					parseFloat((formik.values.repaired || "0") * currencyData.sum),
					true
				)
				formik.setFieldValue(
					"norepaired",
					parseFloat((formik.values.norepaired || "0") * currencyData.sum),
					true
				)
				formik.setFieldValue(
					"start",
					parseFloat((formik.values.start || "0") * currencyData.sum),
					true
				)
			}
		}
	}

	const setNumeration = (data) => {
		let startNumber = data.startNumber
		if (data.placement === "fromTop") {
			let length = blocks.length - 1
			blocks.forEach((home) => {
				home.number = length + startNumber--
			})
		} else {
			blocks.forEach((home) => {
				home.number = startNumber++
			})
		}
		setBlocks(blocks)
	}

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
		setResetFilter(true)
		setFilterExpanded(false)
		handleCloseHomeDetail()
	}

	const handleCloseHomeDetail = () => {
		resetSelection()
		setSelectedHomes([])
		setHomeExpanded(false)
	}

	const handleRefetchBlocks = () => {
		resetSelection()
		setSelectedHomes([])
		setHomeExpanded(false)
		blocksQuery.refetch()
	}

	useEffect(() => {
		setComponent(
			<div className="flex flex-row items-center w-full">
				<BackButton />
				<div className="text-xl">
					{t("shaxmatka.shortTitle")} |{" "}
					<span className="text-base-color">{objectQuery?.data?.name}</span>
				</div>
			</div>
		)
	}, [objectQuery?.data, i18n.language])

	useEffect(() => {
		if (!editTypeMultiple) {
			setSingleHomeDataFromForm()
		} else {
			setMultipleHomeDataFromForm()
		}
	}, [formik.values])

	useEffect(() => {
		if (shaxmatkaMode === "VIEW") {
			if (editTypeMultiple) {
				setHomeExpanded(false)
				selectedHomes.forEach((item) =>
					resetFilledHomeValues(item.id, item.blockIndex)
				)
				setSelectedHomes([])
				setEditTypeMultiple(false)
				resetSelection()
			}
		} else if (shaxmatkaMode === "EDIT") {
			setSelectedHomes([])
			setHomeExpanded(false)
			resetSelection()
		}
	}, [shaxmatkaMode])

	return (
		<div className="flex">
			<div
				className={`sheet-filter-wrapper${filterExpanded ? " is-full" : ""}`}
			>
				{Object.keys(blocks).length > 0 && (
					<div className="sheet-filter-body">
						<div className="absolute top-0 right-0">
							<IconButton
								variant="onlyIcon"
								color="primary"
								onClick={() => setFilterExpanded((prev) => !prev)}
							>
								<i className="bi bi-x" />
							</IconButton>
						</div>
						<ShaxmatkaFilter
							blocks={blocks}
							filterExpanded={filterExpanded}
							resetFilter={resetFilter}
							setResetFilter={setResetFilter}
						/>
					</div>
				)}
			</div>
			<div
				className={`sheet-type-tabs${
					filterExpanded
						? homeExpanded
							? " is-mini-dual"
							: " is-mini"
						: homeExpanded
						? " is-mini"
						: ""
				}`}
			>
				<div className="flex mb-1 items-center">
					{!filterExpanded && (
						<div className="mt-2">
							<Button
								variant={filterExpanded ? "filterContained" : "filterOutlined"}
								color="primary"
								startIcon={<i className="bi bi-filter" />}
								onClick={() => setFilterExpanded((prev) => !prev)}
							>
								{t("common.button.filter")}
							</Button>
						</div>
					)}
					<div className="flex items-center justify-between w-full ml-4 flex-wrap">
						<div className="flex mt-2">
							<div className="flex items-center">
								<div className="w-4 h-4 rounded-sm bg-gray-400 mr-1"></div>
								{t("shaxmatka.homeType.disabled")}
							</div>
							<div className="flex ml-4 items-center">
								<div className="w-4 h-4 rounded-sm bg-orange-400 mr-1"></div>
								{t("shaxmatka.homeType.ordered")}
							</div>
							<div className="flex ml-4 items-center">
								<div className="w-4 h-4 rounded-sm bg-red-500 mr-1"></div>
								{t("shaxmatka.homeType.sold")}
							</div>
						</div>
						<div className="flex items-center justify-end mt-2">
							<ShaxmatkaModeSelect
								value={shaxmatkaMode}
								setValue={setShaxmatkaMode}
							/>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								className="sheet-tabs"
							>
								<Tab
									label={
										<span>
											<i className="bi bi-grid" />{" "}
											{t("shaxmatka.type.shaxmatka1")}
										</span>
									}
								/>
								<Tab
									label={
										<span>
											<i className="bi bi-grid" />{" "}
											{t("shaxmatka.type.shaxmatka2")}
										</span>
									}
								/>
								<Tab
									label={
										<span>
											<i className="bi bi-list-task" />{" "}
											{t("shaxmatka.type.table")}
										</span>
									}
								/>
							</Tabs>
						</div>
					</div>
				</div>

				{tabValue === 0 && (
					<div className="sheet-wrapper">
						<div className="sheet-base-area">
							<div className="sheet-grid">
								{(blocksQuery.isLoading || blocksQuery.isFetching) &&
								(objectQuery.isLoading || objectQuery.isFetching) ? (
									<div className="circular-progress-box min-h-[500px] h-full w-full">
										<CircularProgress size={50} />
									</div>
								) : (
									blocksQuery.data &&
									blocksQuery.data.length > 0 &&
									blocks && (
										<Fragment>
											{blocks.map((block, index) => (
												<div
													className="sheet-column"
													key={`block-${block?.id}-columns`}
													id={`block-${block?.id}-columns`}
												>
													<ShaxmatkaBlockItem
														blockItem={block}
														blockIndex={index}
														toggleSelectionItem={toggleSelectionItem}
													/>
												</div>
											))}
										</Fragment>
									)
								)}
							</div>
						</div>

						<ShaxmatkaNumerationDialog
							open={openNumerationDialog}
							setOpen={setOpenNumerationDialog}
							setNumeration={setNumeration}
						/>
					</div>
				)}
				{tabValue === 1 && (
					<div className="sheet-wrapper type-2">
						<div className="sheet-base-area">
							<div className="sheet-grid">
								{(blocksQuery.isLoading || blocksQuery.isFetching) &&
								(objectQuery.isLoading || objectQuery.isFetching) ? (
									<div className="circular-progress-box min-h-[500px] h-full w-full">
										<CircularProgress size={50} />
									</div>
								) : (
									blocksQuery.data &&
									blocksQuery.data.length > 0 &&
									blocks &&
									blocks.map((block, index) => (
										<div
											className="sheet-column"
											key={`block-${block?.id}-columns`}
											id={`block-${block?.id}-columns`}
										>
											<Shaxmatka2BlockItem
												blockItem={block}
												blockIndex={index}
												toggleSelectionItem={toggleSelectionItem}
											/>
										</div>
									))
								)}
							</div>
						</div>

						<ShaxmatkaNumerationDialog
							open={openNumerationDialog}
							setOpen={setOpenNumerationDialog}
							setNumeration={setNumeration}
						/>
					</div>
				)}
				{tabValue === 2 && (
					<div className="pb-4 pt-2">
						<ShaxmatkaBlocksTable
							isLoading={
								(blocksQuery.isLoading || blocksQuery.isFetching) &&
								(objectQuery.isLoading || objectQuery.isFetching)
							}
							isError={blocksQuery.isError || objectQuery.isError}
							blocks={blocks}
							toggleSelectionItem={toggleSelectionItem}
						/>
					</div>
				)}
			</div>
			<div className={`sheet-actions-area${homeExpanded ? " is-full" : ""}`}>
				{homeExpanded &&
					(shaxmatkaMode === "EDIT" ? (
						<div className="sheet-actions-body">
							<Grid
								container
								spacing={2}
								rowSpacing={1}
								columns={{ xs: 12, sm: 12 }}
							>
								<Grid item={true} sm={12}>
									<SimpleCheckbox
										delay={0}
										duration={0}
										label={t("shaxmatka.changeMultiple")}
										value={editTypeMultiple}
										setValue={handleEditType}
									/>
								</Grid>
							</Grid>
							<div className="sheet-form-action">
								<form onSubmit={formik.handleSubmit}>
									<Grid
										container
										spacing={2}
										rowSpacing={1}
										columns={{ xs: 12, sm: 12 }}
									>
										{!editTypeMultiple && (
											<Grid
												item={true}
												sm={12}
												sx={{ marginBottom: "-0.5rem" }}
											>
												<FormTextField
													delay={0}
													label={t("common.fields.homeNumber")}
													fieldName="number"
													formik={formik}
												/>
											</Grid>
										)}

										<Grid item={true} sm={12} sx={{ marginBottom: "-0.5rem" }}>
											<FormNumberField
												delay={0}
												label={t("common.fields.rooms")}
												fieldName="rooms"
												formik={formik}
											/>
										</Grid>

										<Grid item={true} sm={12} sx={{ marginBottom: "-0.5rem" }}>
											<FormNumberField
												delay={0}
												label={t("common.fields.homeAreAll")}
												fieldName="square"
												formik={formik}
												decimalScale={2}
											/>
										</Grid>

										<Grid item={true} sm={12} sx={{ marginBottom: "-0.5rem" }}>
											<FormSimpleSelectField
												delay={0}
												fieldName="isvalute"
												formik={formik}
												label={t("common.fields.currency")}
												options={currencyTypeSelectOptions}
												itemValue="code"
												itemLabel="label"
												changeFn={handleCurrencyChange}
											/>
										</Grid>

										<Grid item={true} sm={12} sx={{ marginBottom: "-0.5rem" }}>
											<FormCurrencyField
												delay={0}
												fieldName="repaired"
												formik={formik}
												label={
													<span>
														<Trans i18nKey="common.fields.repairedPrice">
															Ta'mirlangan narxi(1 m<sup>2</sup>)
														</Trans>
													</span>
												}
												decimalScale={1}
											/>
											{formik.values.isvalute === "1" &&
												!isNaN(formik.values.repaired) && (
													<CurrencySubContent
														value={formik.values.repaired || "0"}
													/>
												)}
										</Grid>

										<Grid item={true} sm={12} sx={{ marginBottom: "-0.5rem" }}>
											<FormCurrencyField
												delay={0}
												fieldName="norepaired"
												formik={formik}
												label={
													<span>
														<Trans i18nKey="common.fields.noRepairedPrice">
															Ta'mirlanmagan narxi(1 m<sup>2</sup>)
														</Trans>
													</span>
												}
												decimalScale={1}
											/>
											{formik.values.isvalute === "1" &&
												!isNaN(formik.values.norepaired) && (
													<CurrencySubContent
														value={formik.values.norepaired || "0"}
													/>
												)}
										</Grid>

										<Grid item={true} sm={12} sx={{ marginBottom: "-0.5rem" }}>
											<FormCurrencyField
												delay={0}
												fieldName="start"
												formik={formik}
												label={t("common.fields.startPrice")}
												decimalScale={1}
											/>
											{formik.values.isvalute === "1" &&
												!isNaN(formik.values.start) && (
													<CurrencySubContent
														value={formik.values.start || "0"}
													/>
												)}
										</Grid>

										<Grid item={true} sm={12}>
											<FormRadioGroupField
												delay={0}
												fieldName="islive"
												formik={formik}
												label={t("common.fields.residentType")}
												options={residentTypeSelectOptions}
											/>
										</Grid>

										<Grid
											item={true}
											sm={12}
											sx={{ marginTop: "-0.5rem", marginBottom: "-0.5rem" }}
										>
											<FormRadioGroupField
												delay={0}
												fieldName="isrepaired"
												formik={formik}
												label={t("common.fields.repairType")}
												options={repairTypeSelectOptions}
											/>
										</Grid>

										{editTypeMultiple && (
											<Grid item={true} sm={12}>
												<SimpleCheckbox
													delay={0}
													duration={0}
													label={t("shaxmatka.withPlan")}
													value={editWithPlanActive}
													setValue={handleWithPlanActive}
												/>
											</Grid>
										)}

										{!editTypeMultiple && (
											<Grid item={true} sm={12}>
												<FormLayoutField
													delay={0}
													label={t("common.fields.plan")}
													fieldName="plan_id"
													formik={formik}
													path={`/admin/plan/index?block_id=${selectedHomeBlockId}`}
												/>
											</Grid>
										)}

										{editWithPlanActive && (
											<Grid item={true} sm={12}>
												<FormLayoutField
													delay={0}
													label={t("common.fields.plan")}
													fieldName="plan_id"
													formik={formik}
													path={`/admin/plan/index?block_id=${selectedHomeBlockId}`}
												/>
											</Grid>
										)}

										<Grid item={true} sm={12} xs={12}>
											<FormActionButtons
												delay={0}
												isSubmitting={isSubmitting || isMultipleSubmitting}
												onlySave
												className="mt-0"
											/>
										</Grid>
									</Grid>
								</form>
							</div>
						</div>
					) : (
						<div className="sheet-actions-body">
							<div className="absolute top-0 right-0">
								<IconButton
									variant="onlyIcon"
									color="primary"
									onClick={() => handleCloseHomeDetail()}
								>
									<i className="bi bi-x" />
								</IconButton>
							</div>
							<ShaxmatkaHomeDetail
								orderHome={true}
								showContract={true}
								selectedHome={selectedHomes}
								blocks={blocksQuery.data}
								refetchFn={handleRefetchBlocks}
							/>
						</div>
					))}
			</div>
		</div>
	)
}

const ShaxmatkaNumerationDialog = ({ open, setOpen, setNumeration }) => {
	const { t } = useTranslation()
	const [startPlacement, setStartPlacement] = useState("fromBottom")
	const [startNumber, setStartNumber] = useState("1")

	const handleData = () => {
		setNumeration({ startNumber, placement: startPlacement })
		setOpen(false)
	}

	return (
		<div>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth="lg"
				disableEscapeKeyDown={true}
			>
				<DialogTitle>
					{t("shaxmatka.numerationModal.title")}
					<div className="close-btn-wrapper">
						<IconButton
							variant="onlyIcon"
							color="primary"
							onClick={() => setOpen(false)}
						>
							<i className="bi bi-x" />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent>
					<div>
						<TextField
							color="formColor"
							variant="outlined"
							fullWidth
							id="sheet-numeration-field"
							label={t("common.field.startNumber")}
							type="number"
							value={startNumber}
							onChange={(event) => setStartNumber(event.target.value)}
							autoComplete="off"
						/>
						<div className="flex items-center justify-between">
							<Button
								variant={
									startPlacement === "fromTop" ? "formContained" : "form"
								}
								color="secondary"
								endIcon={<i className="bi bi-sort-down-alt text-xl" />}
								value="fromTop"
								onClick={(event) => setStartPlacement(event.target.value)}
							>
								{t("shaxmatka.numerationModal.fromTop")}
							</Button>
							<Button
								variant={
									startPlacement === "fromBottom" ? "formContained" : "form"
								}
								color="secondary"
								endIcon={<i className="bi bi-sort-up-alt text-xl" />}
								value="fromBottom"
								onClick={(event) => setStartPlacement(event.target.value)}
							>
								{t("shaxmatka.numerationModal.fromBottom")}
							</Button>
						</div>
					</div>
				</DialogContent>
				<DialogActions>
					<div className="flex items-center pb-4 pr-4">
						<Button
							variant="outlined"
							color="error"
							onClick={() => setOpen(false)}
						>
							{t("common.button.reject")}
						</Button>
						<Button
							variant="outlined"
							color="primary"
							className="!ml-2"
							onClick={() => handleData()}
						>
							{t("common.button.save")}
						</Button>
					</div>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default ShaxmatkaBlock
