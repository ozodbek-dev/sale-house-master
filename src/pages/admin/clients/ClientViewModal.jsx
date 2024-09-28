import {
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton
} from "@mui/material"
import React, { Fragment } from "react"
import moment from "moment"
import CLIENT_TYPE from "shared/clientTypeList"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import { clientTypeVariants } from "shared/tableColVariantsList"
import { useTranslation } from "react-i18next"

const ClientViewModal = (props) => {
	const { open, setOpen, data: clientData } = props
	const { t } = useTranslation()

	const handleClose = () => {
		setOpen(false)
	}

	const setClientType = (item) => {
		let result = clientTypeVariants.filter((variant) => variant.code === item)
		if (result.length > 0) {
			return (
				<Chip
					label={t(result[0].label)}
					variant="tableBadge"
					color={result[0].color}
				/>
			)
		}
		return ""
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
			<DialogTitle id="order-view-dialog-title">
				<span className="text-xl">
					{t("client.view.title", {
						surname: clientData?.surname,
						name: clientData?.name,
						middleName: clientData?.middlename
					})}
				</span>
				<div className="close-btn-wrapper">
					<IconButton variant="onlyIcon" color="primary" onClick={handleClose}>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</DialogTitle>

			<DialogContent>
				<div className="md:w-[800px] min-w-[300px]">
					<div className="flex md:flex-row flex-col pb-8 client-view-modal-wrapper">
						{clientData &&
						clientData.client_type &&
						clientData.client_type === CLIENT_TYPE.PHYSICAL.code ? (
							<Fragment>
								<div className="client-data-wrapper md:w-1/2 w-full pr-1">
									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.name")}:
										</div>
										<div className="data-item-value">{clientData?.name}</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.surname")}:
										</div>
										<div className="data-item-value">{clientData?.surname}</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.middleName")}:
										</div>
										<div className="data-item-value">
											{clientData?.middlename}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.passportSeries")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.passport_series}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.issue")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.issue &&
												moment(clientData?.detail?.issue).format("DD/MM/YYYY")}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.authority")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.authority}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.workPlace")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.work_place}
										</div>
									</div>
								</div>

								<div className="client-data-wrapper md:w-1/2 w-full pl-1">
									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.birthday")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.birthday &&
												moment(clientData?.detail?.birthday).format(
													"DD/MM/YYYY"
												)}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.phone")}:
										</div>
										<div className="data-item-value flex flex-col">
											<PhoneFormat value={clientData?.phone} />
											<PhoneFormat value={clientData?.phone2} />
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.clientType")}:
										</div>
										<div className="data-item-value">
											{clientData?.client_type &&
												setClientType(clientData?.client_type)}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.region")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.regions?.name}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.city")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.city}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.physical.address")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.home}
										</div>
									</div>
								</div>
							</Fragment>
						) : (
							<Fragment>
								<div className="client-data-wrapper md:w-1/2 w-full">
									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.name")}:
										</div>
										<div className="data-item-value">{clientData?.name}</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.tin")}:
										</div>
										<div className="data-item-value">{clientData?.inn}</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.mfo")}:
										</div>
										<div className="data-item-value">{clientData?.mfo}</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.oked")}:
										</div>
										<div className="data-item-value">{clientData?.oked}</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.accountNumber")}:
										</div>
										<div className="data-item-value">
											{clientData?.account_number}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.bank")}:
										</div>
										<div className="data-item-value">
											{clientData?.bank_name}
										</div>
									</div>
								</div>

								<div className="client-data-wrapper md:w-1/2 w-full">
									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.phone")}:
										</div>
										<div className="data-item-value flex flex-col">
											<PhoneFormat value={clientData?.phone} />
											<PhoneFormat value={clientData?.phone2} />
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.clientType")}:
										</div>
										<div className="data-item-value">
											{clientData?.client_type &&
												setClientType(clientData?.client_type)}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.region")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.regions?.name}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.city")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.city}
										</div>
									</div>

									<div className="client-data-item">
										<div className="data-item-title">
											{t("client.view.legal.address")}:
										</div>
										<div className="data-item-value">
											{clientData?.detail?.home}
										</div>
									</div>
								</div>
							</Fragment>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ClientViewModal
