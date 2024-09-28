import { Button, ButtonBase, CircularProgress, Grid } from "@mui/material"
import FormDateField from "components/ui/form/FormDateField"
import FormFileUploadField from "components/ui/form/FormFileUploadField"
import FormNumberField from "components/ui/form/FormNumberField"
import FormNumberTextField from "components/ui/form/FormNumberTextField"
import FormPassportField from "components/ui/form/FormPassportField"
import FormPhoneField from "components/ui/form/FormPhoneField"
import FormSelectField from "components/ui/form/FormSelectField"
import FormTextField from "components/ui/form/FormTextField"
import SimpleSelectField from "components/ui/simple-fields/select/SimpleSelectField"
import TabPanel from "components/ui/tabs/TabPanel"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import { useFormik } from "formik"
import { motion } from "framer-motion"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useNotification from "hooks/useNotification"
import React, { Fragment, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import CLIENT_TYPE from "shared/clientTypeList"
import { clientTypeSelectOptions } from "shared/selectOptionsList"
import { fadeUp, tabItem } from "utils/motion"
import * as yup from "yup"

const physicalValidationSchema = yup.object({
	name: yup.string().required("change.tab.client.validation.physical.name"),
	middlename: yup
		.string()
		.required("change.tab.client.validation.physical.middleName"),
	surname: yup
		.string()
		.required("change.tab.client.validation.physical.surname"),
	phone: yup
		.string()
		.length(17, "change.tab.client.validation.physical.phoneValid")
		.required("change.tab.client.validation.physical.phone"),
	phone2: yup
		.string()
		.length(17, "change.tab.client.validation.physical.phone2Valid")
		.optional()
		.nullable(),
	passport_series: yup
		.string()
		.required("change.tab.client.validation.physical.passportSeries"),
	issue: yup
		.date()
		.nullable()
		.typeError("change.tab.client.validation.physical.issueValid")
		.required("change.tab.client.validation.physical.issue"),
	authority: yup
		.string()
		.required("change.tab.client.validation.physical.authority"),
	birthday: yup
		.date()
		.nullable()
		.typeError("change.tab.client.validation.physical.birthdayValid")
		.required("change.tab.client.validation.physical.birthday"),
	region_id: yup
		.string()
		.required("change.tab.client.validation.physical.region"),
	city: yup.string().required("change.tab.client.validation.physical.city"),
	home: yup.string().required("change.tab.client.validation.physical.address"),
	work_place: yup
		.string()
		.required("change.tab.client.validation.physical.workPlace"),
	image: yup.mixed().nullable().optional()
})

const legalValidationSchema = yup.object({
	name: yup.string().required("change.tab.client.validation.legal.name"),
	phone: yup
		.string()
		.length(17, "change.tab.client.validation.legal.phoneValid")
		.required("change.tab.client.validation.legal.phone"),
	phone2: yup
		.string()
		.length(17, "change.tab.client.validation.legal.phone2Valid")
		.optional()
		.nullable(),
	region_id: yup.string().required("change.tab.client.validation.legal.region"),
	city: yup.string().required("change.tab.client.validation.legal.city"),
	home: yup.string().required("change.tab.client.validation.legal.address"),
	inn: yup.number().required("change.tab.client.validation.legal.tin"),
	mfo: yup.number().required("change.tab.client.validation.legal.mfo"),
	oked: yup.number().required("change.tab.client.validation.legal.oked"),
	account_number: yup
		.string()
		.min(20, {
			label: "change.tab.client.validation.legal.accountNumberMin",
			value: 20
		})
		.max(20, {
			label: "change.tab.client.validation.legal.accountNumberMax",
			value: 20
		})
		.required("change.tab.client.validation.legal.accountNumber"),
	bank_name: yup.string().required("change.tab.client.validation.legal.bank")
})

const TabOne = ({
	clientName,
	clientSearch,
	setClientSearch,
	appear,
	clientId,
	setClientId,
	setSelectedContract
}) => {
	const { t } = useTranslation()
	const [selectedClient, setSelectedClient] = useState("")
	const [clientsList, setClientsList] = useState([])
	const [clientsLoading, setClientsLoading] = useState(false)
	const sendNotification = useNotification()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const axiosPrivate = useAxiosPrivate()
	const [clientType, setClientType] = useState(CLIENT_TYPE.PHYSICAL.code)

	useEffect(() => {
		if (clientSearch) {
			searchClients()
		}
	}, [clientSearch])

	const physicalInitialValues = {
		name: "",
		middlename: "",
		surname: "",
		phone: "",
		phone2: null,
		passport_series: "",
		issue: null,
		authority: "",
		birthday: null,
		region_id: "",
		city: "",
		home: "",
		work_place: "",
		image: null
	}

	const legalInitialValues = {
		name: "",
		phone: "",
		phone2: null,
		region_id: "",
		city: "",
		home: "",
		inn: "",
		mfo: "",
		oked: "",
		account_number: "",
		bank_name: ""
	}

	const formikPhysical = useFormik({
		initialValues: physicalInitialValues,
		validationSchema: physicalValidationSchema,
		onSubmit: async (values) => {
			let newValues = {}
			if (typeof formikPhysical.values.image === "string") {
				newValues = {
					name: formikPhysical.values.name,
					middlename: formikPhysical.values.middlename,
					surname: formikPhysical.values.surname,
					phone: formikPhysical.values.phone,
					phone2: formikPhysical.values.phone2,
					passport_series: formikPhysical.values.passport_series,
					issue: formikPhysical.values.issue,
					authority: formikPhysical.values.authority,
					birthday: formikPhysical.values.birthday,
					region_id: formikPhysical.values.region_id,
					city: formikPhysical.values.city,
					home: formikPhysical.values.home,
					work_place: formikPhysical.values.work_place
				}
			}
			try {
				setIsSubmitting(true)
				if (clientId) {
					const response = await axiosPrivate.post(
						`/admin/custom/customupdate/${clientId}`,
						parseToFormData(newValues),
						{
							headers: { "Content-Type": "multipart/form-data" }
						}
					)
					handleResponse(response)
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

	const formikLegal = useFormik({
		initialValues: legalInitialValues,
		validationSchema: legalValidationSchema,
		onSubmit: async (values) => {
			try {
				setIsSubmitting(true)
				if (clientId) {
					const response = await axiosPrivate.post(
						`/admin/custom/legalupdate/${clientId}`,
						parseToFormData(values),
						{
							headers: { "Content-Type": "multipart/form-data" }
						}
					)
					handleResponse(response)
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

	const parseToFormData = (values) => {
		let formData = new FormData()
		for (let key in values) {
			formData.append(key, values[key])
		}
		return formData
	}

	const handleResponse = (response) => {
		if (response.data && response.data.status) {
			sendNotification({
				msg: t("change.tab.client.alerts.success"),
				variant: "success"
			})
		}
		setIsSubmitting(false)
	}

	const handleClientType = (value) => {
		formikPhysical.resetForm()
		formikLegal.resetForm()
		setClientId("")
		setSelectedClient("")
		setClientType(value)
	}

	const searchClients = async () => {
		formikPhysical.resetForm()
		formikLegal.resetForm()
		setClientId("")
		setSelectedClient("")
		setClientsLoading(true)
		let response = await axiosPrivate.get(
			`/dictionary/customs?name=${clientName}`
		)
		if (response.data && response.data.status) {
			setClientsList(response.data.data.data)
			setClientSearch(false)
		}
		setClientsLoading(false)
	}

	const handleClient = (clientId) => {
		Array.from(document.getElementsByClassName("client-item")).forEach(
			(item) =>
				item.id !== `client-${clientId}` &&
				item.classList.remove("item-selected")
		)
		document
			.getElementById(`client-${clientId}`)
			.classList.toggle("item-selected")
		// resetFormikPhysical()
		if (selectedClient === clientId) {
			setClientId("")
			setSelectedClient("")
		} else {
			setClientId(clientId)
			setSelectedClient(clientId)
			setClientValuesToForm(clientId)
		}
		setSelectedContract("")
	}

	const setClientValuesToForm = (clientId) => {
		let client = clientsList.filter((item) => item.id === clientId)[0]
		if (client.client_type === CLIENT_TYPE.PHYSICAL.code) {
			setClientType(CLIENT_TYPE.PHYSICAL.code)
			let newValues = {
				name: client.name,
				middlename: client.middlename,
				surname: client.surname,
				phone: client.phone,
				phone2: client?.phone2 || null,
				passport_series: client?.detail?.passport_series || "",
				issue: client?.detail?.issue || null,
				authority: client?.detail?.authority || "",
				birthday: client?.detail?.birthday || null,
				region_id: client?.detail?.region_id || "",
				city: client?.detail?.city || "",
				home: client?.detail?.home || "",
				work_place: client?.detail?.work_place || "",
				image: client?.detail?.image || null
			}
			// console.log("setClientValuesToForm if newValues = ", newValues)
			formikPhysical.setValues(newValues)
		} else {
			setClientType(CLIENT_TYPE.LEGAL.code)
			// console.log("setClientValuesToForm else client = ", client)
			let newValues = {
				name: client.name,
				phone: client.phone,
				phone2: client?.phone2 || null,
				region_id: client?.detail?.region_id || "",
				city: client?.detail?.city || "",
				home: client?.detail?.home || "",
				inn: client?.detail?.inn || "",
				mfo: client?.detail?.mfo || "",
				oked: client?.detail?.oked || "",
				account_number: client?.detail?.account_number || "",
				bank_name: client?.detail?.bank_name || ""
			}
			formikLegal.setValues(newValues)
		}
		// console.log("formikPhysical = ", formikPhysical)
	}

	const resetFormikPhysical = () => {
		console.log("resetFormikPhysical")
		formikPhysical.setValues(physicalInitialValues)
	}

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
					<form
						onSubmit={() => {
							return false
						}}
						className="w-2/3"
					>
						<Grid
							container
							spacing={{ xs: 2, sm: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, lg: 12 }}
						>
							<Grid item={true} lg={4} sm={6} xs={12}>
								<SimpleSelectField
									delay={0}
									label={t("common.fields.clientType")}
									name="name"
									value={clientType}
									changeFn={handleClientType}
									options={clientTypeSelectOptions}
								/>
							</Grid>

							{clientType === CLIENT_TYPE.PHYSICAL.code ? (
								<Fragment>
									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.name")}
											fieldName="name"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.surname")}
											fieldName="surname"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.middleName")}
											fieldName="middlename"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPhoneField
											delay={0}
											label={t("common.fields.phone")}
											fieldName="phone"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPhoneField
											delay={0}
											label={t("common.fields.phone2")}
											fieldName="phone2"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPassportField
											delay={0}
											label={t("common.fields.passportSeries")}
											fieldName="passport_series"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormDateField
											delay={0}
											label={t("common.fields.issue")}
											fieldName="issue"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.authority")}
											fieldName="authority"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormDateField
											delay={0}
											label={t("common.fields.birthday")}
											fieldName="birthday"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormSelectField
											delay={0}
											fieldName="region_id"
											label={t("common.fields.region")}
											formik={formikPhysical}
											path={"/dictionary/regions"}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.city")}
											fieldName="city"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.home")}
											fieldName="home"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.workPlace")}
											fieldName="work_place"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormFileUploadField
											delay={0}
											accept=".jpg, .png"
											fieldName="image"
											formik={formikPhysical}
											label={t("common.fields.image")}
											btnLabel={t("common.button.imageUpload")}
										/>
									</Grid>
								</Fragment>
							) : (
								<Fragment>
									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.companyName")}
											fieldName="name"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPhoneField
											delay={0}
											label={t("common.fields.phone")}
											fieldName="phone"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPhoneField
											delay={0}
											label={t("common.fields.phone2")}
											fieldName="phone2"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.bank")}
											fieldName="bank_name"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormNumberField
											delay={0}
											label={t("common.fields.tin")}
											fieldName="inn"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormNumberField
											delay={0}
											label={t("common.fields.mfo")}
											fieldName="mfo"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormNumberField
											delay={0}
											label={t("common.fields.oked")}
											fieldName="oked"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormNumberTextField
											delay={0}
											label={t("common.fields.accountNumber")}
											fieldName="account_number"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormSelectField
											delay={0}
											fieldName="region_id"
											label={t("common.fields.region")}
											formik={formikLegal}
											path={"/dictionary/regions"}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.city")}
											fieldName="city"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0}
											label={t("common.fields.companyAddress")}
											fieldName="home"
											formik={formikLegal}
										/>
									</Grid>
								</Fragment>
							)}

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
										disabled={isSubmitting || !clientId}
										onClick={
											clientType === CLIENT_TYPE.PHYSICAL.code
												? formikPhysical.handleSubmit
												: formikLegal.handleSubmit
										}
									>
										{isSubmitting && (
											<CircularProgress
												size={15}
												color="inherit"
												className="mr-1"
											/>
										)}
										{t("change.tab.client.action.update")}
									</Button>
								</div>
							</Grid>
						</Grid>
					</form>

					<div className="clients-database-wrapper w-1/3 pl-8 py-2">
						<div className="clients-database-title text-xl text-base-color">
							{t("change.tab.client.clientsData")}:
						</div>
						<div className="clients-database-add-edit"></div>
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
								<div className="text-gray-400 flex items-center mt-2">
									<i className="bi bi-exclamation-octagon text-lg mr-1 flex items-center" />{" "}
									<span className="text-sm">
										{t("change.tab.client.noClientFound")}
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

export default TabOne
