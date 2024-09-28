import { Button } from "@mui/material"
import useNotification from "hooks/useNotification"
import moment from "moment"
import React, { Fragment, useEffect, useRef, useState } from "react"
import * as XLSX from "xlsx"
import * as moment_round from "spotoninc-moment-round"
import { useTranslation } from "react-i18next"

const XLSXUploader = ({
	children,
	setData = () => {},
	handleReset = () => {},
	isSubmitting = false
}) => {
	const { t } = useTranslation()
	const [dataFile, setDataFile] = useState(null)
	const [fileSheets, setFileSheets] = useState([])
	const inputRef = useRef(null)
	const [dragActive, setDragActive] = useState(false)
	const sendNotification = useNotification()

	useEffect(() => {
		moment_round.monkey(moment)
	}, [])

	const handleDrag = function (e) {
		e.preventDefault()
		e.stopPropagation()
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true)
		} else if (e.type === "dragleave") {
			setDragActive(false)
		}
	}

	const handleDrop = function (e) {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleUploadedFile(e.dataTransfer.files[0])
		}
	}

	const handleChange = function (e) {
		e.preventDefault()
		if (e.target.files && e.target.files[0]) {
			handleUploadedFile(e.target.files[0])
		}
	}

	const onButtonClick = () => {
		inputRef.current.click()
	}

	const handleUploadedFile = (file) => {
		console.log("file = ", file)
		if (
			[
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"application/vnd.ms-excel",
				"application/wps-office.xlsx"
			].includes(file.type)
		) {
			setDataFile(file)
			const reader = new FileReader()
			reader.readAsBinaryString(file)
			reader.onload = (e) => {
				const data = e.target.result
				const workbook = XLSX.read(data, {
					type: "binary",
					cellDates: true,
					cellFormula: false,
					cellHTML: false,
					cellNF: false,
					cellText: false,
					dense: true
				})
				const sheetName = workbook.SheetNames[0]
				const sheet = workbook.Sheets[sheetName]
				const parsedData = XLSX.utils.sheet_to_json(sheet, {
					defval: null
				})
				// console.log("parsedData = ", parsedData)
				setFileSheets(sheet)
			}
		} else {
			sendNotification({
				msg: t("common.alerts.warning.onlyExcelFormat"),
				variant: "warning"
			})
		}
	}

	useEffect(() => {
		if (fileSheets && fileSheets.length > 0) {
			// console.log("fileSheets = ", fileSheets)
			let newSheet = [...fileSheets.filter(Boolean)]
			let dataKeys = newSheet[0].map((item) => item.v)
			// console.log("dataKeys = ", dataKeys)
			// console.log("newSheet = ", newSheet)
			let newData = []
			for (let index = 1; index < newSheet.length; index++) {
				let obj = {}
				dataKeys.forEach((k, i) => {
					/* obj[k] =
						newSheet[index][i]?.v !== null &&
						newSheet[index][i]?.v !== undefined
							? newSheet[index][i]?.v
							: null */

					obj[k] =
						newSheet[index][i]?.v !== null &&
						newSheet[index][i]?.v !== undefined
							? typeof newSheet[index][i]?.v === "object"
								? moment(newSheet[index][i]?.v).isValid()
									? formatDate(newSheet[index][i]?.v)
									: JSON.stringify(newSheet[index][i]?.v)
								: newSheet[index][i]?.v
							: null
				})
				newData.push(obj)
			}
			// console.log("newData = ", newData)
			setData(newData)
		}
	}, [fileSheets])

	const formatDate = (date) => {
		let d = new moment(date)
		return d.round(5, "hours").format("YYYY-MM-DD")
	}

	const resetUploader = () => {
		setDataFile(null)
		handleReset()
	}

	return (
		<Fragment>
			{dataFile ? (
				<div className="flex items-center justify-between flex-row w-full">
					<div className="flex items-center my-shadow-1 p-4 rounded-lg">
						<div className="mr-4">
							<span className="font-medium">{t("xlsxUploader.fileName")}:</span>{" "}
							{dataFile?.name}
						</div>
						<Button
							startIcon={<i className="bi bi-trash3" />}
							variant="outlined"
							color="error"
							onClick={() => resetUploader()}
							disabled={isSubmitting}
						>
							{t("common.button.cancel")}
						</Button>
					</div>
					{children}
				</div>
			) : (
				<form
					id="form-file-upload"
					onDragEnter={handleDrag}
					onSubmit={(e) => e.preventDefault()}
				>
					<input
						ref={inputRef}
						type="file"
						id="input-file-upload"
						accept=".xlsx, .xls"
						onChange={handleChange}
					/>
					<label
						id="label-file-upload"
						htmlFor="input-file-upload"
						className={dragActive ? "drag-active" : ""}
					>
						<div>
							<p className="mb-2">{t("xlsxUploader.pasteHere")}</p>
							<Button variant="outlined" onClick={onButtonClick}>
								{t("xlsxUploader.clickToUpload")}
							</Button>
						</div>
					</label>
					{dragActive && (
						<div
							id="drag-file-element"
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}
						></div>
					)}
				</form>
			)}
		</Fragment>
	)
}

export default XLSXUploader
