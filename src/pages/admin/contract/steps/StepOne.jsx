import { Button, ButtonBase, CircularProgress, Grid } from "@mui/material"
import FormSelectField from "components/ui/form/FormSelectField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import React, { Fragment, useState } from "react"
import * as yup from "yup"
import FormDateField from "components/ui/form/FormDateField"
import FormFileUploadField from "components/ui/form/FormFileUploadField"
import SimpleSelectField from "components/ui/simple-fields/select/SimpleSelectField"
import FormNumberField from "components/ui/form/FormNumberField"
import CLIENT_TYPE from "shared/clientTypeList"
import FormPhoneField from "components/ui/form/FormPhoneField"
import { motion } from "framer-motion"
import { fadeUp, stepperItem } from "utils/motion"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import FormNumberTextField from "components/ui/form/FormNumberTextField"
import { clientTypeSelectOptions } from "shared/selectOptionsList"
import FormPassportField from "components/ui/form/FormPassportField"
import { useTranslation } from "react-i18next"

const physicalValidationSchema = yup.object({
	name: yup.string().required("contract.step.one.validation.physical.name"),
	middlename: yup
		.string()
		.required("contract.step.one.validation.physical.middleName"),
	surname: yup
		.string()
		.required("contract.step.one.validation.physical.surname"),
	phone: yup
		.string()
		.length(17, "contract.step.one.validation.physical.phoneValid")
		.required("contract.step.one.validation.physical.phone"),
	phone2: yup
		.string()
		.length(17, "contract.step.one.validation.physical.phone2Valid")
		.nullable()
		.optional(),
	passport_series: yup
		.string()
		.required("contract.step.one.validation.physical.passportSeries"),
	issue: yup
		.date()
		.nullable()
		.typeError("contract.step.one.validation.physical.issueValid")
		.required("contract.step.one.validation.physical.issue"),
	authority: yup
		.string()
		.required("contract.step.one.validation.physical.authority"),
	birthday: yup
		.date()
		.nullable()
		.typeError("contract.step.one.validation.physical.birthdayValid")
		.required("contract.step.one.validation.physical.birthday"),
	region_id: yup
		.string()
		.required("contract.step.one.validation.physical.region"),
	city: yup.string().required("contract.step.one.validation.physical.city"),
	home: yup.string().required("contract.step.one.validation.physical.address"),
	work_place: yup
		.string()
		.required("contract.step.one.validation.physical.workPlace"),
	image: yup.mixed().nullable().optional()
})

const legalValidationSchema = yup.object({
	name: yup.string().required("contract.step.one.validation.legal.name"),
	phone: yup
		.string()
		.length(17, "contract.step.one.validation.legal.phoneValid")
		.required("contract.step.one.validation.legal.phone"),
	phone2: yup
		.string()
		.length(17, "contract.step.one.validation.legal.phone2Valid")
		.nullable()
		.optional(),
	region_id: yup.string().required("contract.step.one.validation.legal.region"),
	city: yup.string().required("contract.step.one.validation.legal.city"),
	home: yup.string().required("contract.step.one.validation.legal.address"),
	inn: yup.number().required("contract.step.one.validation.legal.tin"),
	mfo: yup.number().required("contract.step.one.validation.legal.mfo"),
	oked: yup.number().required("contract.step.one.validation.legal.oked"),
	account_number: yup
		.string()
		.min(20, {
			label: "contract.step.one.validation.legal.accountNumberMin",
			value: 20
		})
		.max(20, {
			label: "contract.step.one.validation.legal.accountNumberMax",
			value: 20
		})
		.required("contract.step.one.validation.legal.accountNumber"),
	bank_name: yup.string().required("contract.step.one.validation.legal.bank")
})

const StepOne = ({ appear, direction, next, back, setData }) => {
	const { t } = useTranslation()
	const [clientId, setClientId] = useState("")
	const [selectedClient, setSelectedClient] = useState("")
	const [clientsList, setClientsList] = useState([])
	const [clientsLoading, setClientsLoading] = useState(false)
	const axiosPrivate = useAxiosPrivate()
	const [clientType, setClientType] = useState(CLIENT_TYPE.PHYSICAL.code)

	const physicalInitialValues = {
		name: "",
		middlename: "",
		surname: "",
		phone: "",
		phone2: "",
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
		phone2: "",
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
			setData({ id: clientId, ...values, client_type: clientType })
			next()
		}
	})

	const formikLegal = useFormik({
		initialValues: legalInitialValues,
		validationSchema: legalValidationSchema,
		onSubmit: async (values) => {
			setData({ id: clientId, ...values, client_type: clientType })
			next()
		}
	})

	const handleClientType = (value) => {
		formikPhysical.resetForm()
		formikLegal.resetForm()
		setClientId("")
		setSelectedClient("")
		setClientType(value)
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
		resetFormikPhysical()
		if (selectedClient === clientId) {
			setClientId("")
			setSelectedClient("")
		} else {
			setClientId(clientId)
			setSelectedClient(clientId)
			setClientValuesToForm(clientId)
		}
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
			formikPhysical.setValues(newValues)
		} else {
			setClientType(CLIENT_TYPE.LEGAL.code)
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
	}

	const resetFormikPhysical = () => {
		formikPhysical.setValues(physicalInitialValues)
	}

	const handleKeyDown = async (event) => {
		if (event.keyCode === 13) {
			setClientId("")
			setSelectedClient("")
			setClientsLoading(true)
			let response = ""
			if (clientType === CLIENT_TYPE.PHYSICAL.code) {
				response = await axiosPrivate.get(
					`/dictionary/customs?name=${
						formikPhysical.values.name || ""
					}&surname=${formikPhysical.values.surname || ""}`
				)
			} else {
				response = await axiosPrivate.get(
					`/dictionary/customs?name=${formikLegal.values.name || ""}`
				)
			}
			if (response.data && response.data.status) {
				setClientsList(response.data.data.data)
			}
			setClientsLoading(false)
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
				<div className="component-add-body flex justify-between">
					<form
						onSubmit={
							clientType === CLIENT_TYPE.PHYSICAL.code
								? formikPhysical.handleSubmit
								: formikLegal.handleSubmit
						}
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
									delay={0.1}
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
											delay={0.1}
											label={t("common.fields.name")}
											fieldName="name"
											formik={formikPhysical}
											onKeyDown={handleKeyDown}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0.2}
											label={t("common.fields.surname")}
											fieldName="surname"
											formik={formikPhysical}
											onKeyDown={handleKeyDown}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0.3}
											label={t("common.fields.middleName")}
											fieldName="middlename"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPhoneField
											delay={0.4}
											label={t("common.fields.phone")}
											fieldName="phone"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPhoneField
											delay={0.5}
											label={t("common.fields.phone2")}
											fieldName="phone2"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPassportField
											delay={0.6}
											label={t("common.fields.passportSeries")}
											fieldName="passport_series"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormDateField
											delay={0.7}
											label={t("common.fields.issue")}
											fieldName="issue"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0.8}
											label={t("common.fields.authority")}
											fieldName="authority"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormDateField
											delay={0.9}
											label={t("common.fields.birthday")}
											fieldName="birthday"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormSelectField
											delay={1}
											fieldName="region_id"
											label={t("common.fields.region")}
											formik={formikPhysical}
											path={"/dictionary/regions"}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={1.1}
											label={t("common.fields.city")}
											fieldName="city"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={1.2}
											label={t("common.fields.home")}
											fieldName="home"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={1.3}
											label={t("common.fields.workPlace")}
											fieldName="work_place"
											formik={formikPhysical}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormFileUploadField
											delay={1.4}
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
											delay={0.1}
											label={t("common.fields.companyName")}
											fieldName="name"
											formik={formikLegal}
											onKeyDown={handleKeyDown}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPhoneField
											delay={0.2}
											label={t("common.fields.phone")}
											fieldName="phone"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormPhoneField
											delay={0.3}
											label={t("common.fields.phone2")}
											fieldName="phone"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0.4}
											label={t("common.fields.bank")}
											fieldName="bank_name"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormNumberField
											delay={0.5}
											label={t("common.fields.tin")}
											fieldName="inn"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormNumberField
											delay={0.6}
											label={t("common.fields.mfo")}
											fieldName="mfo"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormNumberField
											delay={0.7}
											label={t("common.fields.oked")}
											fieldName="oked"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormNumberTextField
											delay={0.8}
											label={t("common.fields.accountNumber")}
											fieldName="account_number"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormSelectField
											delay={0.9}
											fieldName="region_id"
											label={t("common.fields.region")}
											formik={formikLegal}
											path={"/dictionary/regions"}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={1}
											label={t("common.fields.city")}
											fieldName="city"
											formik={formikLegal}
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={1.1}
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
										variants={fadeUp(30, "tween", 1.5, 0.5)}
										initial="hidden"
										animate="show"
										viewport={{ once: true, amount: 0.25 }}
										onClick={
											clientType === CLIENT_TYPE.PHYSICAL.code
												? formikPhysical.handleSubmit
												: formikLegal.handleSubmit
										}
									>
										{t("common.button.next")}
									</Button>
								</div>
							</Grid>
						</Grid>
					</form>

					<div className="clients-database-wrapper w-1/3 pl-8 py-2">
						<div className="clients-database-title text-xl text-base-color">
							{t("contract.step.one.clientsData")}:
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
										{t("contract.step.one.noClientFound")}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default StepOne
