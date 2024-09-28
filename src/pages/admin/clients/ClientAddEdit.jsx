import { CircularProgress, Grid } from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useFormSubmit from "hooks/useFormSubmit"
import React, { Fragment, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import * as yup from "yup"
import FormDateField from "components/ui/form/FormDateField"
import FormFileUploadField from "components/ui/form/FormFileUploadField"
import SimpleSelectField from "components/ui/simple-fields/select/SimpleSelectField"
import FormNumberField from "components/ui/form/FormNumberField"
import CLIENT_TYPE from "shared/clientTypeList"
import FormAutocompleteField from "components/ui/form/FormAutocompleteField"
import FormPhoneField from "components/ui/form/FormPhoneField"
import FormNumberTextField from "components/ui/form/FormNumberTextField"
import useTopPanel from "hooks/useTopPanel"
import { clientTypeSelectOptions } from "shared/selectOptionsList"
import FormPassportField from "components/ui/form/FormPassportField"
import { useTranslation } from "react-i18next"

const physicalValidationSchema = yup.object({
	name: yup.string().required("client.addEdit.validation.physical.name"),
	middlename: yup
		.string()
		.required("client.addEdit.validation.physical.middleName"),
	surname: yup.string().required("client.addEdit.validation.physical.surname"),
	phone: yup
		.string()
		.length(17, "client.addEdit.validation.physical.phoneValid")
		.required("client.addEdit.validation.physical.phone"),
	phone2: yup
		.string()
		.length(17, "client.addEdit.validation.physical.phone2Valid")
		.nullable()
		.optional(),
	passport_series: yup
		.string()
		.required("client.addEdit.validation.physical.passportSeries"),
	issue: yup
		.date()
		.nullable()
		.typeError("client.addEdit.validation.physical.issueValid")
		.required("client.addEdit.validation.physical.issue"),
	authority: yup
		.string()
		.required("client.addEdit.validation.physical.authority"),
	birthday: yup
		.date()
		.nullable()
		.typeError("client.addEdit.validation.physical.birthdayValid")
		.required("client.addEdit.validation.physical.birthday"),
	region_id: yup.string().required("client.addEdit.validation.physical.region"),
	city: yup.string().required("client.addEdit.validation.physical.city"),
	home: yup.string().required("client.addEdit.validation.physical.address"),
	work_place: yup
		.string()
		.required("client.addEdit.validation.physical.workPlace"),
	image: yup.mixed().nullable().optional()
})

const legalValidationSchema = yup.object({
	name: yup.string().required("client.addEdit.validation.legal.name"),
	phone: yup
		.string()
		.length(17, "client.addEdit.validation.legal.phoneValid")
		.required("client.addEdit.validation.legal.phone"),
	phone2: yup
		.string()
		.length(17, "client.addEdit.validation.legal.phone2Valid")
		.nullable()
		.optional(),
	region_id: yup.string().required("client.addEdit.validation.legal.region"),
	city: yup.string().required("client.addEdit.validation.legal.city"),
	home: yup.string().required("client.addEdit.validation.legal.address"),
	inn: yup.number().required("client.addEdit.validation.legal.tin"),
	mfo: yup.number().required("client.addEdit.validation.legal.mfo"),
	oked: yup.number().required("client.addEdit.validation.legal.oked"),
	account_number: yup
		.string()
		.min(20, {
			label: "client.addEdit.validation.legal.accountNumberMin",
			value: 20
		})
		.max(20, {
			label: "client.addEdit.validation.legal.accountNumberMax",
			value: 20
		})
		.required("client.addEdit.validation.legal.accountNumber"),
	bank_name: yup.string().required("client.addEdit.validation.legal.bank")
})

const ClientAddEdit = () => {
	const { id } = useParams()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const { submit, isSubmitting } = useFormSubmit()
	const [hasError, setHasError] = useState(false)
	const { setComponent } = useTopPanel()
	const [clientType, setClientType] = useState(CLIENT_TYPE.PHYSICAL.code)

	const physicalInitialValues = {
		name: "",
		middlename: "",
		surname: "",
		phone: "",
		phone2: "",
		passport_series: "",
		issue: "",
		authority: "",
		birthday: "",
		region_id: "",
		city: "",
		home: "",
		work_place: "",
		image: null
	}

	const legalInitialValues = {
		name: "",
		phone: "",
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
			if (values.image) {
				newValues = {
					name: values.name,
					middlename: values.middlename,
					surname: values.surname,
					phone: values.phone,
					phone2: values.phone2,
					passport_series: values.passport_series,
					issue: values.issue,
					authority: values.authority,
					birthday: values.birthday,
					region_id: values.region_id,
					city: values.city,
					home: values.home,
					work_place: values.work_place,
					image: values.image
				}
			} else {
				newValues = {
					name: values.name,
					middlename: values.middlename,
					surname: values.surname,
					phone: values.phone,
					phone2: values.phone2,
					passport_series: values.passport_series,
					issue: values.issue,
					authority: values.authority,
					birthday: values.birthday,
					region_id: values.region_id,
					city: values.city,
					home: values.home,
					work_place: values.work_place
				}
			}

			if (id)
				submit(
					{ type: "put", contentType: "formData" },
					newValues,
					"/admin/custom/customstore",
					values.name,
					id,
					true
				)
			else
				submit(
					{ type: "post", contentType: "formData" },
					newValues,
					"/admin/custom/customstore",
					values.name,
					null,
					true
				)
		}
	})

	const formikLegal = useFormik({
		initialValues: legalInitialValues,
		validationSchema: legalValidationSchema,
		onSubmit: async (values) => {
			if (id)
				submit(
					{ type: "put", contentType: "formData" },
					values,
					"/admin/custom/legalstore",
					values.name,
					id,
					true
				)
			else
				submit(
					{ type: "post", contentType: "formData" },
					values,
					"/admin/custom/legalstore",
					values.name,
					null,
					true
				)
		}
	})

	const { isLoading, isFetching } = useQuery({
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
	})

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{id ? (
					<span>{t("client.addEdit.editTitle")}</span>
				) : (
					<span>{t("client.addEdit.addTitle")}</span>
				)}
			</div>
		)
	}, [i18n.language])

	const handleClientType = (value) => {
		formikPhysical.resetForm()
		formikLegal.resetForm()
		setClientType(value)
	}

	return (
		<div className="component-add-edit-wrapper mx-4">
			<div className="component-add-edit-body mt-3">
				{isLoading || isFetching ? (
					<div className="circular-progress-box py-5">
						<CircularProgress size={35} />
					</div>
				) : (
					<form
						onSubmit={
							clientType === CLIENT_TYPE.PHYSICAL.code
								? formikPhysical.handleSubmit
								: formikLegal.handleSubmit
						}
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
										/>
									</Grid>

									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0.2}
											label={t("common.fields.surname")}
											fieldName="surname"
											formik={formikPhysical}
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
										<FormAutocompleteField
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

									{!id && (
										<Grid item={true} lg={4} sm={6} xs={12}>
											<FormFileUploadField
												delay={1.3}
												accept=".jpg, .png"
												fieldName="image"
												formik={formikPhysical}
												label={t("common.fields.image")}
												btnLabel={t("common.button.imageUpload")}
											/>
										</Grid>
									)}
								</Fragment>
							) : (
								<Fragment>
									<Grid item={true} lg={4} sm={6} xs={12}>
										<FormTextField
											delay={0.1}
											label={t("common.fields.companyName")}
											fieldName="name"
											formik={formikLegal}
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
											fieldName="phone2"
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
										<FormAutocompleteField
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
								<FormActionButtons delay={1.5} isSubmitting={isSubmitting} />
							</Grid>
						</Grid>
					</form>
				)}
			</div>
		</div>
	)
}

export default ClientAddEdit
