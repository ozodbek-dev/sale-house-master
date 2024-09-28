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
import XLSXUploader from "components/ui/excel-data/XLSXUploader"
import DataTableSelectBox from "components/ui/excel-data/DataTableSelectBox"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import usePrevNext from "hooks/usePrevNext"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import FormAutocompleteField from "components/ui/form/FormAutocompleteField"
import { useFormik } from "formik"
import * as yup from "yup"
import { useTranslation } from "react-i18next"

const validationSchema = yup.object({
	block_id: yup.number().required("settings.contract.validation.blockId"),
	objects_id: yup.number().required("settings.contract.validation.objectId")
})

const ContractDataFromExcel = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const [data, setData] = useState([])
	const [newData, setNewData] = useState([])
	const [dataAndNewDataKeyValues, setDataAndNewDataKeyValues] = useState({})
	const [selectBoxOptions, setSelectBoxOptions] = useState([
		{
			label: "settings.contract.options.name",
			code: "name",
			disabled: false
		},
		{
			label: "settings.contract.options.homeNumber",
			code: "home_number",
			disabled: false
		},
		{
			label: "settings.contract.options.square",
			code: "square",
			disabled: false
		},
		{
			label: "settings.contract.options.isrepaired",
			code: "isrepaired",
			disabled: false
		},
		{
			label: "settings.contract.options.startPrice",
			code: "start_price",
			disabled: false
		},
		{
			label: "settings.contract.options.price",
			code: "price",
			disabled: false
		},
		{
			label: "settings.contract.options.month",
			code: "month",
			disabled: false
		},
		{
			label: "settings.contract.options.startDate",
			code: "start_date",
			disabled: false
		},
		{
			label: "settings.contract.options.discount",
			code: "discount",
			disabled: false
		},
		{
			label: "settings.contract.options.comment",
			code: "comment",
			disabled: false
		},
		{
			label: "settings.contract.options.passportSeries",
			code: "passport_series",
			disabled: false
		},
		{
			label: "settings.contract.options.issue",
			code: "issue",
			disabled: false
		},
		{
			label: "settings.contract.options.authority",
			code: "authority",
			disabled: false
		},
		{
			label: "settings.contract.options.birthday",
			code: "birthday",
			disabled: false
		},
		{
			label: "settings.contract.options.regionId",
			code: "region_id",
			disabled: false
		},
		{
			label: "settings.contract.options.city",
			code: "city",
			disabled: false
		},
		{
			label: "settings.contract.options.home",
			code: "home",
			disabled: false
		},
		{
			label: "settings.contract.options.workPlace",
			code: "work_place",
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
				{t("settings.contract.title")}
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
				let postData = {
					data: newData
				}
				const response = await axiosPrivate.post(
					`/admin/import/contracts/${values.block_id}`,
					JSON.stringify(postData),
					{ headers: { "Content-Type": "application/json" } }
				)
				// console.log("response.data = ", response.data)
				if (response.data && response.data.status) {
					sendNotification({
						msg: t("settings.contract.alerts.success"),
						variant: "success"
					})
					setIsSubmitting(false)
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
	})

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
			setDataAndNewDataKeyValues({
				...dataAndNewDataKeyValues
			})
		}
		// console.log("data = ", data)
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
									<FormAutocompleteField
										delay={0}
										fieldName="objects_id"
										label={t("common.fields.objectName")}
										formik={formik}
										path={"/dictionary/objects2"}
										disabled={isSubmitting}
									/>
								</span>
								{formik?.values?.objects_id && (
									<span className="ml-2 w-1/2">
										<FormAutocompleteField
											delay={0}
											fieldName="block_id"
											label={t("common.fields.blockName")}
											formik={formik}
											path={`admin/block/index/${formik?.values?.objects_id}`}
											disabled={isSubmitting}
										/>
									</span>
								)}
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
					/>
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

export default ContractDataFromExcel
