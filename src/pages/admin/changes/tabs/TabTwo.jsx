import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fadeUp, tabItem } from "utils/motion"
import TabPanel from "components/ui/tabs/TabPanel"
import { useQueries } from "react-query"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import { Button, ButtonBase, CircularProgress, Grid } from "@mui/material"
import * as yup from "yup"
import { useFormik } from "formik"
import moment from "moment"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import FormTextField from "components/ui/form/FormTextField"
import FormDateField from "components/ui/form/FormDateField"
import FormCurrencyField from "components/ui/form/FormCurrencyField"
import FormRadioGroupField from "components/ui/form/FormRadioGroupField"
import FormMultilineTextField from "components/ui/form/FormMultilineTextField"
import useNotification from "hooks/useNotification"
import FormSimpleSelectField from "components/ui/form/FormSimpleSelectField"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import CONTRACT_STATUS_TYPE from "shared/contractStatusTypeList"
import {
	currencyTypeSelectOptions,
	repairTypeSelectOptions
} from "shared/selectOptionsList"
import { useTranslation } from "react-i18next"

const validationSchema = yup.object({
	name: yup.string().required("change.tab.contract.validation.name"),
	isrepaired: yup
		.string()
		.required("change.tab.contract.validation.isrepaired"),
	client_id: yup.string().required("change.tab.contract.validation.clientId"),
	date: yup
		.date()
		.nullable()
		.typeError("change.tab.contract.validation.dateValid")
		.required("change.tab.contract.validation.date"),
	sum: yup.number().required("change.tab.contract.validation.sum"),
	start_price: yup
		.number()
		.required("change.tab.contract.validation.startPrice"),
	month: yup.number().required("change.tab.contract.validation.month"),
	discount: yup.number().default(0).optional(),
	comment: yup.string().optional(),
	isvalute: yup.string().optional(),
	home_id: yup.string().required("change.tab.contract.validation.homeId"),
	staff_id: yup.string().required("change.tab.contract.validation.staffId")
})

const TabTwo = ({
	appear,
	clientId,
	selectedContract,
	setSelectedContract,
	setSelectedContractId
}) => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const sendNotification = useNotification()
	const [contractsList, setContractsList] = useState([])
	const [staffsList, setStaffsList] = useState([])

	const initialValues = {
		name: "",
		isrepaired: "",
		client_id: "",
		date: null,
		sum: "",
		start_price: "",
		month: "",
		discount: "",
		comment: "",
		home_id: "",
		staff_id: "",
		isvalute: "0"
	}

	const formik = useFormik({
		initialValues: initialValues,
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			let newValues = {
				name: values.name,
				isrepaired: values.isrepaired,
				comment: values.comment,
				staff_id: values.staff_id,
				date: values.date
			}
			try {
				setIsSubmitting(true)
				if (clientId) {
					const response = await axiosPrivate.post(
						`/admin/contract/update/${selectedContract?.id}`,
						JSON.stringify(newValues),
						{ headers: { "Content-Type": "application/json" } }
					)
					if (response.data && response.data.status) {
						sendNotification({
							msg: t("change.tab.contract.alerts.success"),
							variant: "success"
						})
					}
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
	})

	const handleContract = (contract) => {
		Array.from(document.getElementsByClassName("contract-item")).forEach(
			(item) =>
				item.id !== `contract-${contract.id}` &&
				item.classList.remove("item-selected")
		)
		document
			.getElementById(`contract-${contract.id}`)
			.classList.toggle("item-selected")
		resetFormik()
		if (selectedContract.id === contract.id) {
			setSelectedContract("")
			setSelectedContractId("")
		} else {
			setSelectedContract(contract)
			setSelectedContractId(contract.id)
			setContractValuesToForm(contract.id)
		}
	}

	const setContractValuesToForm = (contractId) => {
		let contract = contractsList.filter((item) => item.id === contractId)[0]
		let newValues = {
			name: contract.name,
			isrepaired: contract?.isrepaired,
			isvalute: contract?.isvalute || "0",
			client_id: contract.client_id,
			date: contract.date,
			sum: contract.sum,
			start_price: contract.start_price,
			month: contract.list.length ? contract.list.length - 1 : 1,
			discount: contract.discount,
			staff_id: contract.staff?.id,
			comment: contract.comment || "",
			home_id: contract.homes?.id
		}
		formik.setValues(newValues)
	}

	const resetFormik = () => {
		formik.resetForm()
		formik.setValues(initialValues)
	}

	const [contractQuery, staffQuery] = useQueries([
		{
			queryKey: "contracts",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`/dictionary/customcontracts/${clientId}`
				)
				return response.data.data
			},
			onSuccess: (data) => {
				if (data && data.length > 0) {
					let newData = data.filter(
						(item) => item.status !== CONTRACT_STATUS_TYPE.CANCEL.code
					)
					setContractsList(newData)
				} else {
					setContractsList([])
				}
			},
			enabled: !hasError && !!clientId,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "staffs",
			queryFn: async function () {
				const response = await axiosPrivate.get(`/dictionary/staffes`)
				return response.data.data
			},
			onSuccess: (data) => {
				mutateStaffsData(data)
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		}
	])

	const mutateStaffsData = (data) => {
		let mutatedStaffs = data.filter(
			(item) => item.role === ROLE_TYPE_LIST.ADMIN.code
		)
		setStaffsList(mutatedStaffs)
	}

	useEffect(() => {
		if (clientId && !isNaN(clientId)) {
			contractQuery.refetch()
		} else {
			setContractsList([])
		}
	}, [clientId])

	useEffect(() => {
		if (!selectedContract) {
			resetFormik()
		}
	}, [selectedContract])

	return (
		<motion.div
			variants={tabItem({
				duration: 0
			})}
			initial="hidden"
			animate={appear ? "show" : "hidden"}
		>
			<TabPanel value={0} index={0} className="-mx-6">
				<div className="flex justify-between">
					<form className="w-2/3">
						<Grid
							container
							spacing={{ xs: 2, sm: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, lg: 12 }}
						>
							<Grid item={true} sm={12} xs={12}>
								<FormTextField
									delay={0}
									label={t("common.fields.contractName")}
									fieldName="name"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormRadioGroupField
									delay={0}
									fieldName="isrepaired"
									formik={formik}
									label={t("common.fields.repairType")}
									options={repairTypeSelectOptions}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0}
									label={t("common.fields.clientId")}
									fieldName="client_id"
									formik={formik}
									readOnly={true}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormDateField
									delay={0}
									label={t("common.fields.contractDate")}
									fieldName="date"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormSimpleSelectField
									delay={0}
									label={t("common.fields.currency")}
									fieldName="isvalute"
									formik={formik}
									options={currencyTypeSelectOptions}
									itemValue="code"
									itemLabel="label"
									readOnly={true}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormCurrencyField
									delay={0}
									label={t("common.fields.sumAll")}
									fieldName="sum"
									formik={formik}
									readOnly={true}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormCurrencyField
									delay={0}
									label={t("common.fields.startPrice")}
									fieldName="start_price"
									formik={formik}
									readOnly={true}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormCurrencyField
									delay={0}
									label={t("common.fields.discount")}
									fieldName="discount"
									formik={formik}
									readOnly={true}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0}
									label={t("common.fields.month")}
									fieldName="month"
									formik={formik}
									readOnly={true}
								/>
							</Grid>

							{/* <Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0}
									label={t("common.fields.homeId")}
									fieldName="home_id"
									formik={formik}
									readOnly={true}
								/>
							</Grid> */}

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormSimpleSelectField
									delay={0}
									label={t("common.fields.staff")}
									fieldName="staff_id"
									formik={formik}
									options={staffsList}
								/>
							</Grid>

							<Grid item={true} sm={12} xs={12}>
								<FormMultilineTextField
									delay={0}
									label={t("common.fields.comment")}
									fieldName="comment"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} sm={12} xs={12}>
								<div className="text-center">
									<Button
										color="success"
										variant="contained"
										type="button"
										component={motion.button}
										variants={fadeUp(30, "tween", 0, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										disabled={isSubmitting || !selectedContract?.id}
										onClick={formik.handleSubmit}
									>
										{isSubmitting && (
											<CircularProgress
												size={15}
												color="inherit"
												className="mr-1"
											/>
										)}
										{t("change.tab.contract.action.update")}
									</Button>
								</div>
							</Grid>
						</Grid>
					</form>

					<div className="contracts-database-wrapper w-1/3 pl-8 py-2">
						<div className="contracts-database-title text-xl text-base-color">
							{t("change.tab.contract.contractsData")}:
						</div>
						<div className="contracts-database-body flex flex-col mt-2">
							{contractQuery.isLoading || contractQuery.isFetching ? (
								<div className="circular-progress-box py-5">
									<CircularProgress size={30} />
								</div>
							) : contractsList && contractsList.length > 0 ? (
								contractsList.map((contract) => (
									<ButtonBase
										className="contract-item"
										id={`contract-${contract.id}`}
										key={contract.id}
										onClick={() => handleContract(contract)}
									>
										<div className="name text-start">{contract.name}</div>
										{/* <div>
											<span>{contract.homes?.number}-xonadon</span>
										</div> */}
										<div>
											<span>
												{t("change.tab.contract.sumAll")}:{" "}
												<CurrencyFormat value={contract.sum} />
											</span>
										</div>
										<div className="flex items-center justify-between w-full">
											<span>
												{t("change.tab.contract.month", {
													value:
														contract.list && contract.list.length > 0
															? contract.list.length - 1
															: 0
												})}
											</span>
											<span>
												{t("change.tab.contract.date")}:{" "}
												{contract?.date
													? moment(contract.date).format("DD/MM/YYYY")
													: ""}
											</span>
										</div>
										<div className="currency-sign">
											{contract?.isvalute === "1" ? (
												<span className="currency-dollar">USD</span>
											) : (
												<span className="currency-sum">UZS</span>
											)}
										</div>
									</ButtonBase>
								))
							) : (
								<div className="text-gray-400 flex items-center mt-2">
									<i className="bi bi-exclamation-octagon text-lg mr-1 flex items-center" />{" "}
									<span className="text-sm">
										{t("change.tab.contract.noContractFound")}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</TabPanel>
		</motion.div>
	)
}

export default TabTwo
