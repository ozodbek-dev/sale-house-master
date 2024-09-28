import {
	Button,
	ButtonBase,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	TextField
} from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { useState } from "react"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import CLIENT_TYPE from "shared/clientTypeList"
import { useTranslation } from "react-i18next"

const ContractCancellationModal = (props) => {
	const { open, setOpen, data: contractData, refetch } = props
	const { t } = useTranslation()
	const [isCancellationSubmitting, setIsCancellationSubmitting] =
		useState(false)
	const [isChangeClientSubmitting, setIsChangeClientSubmitting] =
		useState(false)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()
	const [clientId, setClientId] = useState("")
	const [clientsList, setClientsList] = useState([])
	const [clientsLoading, setClientsLoading] = useState(false)
	const [clientName, setClientName] = useState("")

	const handleClose = () => {
		setClientId("")
		setClientsList([])
		setOpen(false)
	}

	const handleClient = (id) => {
		Array.from(document.getElementsByClassName("client-item")).forEach(
			(item) =>
				item.id !== `client-${id}` && item.classList.remove("item-selected")
		)
		document.getElementById(`client-${id}`).classList.toggle("item-selected")
		if (clientId === id) {
			setClientId("")
		} else {
			setClientId(id)
		}
	}

	const handleKeyDown = async (event) => {
		if (event.keyCode === 13) {
			setClientId("")
			setClientsLoading(true)
			const response = await axiosPrivate.get(
				`/dictionary/customs?name=${clientName || ""}`
			)
			if (response.data && response.data.status) {
				setClientsList(response.data.data.data)
			}
			setClientsLoading(false)
		}
	}

	const handleCancellation = async () => {
		try {
			setIsCancellationSubmitting(true)
			const response = await axiosPrivate.post(
				`/admin/contract/cancel/${contractData?.id}`,
				JSON.stringify(""),
				{ headers: { "Content-Type": "application/json" } }
			)
			if (response.data && response.data.status) {
				sendNotification({
					msg: t("contract.modal.cancel.alerts.success.cancelled"),
					variant: "success"
				})
				setIsCancellationSubmitting(false)
				handleClose()
				refetch()
			}
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsCancellationSubmitting(false)
		}
	}

	const handleChangeClient = async () => {
		let clientData = clientsList.filter((item) => item.id === clientId)[0]
		let updateCustomData = {
			client_type: clientData.client_type,
			client_id: clientData.id
		}
		try {
			setIsChangeClientSubmitting(true)
			const response = await axiosPrivate.post(
				`/admin/contract/updatecustom/${contractData?.id}`,
				JSON.stringify(updateCustomData),
				{
					headers: { "Content-Type": "application/json" }
				}
			)
			if (response.data && response.data.status) {
				if (clientData.client_type === CLIENT_TYPE.PHYSICAL.code) {
					submitPhysicDetail(clientData)
				} else {
					submitLegalDetail(clientData)
				}
			}
		} catch (error) {
			sendNotification({
				msg: error?.response?.data?.message || error?.message,
				variant: "error"
			})
			setIsChangeClientSubmitting(false)
		}
	}

	const handleResponse = (response) => {
		if (response.data && response.data.status) {
			sendNotification({
				msg: t("contract.modal.cancel.alerts.success.updated", {
					value: contractData?.name
				}),
				variant: "success"
			})
			handleClose()
			refetch()
		}
		setIsChangeClientSubmitting(false)
	}

	const submitPhysicDetail = async (clientData) => {
		let submitValues = {
			passport_series: clientData.detail.passport_series,
			issue: clientData.detail.issue,
			authority: clientData.detail.authority,
			birthday: clientData.detail.birthday,
			region_id: clientData.detail.region_id,
			city: clientData.detail.city,
			home: clientData.detail.home,
			work_place: clientData.detail.work_place,
			contract_id: contractData?.id
		}
		try {
			setIsChangeClientSubmitting(true)
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
			setIsChangeClientSubmitting(false)
		}
	}

	const submitLegalDetail = async (clientData) => {
		let submitValues = {
			contract_id: contractData?.id,
			name: clientData.detail.name,
			phone: clientData.detail.phone,
			region_id: clientData.detail.region_id,
			city: clientData.detail.city,
			home: clientData.detail.home,
			inn: clientData.detail.inn,
			mfo: clientData.detail.mfo,
			oked: clientData.detail.oked,
			account_number: clientData.detail.account_number,
			bank_name: clientData.detail.bank_name
		}
		try {
			setIsChangeClientSubmitting(true)
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
			setIsChangeClientSubmitting(false)
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			maxWidth="lg"
			disableEscapeKeyDown={true}
		>
			<DialogTitle id="order-dialog-title">
				<span className="text-xl">
					{t("contract.modal.cancel.title", { value: contractData?.name })}
				</span>
				<div className="absolute top-[2px] right-[5px]">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div className="flex pb-8 cancellation-modal-wrapper">
					<div className="w-full client-wrapper">
						<Grid
							container
							spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
						>
							<Grid item={true} lg={6} md={8} sm={12} xs={12}>
								<TextField
									color="formColor"
									variant="outlined"
									fullWidth
									id="client-name-field"
									name="client-name-field"
									label={t("common.fields.clientName")}
									value={clientName}
									onChange={(event) => setClientName(event.target.value)}
									onKeyDown={handleKeyDown}
									autoComplete="off"
								/>
							</Grid>
						</Grid>
						<div className="clients-database-wrapper py-2">
							<div className="clients-database-title text-lg text-base-color">
								{t("contract.modal.cancel.clientsData")}:
							</div>
							<div className="clients-database-body flex flex-col mt-2">
								{clientsLoading ? (
									<div className="circular-progress-box py-5">
										<CircularProgress size={30} />
									</div>
								) : clientsList && clientsList.length > 0 ? (
									clientsList.map((client) => (
										<ButtonBase
											className="client-item"
											id={`client-${client.id}`}
											key={client.id}
											onClick={() => handleClient(client.id)}
										>
											<div className="name">
												{client.surname} {client.name} {client.middlename}
											</div>
											<div className="phone">
												<PhoneFormat value={client.phone} />
											</div>
										</ButtonBase>
									))
								) : (
									<div className="text-gray-400 flex items-center">
										<i className="bi bi-exclamation-octagon text-lg mr-1 flex items-center" />{" "}
										<span className="text-sm">
											{t("contract.modal.cancel.noClientFound")}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<div>
						<Button
							variant="contained"
							color="success"
							disabled={!clientId || isChangeClientSubmitting}
							onClick={() => handleChangeClient()}
						>
							{isChangeClientSubmitting && (
								<CircularProgress size={15} color="inherit" className="mr-1" />
							)}
							{t("contract.modal.cancel.changeClient")}
						</Button>
						<Button
							variant="contained"
							color="error"
							className="!ml-2"
							onClick={() => handleCancellation()}
							disabled={isCancellationSubmitting}
						>
							{isCancellationSubmitting && (
								<CircularProgress size={15} color="inherit" className="mr-1" />
							)}
							{t("contract.modal.cancel.contractCancel")}
						</Button>
					</div>
					<Button
						variant="outlined"
						color="primary"
						sx={{ height: "initial" }}
						className="!ml-12"
						onClick={() => handleClose()}
					>
						{t("contract.modal.cancel.closeWindow")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ContractCancellationModal
