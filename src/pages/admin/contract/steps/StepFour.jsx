import { Button, CircularProgress } from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import React, { useState } from "react"
import CLIENT_TYPE from "shared/clientTypeList"
import { motion } from "framer-motion"
import { stepperItem } from "utils/motion"
import ContractDocumentDownloadModal from "../ContractDocumentDownloadModal"
import useNotification from "hooks/useNotification"
import { useTranslation } from "react-i18next"

const StepFour = ({
	appear,
	direction,
	back,
	clientData,
	homeData,
	paymentData
}) => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [open, setOpen] = useState(false)
	const sendNotification = useNotification()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [contractData, setContractData] = useState("")

	const handleResponse = (response, requestType) => {
		if (response.data && response.data.status) {
			sendNotification({
				msg: t("contract.step.four.alerts.success", {
					value: paymentData?.name
				}),
				variant: "success"
			})
			setOpen(true)
		}
		setIsSubmitting(false)
	}

	const submitPhysicDetail = async (contractId) => {
		let submitValues = {
			passport_series: clientData.passport_series,
			issue: clientData.issue,
			authority: clientData.authority,
			birthday: clientData.birthday,
			region_id: clientData.region_id,
			city: clientData.city,
			home: clientData.home,
			work_place: clientData.work_place,
			contract_id: contractId
		}
		try {
			setIsSubmitting(true)
			const response = await axiosPrivate.post(
				"/admin/contractdetail/store",
				JSON.stringify(submitValues),
				{
					headers: { "Content-Type": "application/json" }
				}
			)
			handleResponse(response)
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsSubmitting(false)
		}
	}

	const submitLegalDetail = async (contractId) => {
		let submitValues = {
			contract_id: contractId,
			name: clientData.name,
			phone: clientData.phone,
			phone2: clientData.phone2 || null,
			region_id: clientData.region_id,
			city: clientData.city,
			home: clientData.home,
			inn: clientData.inn,
			mfo: clientData.mfo,
			oked: clientData.oked,
			account_number: clientData.account_number,
			bank_name: clientData.bank_name
		}
		try {
			setIsSubmitting(true)
			const response = await axiosPrivate.post(
				"/admin/contractdetail/legalstore",
				JSON.stringify(submitValues),
				{
					headers: { "Content-Type": "application/json" }
				}
			)
			handleResponse(response)
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsSubmitting(false)
		}
	}

	const handleCreateContract = async () => {
		let submitValues = {
			home_id: homeData.id,
			client_id: clientData.id,
			client_type: clientData.client_type,
			price: paymentData.price,
			start_price: paymentData.start_price,
			date: paymentData.startDate,
			month: paymentData.month,
			payments: paymentData.payments,
			discount: paymentData.discount,
			name: paymentData.name,
			comment: paymentData.comment,
			isrepaired: paymentData.isrepaired,
			isvalute: paymentData.isvalute
		}

		try {
			setIsSubmitting(true)
			const response = await axiosPrivate.post(
				"/admin/contract/store",
				JSON.stringify(submitValues),
				{
					headers: { "Content-Type": "application/json" }
				}
			)
			if (response.data && response.data.status) {
				setContractData(response.data?.data)
				if (clientData.client_type === CLIENT_TYPE.PHYSICAL.code) {
					submitPhysicDetail(response?.data?.data?.id)
				} else {
					submitLegalDetail(response?.data?.data?.id)
				}
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
		<motion.div
			variants={stepperItem({
				direction: direction,
				duration: 0
			})}
			initial="hidden"
			animate={appear ? "show" : "hidden"}
		>
			<div className="component-add-wrapper">
				<div className="component-add-body flex justify-center">
					<div className="text-center">
						<Button
							color="success"
							variant="contained"
							type="submit"
							className="!h-[47px]"
							onClick={handleCreateContract}
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<CircularProgress size={15} color="inherit" className="mr-1" />
							)}
							{t("contract.step.four.createContract")}
						</Button>
					</div>
				</div>

				<div className="text-center mt-4">
					<Button onClick={back} color="inherit" variant="contained">
						{t("common.button.back")}
					</Button>
				</div>
				<ContractDocumentDownloadModal
					open={open}
					setOpen={setOpen}
					data={contractData}
				/>
			</div>
		</motion.div>
	)
}

export default StepFour
