import {
	Button,
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material"
import DataTableSelectBox from "components/ui/excel-data/DataTableSelectBox"
import XLSXUploader from "components/ui/excel-data/XLSXUploader"
import FormAutocompleteField from "components/ui/form/FormAutocompleteField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import usePrevNext from "hooks/usePrevNext"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import * as yup from "yup"

const validationSchema = yup.object({
	name: yup
		.string()
		.min(3, { label: "settings.home.excel.validation.nameMin", value: 3 })
		.required("settings.home.excel.validation.name"),
	objects_id: yup.number().required("settings.home.excel.validation.objectId")
})

const HomeDataFromExcel = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const [data, setData] = useState([])
	const [newData, setNewData] = useState([])
	const [dataAndNewDataKeyValues, setDataAndNewDataKeyValues] = useState({})
	const [selectBoxOptions, setSelectBoxOptions] = useState([
		{
			label: "settings.home.excel.options.number",
			code: "number",
			disabled: false
		},
		{
			label: "settings.home.excel.options.stage",
			code: "stage",
			disabled: false
		},
		{
			label: "settings.home.excel.options.rooms",
			code: "rooms",
			disabled: false
		},
		{
			label: "settings.home.excel.options.square",
			code: "square",
			disabled: false
		},
		{
			label: "settings.home.excel.options.repaired",
			code: "repaired",
			disabled: false
		},
		{
			label: "settings.home.excel.options.norepaired",
			code: "norepaired",
			disabled: false
		},
		{
			label: "settings.home.excel.options.start",
			code: "start",
			disabled: false
		},
		{
			label: "settings.home.excel.options.islive",
			code: "islive",
			disabled: false
		},
		{
			label: "settings.home.excel.options.isrepaired",
			code: "isrepaired",
			disabled: false
		},
		{
			label: "settings.home.excel.options.status",
			code: "status",
			disabled: false
		}
	])
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [selectBoxFinished, setSelectBoxFinished] = useState(false)
	const { prev } = usePrevNext()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("settings.home.excel.title")}
			</div>
		)
	}, [i18n.language])

	const formik = useFormik({
		initialValues: {
			name: "",
			objects_id: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			try {
				setIsSubmitting(true)
				const response = await axiosPrivate.post(
					"/admin/import/block",
					JSON.stringify(values),
					{ headers: { "Content-Type": "application/json" } }
				)
				if (response.data && response.data?.data && response.data.status) {
					await handleHomesSubmit(
						response.data?.data?.id,
						response.data?.data?.name
					)
					// console.log("response.data1 = ", response.data)
				}
			} catch (error) {
				sendNotification({
					msg: error?.response?.data?.message || error?.message,
					variant: "error"
				})
				setIsSubmitting(false)
			}
		}
	})

	const handleHomesSubmit = async (blockId, blockName) => {
		try {
			newData.forEach((item) => (item.block_id = blockId))
			let values = { data: newData }
			const response = await axiosPrivate.post(
				"/admin/import/home",
				JSON.stringify(values),
				{ headers: { "Content-Type": "application/json" } }
			)
			if (response.data && response.data?.data && response.data.status) {
				sendNotification({
					msg: t("settings.home.excel.alerts.success", { value: blockName }),
					variant: "success"
				})
				setIsSubmitting(false)
				// console.log("response.data2 = ", response.data)
				prev()
			}
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsSubmitting(false)
		}
	}

	const handleSelectBoxChange = (valueCode, type) => {
		let foundItem = selectBoxOptions.find((item) => item.code === valueCode)
		foundItem.disabled = !foundItem.disabled
		if (foundItem.disabled) {
			data.forEach((item, index) => {
				newData[index] = { ...(newData[index] || {}), [valueCode]: item[type] }
			})
			setDataAndNewDataKeyValues({
				...dataAndNewDataKeyValues,
				[valueCode]: type
			})
		} else {
			data.forEach((item, index) => {
				delete newData[index][valueCode]
			})
			delete dataAndNewDataKeyValues[valueCode]
			// console.log("dataAndNewDataKeyValues = ", dataAndNewDataKeyValues)
			setDataAndNewDataKeyValues({
				...dataAndNewDataKeyValues
			})
		}
		// console.log("newData = ", newData)
		setNewData(newData)
		setSelectBoxOptions([...selectBoxOptions])
		setSelectBoxFinished(
			[...selectBoxOptions].reduce((acc, curr, ind) => acc && curr.disabled),
			true
		)
	}

	const handleResetTable = () => {
		setData([])
		setNewData([])
		setSelectBoxFinished(false)
		selectBoxOptions.forEach((item) => (item.disabled = false))
		setSelectBoxOptions([...selectBoxOptions])
	}

	const handleSortByNumberAndStage = () => {
		// console.log("dataAndNewDataKeyValues = ", dataAndNewDataKeyValues)
		if (dataAndNewDataKeyValues.stage) {
			let uniqueStages = Array.from(
				new Set(
					data
						.map((item) => item[dataAndNewDataKeyValues.stage])
						.filter((item) => !!item)
				)
			)
			uniqueStages.sort((x, y) => x - y)
			// console.log("uniqueStages = ", uniqueStages)
			let homesByStage = {}
			uniqueStages.forEach((stage) => {
				homesByStage[stage] = data.filter(
					(item) => item[dataAndNewDataKeyValues.stage] === stage
				)
			})
			// console.log("homesByStage = ", homesByStage)
			Object.keys(homesByStage).forEach((item) => {
				homesByStage[item] = homesByStage[item].sort(
					(x, y) =>
						x[dataAndNewDataKeyValues.number] -
						y[dataAndNewDataKeyValues.number]
				)
			})
			// console.log("homesByStage sorted = ", homesByStage)
			let sortedData = Object.keys(homesByStage)
				.map((item) => homesByStage[item])
				.flat()
			setData(sortedData)
			let sortedNewData = []
			Object.keys(newData[0]).forEach((item) => {
				newData.forEach((_, index) => {
					sortedNewData[index] = sortedData[dataAndNewDataKeyValues[item]]
				})
			})
		}
	}

	return (
		<div className="component-list-wrapper">
			<div className="component-list-header">
				<div className="header-actions-container mt-4 flex flex-row items-center">
					<div className="flex items-center justify-between flex-row w-full">
						<form
							onSubmit={formik.handleSubmit}
							className="flex flex-row items-center justify-between w-full my-shadow-1 p-4 rounded-lg"
						>
							<div className="flex flex-row w-1/2">
								<span className="w-1/2">
									<FormTextField
										delay={0}
										label={t("common.fields.blockName")}
										fieldName="name"
										formik={formik}
										disabled={isSubmitting}
									/>
								</span>
								<span className="ml-2 w-1/2">
									<FormAutocompleteField
										delay={0}
										fieldName="objects_id"
										label={t("common.fields.objectName")}
										formik={formik}
										path={"/dictionary/objects2"}
										disabled={isSubmitting}
									/>
								</span>
							</div>
							<Button
								color="success"
								variant="contained"
								type="submit"
								disabled={
									isSubmitting || !(newData.length > 0) || !selectBoxFinished
								}
							>
								{isSubmitting && (
									<CircularProgress
										size={15}
										color="inherit"
										className="mr-1"
									/>
								)}
								{t("common.button.save")}
							</Button>
						</form>
					</div>
				</div>
				<div className="header-actions-container mt-4 flex flex-row items-center">
					<XLSXUploader
						isSubmitting={isSubmitting}
						setData={setData}
						handleReset={handleResetTable}
					>
						<div className="flex items-center my-shadow-1 p-4 rounded-lg">
							<Button
								startIcon={<i className="bi bi-sort-numeric-down" />}
								variant="outlined"
								color="success"
								disabled={
									!selectBoxOptions[0].disabled || !selectBoxOptions[1].disabled
								}
								onClick={() => handleSortByNumberAndStage()}
							>
								{t("settings.home.excel.sort")}
							</Button>
							{/* <Button
									startIcon={<i className="bi bi-sort-numeric-down" />}
									variant="outlined"
									color="success"
									disabled={!selectBoxOptions[0].disabled}
								>
									Uy raqami bo'yicha saralash
								</Button>
								<Button
									startIcon={<i className="bi bi-sort-down-alt" />}
									variant="outlined"
									color="success"
									className="!ml-4"
									disabled={!selectBoxOptions[1].disabled}
								>
									Qavati bo'yicha saralash
								</Button> */}
						</div>
					</XLSXUploader>
				</div>
			</div>

			<div className="component-table-wrapper pb-8 mt-4">
				{data && data.length > 0 && (
					<TableContainer
						className={`flex-auto h-full${
							isSubmitting ? " opacity-40 select-none pointer-events-none" : ""
						}`}
					>
						<Table
							stickyHeader
							sx={{ minWidth: 750, height: "max-content" }}
							aria-labelledby="tableTitle"
						>
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									{Object.keys(data[0]).map((key) => (
										<TableCell key={`${key}-select-box`}>
											<DataTableSelectBox
												options={selectBoxOptions}
												setSelectedValue={handleSelectBoxChange}
												type={key}
											/>
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableCell>№</TableCell>
									{Object.keys(data[0]).map((key) => (
										<TableCell key={key} sx={{ whiteSpace: "nowrap" }}>
											{key}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody className="overflow-hidden">
								{data.map((row, rowIndex) => {
									return (
										<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
											<TableCell>{rowIndex + 1}</TableCell>
											{Object.values(row).map((value, index) => (
												<TableCell key={index}>
													{value !== null && value !== undefined ? value : null}
													{/* {value !== null
														? typeof value === "object"
															? moment(value).isValid()
																? moment(value).format("YYYY-MM-DD")
																: value
															: value
														: null} */}
												</TableCell>
											))}
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</div>
		</div>
	)
}

export default HomeDataFromExcel
