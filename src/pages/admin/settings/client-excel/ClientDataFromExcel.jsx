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
import { useTranslation } from "react-i18next"

const ClientDataFromExcel = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const [data, setData] = useState([])
	const [newData, setNewData] = useState([])
	const [dataAndNewDataKeyValues, setDataAndNewDataKeyValues] = useState({})
	const [selectBoxOptions, setSelectBoxOptions] = useState([
		{
			label: "settings.client.options.name",
			code: "name",
			disabled: false
		},
		{
			label: "settings.client.options.middleName",
			code: "middlename",
			disabled: false
		},
		{
			label: "settings.client.options.surname",
			code: "surname",
			disabled: false
		},
		{
			label: "settings.client.options.phone",
			code: "phone",
			disabled: false
		},
		{
			label: "settings.client.options.phone2",
			code: "phone2",
			disabled: false
		},
		{
			label: "settings.client.options.passportSeries",
			code: "passport_series",
			disabled: false
		},
		{
			label: "settings.client.options.issue",
			code: "issue",
			disabled: false
		},
		{
			label: "settings.client.options.authority",
			code: "authority",
			disabled: false
		},
		{
			label: "settings.client.options.birthday",
			code: "birthday",
			disabled: false
		},
		{
			label: "settings.client.options.regionId",
			code: "region_id",
			disabled: false
		},
		{
			label: "settings.client.options.city",
			code: "city",
			disabled: false
		},
		{
			label: "settings.client.options.home",
			code: "home",
			disabled: false
		},
		{
			label: "settings.client.options.workPlace",
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
				{t("settings.client.title")}
			</div>
		)
	}, [i18n.language])

	const handleHomesSubmit = async () => {
		try {
			setIsSubmitting(true)
			let values = { data: newData }
			const response = await axiosPrivate.post(
				"/admin/import/customs",
				JSON.stringify(values),
				{ headers: { "Content-Type": "application/json" } }
			)
			if (response.data && response.data.status) {
				sendNotification({
					msg: t("settings.client.alerts.success"),
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

	return (
		<div className="component-list-wrapper">
			<div className="component-list-header mb-2">
				<div className="header-actions-container mt-4 flex flex-row items-center">
					<XLSXUploader
						isSubmitting={isSubmitting}
						setData={setData}
						handleReset={handleResetTable}
					>
						<div className="flex items-center my-shadow-1 p-4 rounded-lg">
							<Button
								color="success"
								variant="contained"
								disabled={
									isSubmitting || !(newData.length > 0) || !selectBoxFinished
								}
								onClick={() => handleHomesSubmit()}
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
									{Object.keys(data[0]).map((dataKey) => (
										<TableCell key={`${dataKey}-select-box`}>
											<DataTableSelectBox
												options={selectBoxOptions}
												setSelectedValue={handleSelectBoxChange}
												type={dataKey}
											/>
										</TableCell>
									))}
								</TableRow>
								<TableRow>
									<TableCell>№</TableCell>
									{Object.keys(data[0]).map((dataKey) => (
										<TableCell key={dataKey} sx={{ whiteSpace: "nowrap" }}>
											{dataKey}
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
													{/* {value !== null ? (
														typeof value === "object" ? (
															moment(value).isValid() ? (
																<span>
																	{moment(value).format("YYYY-MM-DD")}
																</span>
															) : (
																value
															)
														) : (
															value
														)
													) : null} */}
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

export default ClientDataFromExcel
