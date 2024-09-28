import { CircularProgress, Grid } from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormAutocompleteField from "components/ui/form/FormAutocompleteField"
import FormNumberTextField from "components/ui/form/FormNumberTextField"
import FormNumberField from "components/ui/form/FormNumberField"
import FormPhoneField from "components/ui/form/FormPhoneField"
import FormSelectField from "components/ui/form/FormSelectField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useFormSubmit from "hooks/useFormSubmit"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import * as yup from "yup"
import { useTranslation } from "react-i18next"

const validationSchema = yup.object({
	name: yup
		.string()
		.min(3, { label: "settings.companies.validation.nameMin", value: 3 })
		.required("settings.companies.validation.name"),
	director: yup.string().required("settings.companies.validation.director"),
	phone: yup
		.string()
		.length(17, "settings.companies.validation.phoneValid")
		.required("settings.companies.validation.phone"),
	inn: yup.number().required("settings.companies.validation.tin"),
	mfo: yup.number().required("settings.companies.validation.mfo"),
	oked: yup.number().required("settings.companies.validation.oked"),
	account_number: yup
		.string()
		.min(20, "settings.companies.validation.accountNumberMin")
		.max(20, "settings.companies.validation.accountNumberMax")
		.required("settings.companies.validation.accountNumber"),
	bank: yup.string().required("settings.companies.validation.bank"),
	region_id: yup.string().required("settings.companies.validation.regionId"),
	city: yup.string().required("settings.companies.validation.city"),
	address: yup.string().required("settings.companies.validation.address")
})

const CompanyAddEdit = () => {
	const { id } = useParams()
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const { submit, isSubmitting } = useFormSubmit()
	const [hasError, setHasError] = useState(false)

	const { setComponent } = useTopPanel()

	const formik = useFormik({
		initialValues: {
			name: "",
			director: "",
			phone: "",
			inn: "",
			mfo: "",
			oked: "",
			account_number: "",
			bank: "",
			address: "",
			region_id: "",
			city: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			if (id)
				submit(
					{ type: "put", contentType: "simple" },
					values,
					"/admin/company",
					values.name,
					id
				)
			else
				submit(
				
					{ type: "post", contentType: "simple" },
					values,
					"/admin/company",
					values.name
				)
		}
	})
	const { isLoading, isFetching } = useQuery({
		queryKey: "companySingle",
		queryFn: async function () {
			const response = await axiosPrivate.get(`/admin/company/edit/${id}`)
			return response.data.data
		},
		onSuccess: (data) => {
			formik.setValues({
				name: data.name,
				director: data.director,
				phone: data.phone,
				inn: data.inn,
				mfo: data.mfo,
				oked: data.oked,
				account_number: data.account_number,
				bank: data.bank,
				address: data.address,
				region_id: data.region_id,
				city: data.city
			})
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
				{id && formik.values.name ? (
					<span>
						{t("settings.companies.editTitle", { value: formik.values.name })}
					</span>
				) : (
					<span>{t("settings.companies.addTitle")}</span>
				)}
			</div>
		)
	}, [formik.values.name])

	return (
		<div className="component-add-edit-wrapper mx-4">
			<div className="component-add-edit-body mt-3">
				{isLoading || isFetching ? (
					<div className="circular-progress-box py-5">
						<CircularProgress size={35} />
					</div>
				) : (
					<form onSubmit={formik.handleSubmit}>
						<Grid
							container
							spacing={{ xs: 2, sm: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, lg: 12 }}
						>
							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.1}
									label={t("common.fields.companyName")}
									fieldName="name"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.2}
									label={t("common.fields.companyDirector")}
									fieldName="director"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormPhoneField
									delay={0.2}
									label={t("common.fields.phone")}
									fieldName="phone"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.3}
									label={t("common.fields.bank")}
									fieldName="bank"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormNumberField
									delay={0.3}
									label={t("common.fields.tin")}
									fieldName="inn"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormNumberTextField
									delay={0.3}
									label={t("common.fields.mfo")}
									fieldName="mfo"
									formik={formik}
									allowLeadingZeros={true}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormNumberField
									delay={0.3}
									label={t("common.fields.oked")}
									fieldName="oked"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormNumberTextField
									delay={0.3}
									label={t("common.fields.accountNumber")}
									fieldName="account_number"
									formik={formik}
								/>
							</Grid>

							{id ? (
								<Grid item={true} lg={4} sm={6} xs={12}>
									<FormSelectField
										delay={0.2}
										fieldName="region_id"
										label={t("common.fields.region")}
										formik={formik}
										path={"/dictionary/regions"}
									/>
								</Grid>
							) : (
								<Grid item={true} lg={4} sm={6} xs={12}>
									<FormAutocompleteField
										delay={0.2}
										fieldName="region_id"
										label={t("common.fields.region")}
										formik={formik}
										path={"/dictionary/regions"}
									/>
								</Grid>
							)}

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.2}
									label={t("common.fields.city")}
									fieldName="city"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.2}
									label={t("common.fields.companyAddress")}
									fieldName="address"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} sm={12} xs={12}>
								<FormActionButtons delay={0.5} isSubmitting={isSubmitting} />
							</Grid>
						</Grid>
					</form>
				)}
			</div>
		</div>
	)
}

export default CompanyAddEdit
