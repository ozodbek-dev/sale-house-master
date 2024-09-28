import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material"
import DataTableSelectBox from "components/ui/excel-data/DataTableSelectBox"
import XLSXUploader from "components/ui/excel-data/XLSXUploader"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

const UploadContractPaymentsListAndHistory = (props) => {
	const { open, setOpen, dialogData, options } = props
	const { t } = useTranslation()
	const [data, setData] = useState([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [selectBoxFinished, setSelectBoxFinished] = useState(false)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()
	const [newData, setNewData] = useState([])
	const [dataAndNewDataKeyValues, setDataAndNewDataKeyValues] = useState({})
	const [selectBoxOptions, setSelectBoxOptions] = useState(options)

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

	const handleClose = () => {
		setOpen(false)
		handleResetTable()
	}

	const handleHomesSubmit = async () => {
		try {
			setIsSubmitting(true)
			let values = { [dialogData.postValueKey]: newData }
			const response = await axiosPrivate.post(
				`/admin/import/${dialogData.path}`,
				JSON.stringify(values),
				{ headers: { "Content-Type": "application/json" } }
			)
			if (response.data && response.data.status) {
				sendNotification({
					msg: dialogData.successMsg,
					variant: "success"
				})
				setIsSubmitting(false)
				handleClose()
			}
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="upload-payments-list-and-history-dialog-title"
			aria-describedby="upload-payments-list-and-history-description"
			maxWidth="lg"
			disableEscapeKeyDown={true}
		>
			<DialogTitle id="upload-payments-list-and-history-dialog-title">
				<span className="pr-5">{dialogData.title}</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div className="mt-2">
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
											isSubmitting ||
											!(newData.length > 0) ||
											!selectBoxFinished
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
									isSubmitting
										? " opacity-40 select-none pointer-events-none"
										: ""
								}`}
							>
								<Table
									stickyHeader
									sx={{ minWidth: 750, height: "max-content" }}
									aria-labelledby="tableTitle"
								>
									<TableHead>
										<TableRow>
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
													{Object.values(row).map((value, index) => (
														<TableCell key={index}>
															{value && value !== null ? value : null}
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
			</DialogContent>
		</Dialog>
	)
}

export default UploadContractPaymentsListAndHistory
