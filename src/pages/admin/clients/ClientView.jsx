import { Button, Chip, CircularProgress, Tab, Tabs } from "@mui/material"
import BackButton from "components/ui/BackButton"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useTopPanel from "hooks/useTopPanel"
import moment from "moment"
import React, { Fragment, useEffect, useState } from "react"
import { useQueries } from "react-query"
import { useParams } from "react-router-dom"
import CLIENT_TYPE from "shared/clientTypeList"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import BaseTooltipCustomWidth from "components/ui/tooltips/BaseTooltipCustomWidth"
import ClientContract from "./ClientContract"
import ClientLoginAddEditModal from "./ClientLoginAddEditModal"
import { clientTypeVariants } from "shared/tableColVariantsList"
import { useTranslation } from "react-i18next"

const ClientView = () => {
	const { id } = useParams()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [openClientLoginModal, setOpenClientLoginModal] = useState(false)
	const [tabValue, setTabValue] = useState(0)
	const { setComponent } = useTopPanel()

	const [clientQuery, contractsQuery] = useQueries([
		{
			queryKey: "customerSingle",
			queryFn: async function () {
				const response = await axiosPrivate.get(`/admin/custom/edit/${id}`)
				return response.data.data
			},
			enabled: !hasError && !!id,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "clientContracts",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`/dictionary/customcontracts/${id}`
				)
				return response.data.data
			},
			/* onSuccess: (data) => {
				if (data && data.length > 0) {
					setTabValue(data[0]?.id)
				}
			}, */
			enabled: !hasError && !!id,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		}
	])

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

	const handleAddClientLoginPassword = () => {
		setOpenClientLoginModal(true)
	}

	const handleEditClientLoginPassword = () => {
		setOpenClientLoginModal(true)
	}

	useEffect(() => {
		setComponent(
			<div className="flex flex-row items-center">
				<BackButton />
				<div className="text-base-color text-xl font-medium flex flex-row">
					<BaseTooltipCustomWidth
						arrow={true}
						placement="bottom"
						enterDelay={1000}
						leaveTouchDelay={0}
						title={t("client.view.title", {
							surname: clientQuery?.data?.surname,
							name: clientQuery?.data?.name,
							middleName: clientQuery?.data?.middlename
						})}
						width={"800px"}
						fontSize={"1rem"}
					>
						<span className="text-line-1 max-w-[800px] ml-1">
							{t("client.view.title", {
								surname: clientQuery?.data?.surname,
								name: clientQuery?.data?.name,
								middleName: clientQuery?.data?.middlename
							})}
						</span>
					</BaseTooltipCustomWidth>
				</div>
			</div>
		)
	}, [clientQuery.data, i18n.language])

	return (
		<div className="component-add-edit-wrapper mx-4">
			{clientQuery.isLoading || clientQuery.isFetching ? (
				<div className="circular-progress-box py-5">
					<CircularProgress size={35} />
				</div>
			) : (
				<div className="client-view-wrapper">
					{clientQuery &&
					clientQuery?.data &&
					clientQuery.data.client_type &&
					clientQuery.data.client_type === CLIENT_TYPE.PHYSICAL.code ? (
						<Fragment>
							<div className="client-data-wrapper md:w-1/2 w-full pr-1">
								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.name")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.name}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.surname")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.surname}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.middleName")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.middlename}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.passportSeries")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.passport_series}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.issue")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.issue &&
											moment(clientQuery.data?.detail?.issue).format(
												"DD/MM/YYYY"
											)}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.authority")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.authority}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.workPlace")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.work_place}
									</div>
								</div>

								<div className="mt-4">
									{clientQuery.data.connect ? (
										<Button
											color="warning"
											variant="contained"
											onClick={() => handleEditClientLoginPassword()}
										>
											<span>{t("client.view.action.addPassword")}</span>
										</Button>
									) : (
										<Button
											color="success"
											variant="contained"
											onClick={() => handleAddClientLoginPassword()}
										>
											<span>{t("client.view.action.editPassword")}</span>
										</Button>
									)}
								</div>
							</div>

							<div className="client-data-wrapper md:w-1/2 w-full pl-1">
								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.birthday")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.birthday &&
											moment(clientQuery.data?.detail?.birthday).format(
												"DD/MM/YYYY"
											)}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.phone")}:
									</div>
									<div className="data-item-value flex flex-col">
										<PhoneFormat value={clientQuery.data?.phone} />
										<PhoneFormat value={clientQuery.data?.phone2} />
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.clientType")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.client_type &&
											setClientType(clientQuery.data?.client_type)}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.region")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.regions?.name}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.city")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.city}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.physical.address")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.home}
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
									<div className="data-item-value">
										{clientQuery.data?.name}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.tin")}:
									</div>
									<div className="data-item-value">{clientQuery.data?.inn}</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.mfo")}:
									</div>
									<div className="data-item-value">{clientQuery.data?.mfo}</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.oked")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.oked}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.accountNumber")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.account_number}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.bank")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.bank_name}
									</div>
								</div>

								<div className="mt-4">
									{clientQuery.data.connect ? (
										<Button
											color="warning"
											variant="contained"
											onClick={() => handleEditClientLoginPassword()}
										>
											<span>{t("client.view.action.addPassword")}</span>
										</Button>
									) : (
										<Button
											color="success"
											variant="contained"
											onClick={() => handleAddClientLoginPassword()}
										>
											<span>{t("client.view.action.editPassword")}</span>
										</Button>
									)}
								</div>
							</div>

							<div className="client-data-wrapper md:w-1/2 w-full">
								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.phone")}:
									</div>
									<div className="data-item-value flex flex-col">
										<PhoneFormat value={clientQuery.data?.phone} />
										<PhoneFormat value={clientQuery.data?.phone2} />
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.clientType")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.client_type &&
											setClientType(clientQuery.data?.client_type)}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.region")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.regions?.name}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.city")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.city}
									</div>
								</div>

								<div className="client-data-item">
									<div className="data-item-title">
										{t("client.view.legal.address")}:
									</div>
									<div className="data-item-value">
										{clientQuery.data?.detail?.home}
									</div>
								</div>
							</div>
						</Fragment>
					)}
				</div>
			)}

			<div className="client-contracts-wrapper mt-6 pb-6">
				<div className="client-contracts-title text-xl font-medium text-center mb-4">
					{t("client.view.clientContracts")}
				</div>
				{contractsQuery.isLoading || contractsQuery.isFetching ? (
					<div className="circular-progress-box py-5">
						<CircularProgress size={35} />
					</div>
				) : contractsQuery &&
				  contractsQuery.data &&
				  contractsQuery.data.length > 0 ? (
					<Fragment>
						<Tabs
							value={tabValue}
							onChange={(event, newValue) => setTabValue(newValue)}
							className="client-contracts-tabs"
						>
							{contractsQuery.data.map((contract, index) => (
								<Tab
									label={t("client.view.contract", { value: contract?.name })}
									value={index}
									key={`contract-tab-${contract?.id}`}
								/>
							))}
						</Tabs>
						<ClientContract
							contractData={contractsQuery.data[tabValue]}
							refetchFn={contractsQuery.refetch}
						/>
					</Fragment>
				) : (
					<div className="mt-6 p-4 rounded-lg my-shadow-2">
						<span className="no-data-found-wrapper">
							<i className="bi bi-exclamation-octagon text-xl mr-1 leading-3" />{" "}
							{t("client.view.noContractsFound")}
						</span>
					</div>
				)}
			</div>

			{openClientLoginModal && (
				<ClientLoginAddEditModal
					open={openClientLoginModal}
					setOpen={setOpenClientLoginModal}
					clientData={clientQuery.data}
					refetch={clientQuery.refetch}
				/>
			)}
		</div>
	)
}

export default ClientView
