import { CircularProgress, Fab } from "@mui/material"
import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import { saveAs } from "file-saver"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { useEffect, useState } from "react"
import template from "../../../template/Payment.docx"
import moment from "moment"
import "moment/locale/ru"
import { numericFormatter } from "react-number-format"

const GenerateCheque = ({ id, sum }) => {
	const [canDownload, setCanDownload] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()
	const localeMoment = moment
	localeMoment.locale("ru")

	const getChequeData = async () => {
		try {
			setIsSubmitting(true)
			const response = await axiosPrivate.get(`/dictionary/payment/${id}`, {
				headers: { "Content-Type": "application/json" }
			})
			if (response.data && response.data.status && response.data.data) {
				await generateDocument(response.data.data)
				setIsSubmitting(false)
			}
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsSubmitting(false)
		}
	}

	const generateDocument = async (responseData) => {
		let templateData = {
			company:
				responseData?.payment?.contract?.homes?.blocks?.objects?.companies
					?.name,
			id: responseData?.payment?.id,
			date:
				responseData?.payment?.date &&
				localeMoment(responseData?.payment?.date).format("DD"),
			month:
				responseData?.payment?.date &&
				localeMoment(responseData?.payment?.date).format("MMMM"),
			year:
				responseData?.payment?.date &&
				localeMoment(responseData?.payment?.date).format("YYYY"),
			custom: `${responseData?.payment?.contract2?.custom?.surname} ${responseData?.payment?.contract2?.custom?.name} ${responseData?.payment?.contract2?.custom?.middlename}`,
			contractName: responseData?.payment?.contract?.name,
			objectName: responseData?.payment?.contract?.homes?.blocks?.objects?.name,
			blockName: responseData?.payment?.contract?.homes?.blocks?.name,
			homeNumber: responseData?.payment?.contract?.homes?.number,
			paymentPrice: responseData?.payment?.sum
				? numericFormatter(responseData?.payment?.sum, {
						decimalScale: 3,
						thousandSeparator: " ",
						allowNegative: false
				  })
				: "0",
			paymentPriceText: responseData?.numbertext,
			paymentType: responseData?.payment?.types?.name
		}
		try {
			let response = await fetch(template)
			let data = await response.arrayBuffer()

			let zip = PizZip(data)

			let templateDoc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true
			})

			templateDoc.render(templateData)

			let generatedDoc = templateDoc.getZip().generate({
				type: "blob",
				mimeType:
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				compression: "DEFLATE"
			})

			saveAs(generatedDoc, `To'lov.docx`)
		} catch (error) {
			console.log("Error: " + error)
		}
	}

	useEffect(() => {
		if (sum && parseFloat(sum) === 0) {
			setCanDownload(false)
		}
	}, [])

	return (
		<Fab
			color="info"
			variant="action"
			aria-label="list"
			onClick={() => getChequeData()}
			disabled={isSubmitting || !canDownload}
		>
			{isSubmitting ? (
				<CircularProgress size={15} color="inherit" />
			) : (
				<i className="bi bi-journal-text" />
			)}
		</Fab>
	)
}

export default GenerateCheque
