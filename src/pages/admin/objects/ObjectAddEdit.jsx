import { CircularProgress, Grid } from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormAutocompleteField from "components/ui/form/FormAutocompleteField"
import FormDateField from "components/ui/form/FormDateField"
import FormFileUploadField from "components/ui/form/FormFileUploadField"
import FormNumberField from "components/ui/form/FormNumberField"
import FormTextField from "components/ui/form/FormTextField"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useFormSubmit from "hooks/useFormSubmit"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import * as yup from "yup"

const validationSchema = yup.object({
	name: yup
		.string()
		.min(3, { label: "object.validation.nameMin", value: 3 })
		.required("object.validation.name"),
	region_id: yup.string().required("object.validation.regionId"),
	companies_id: yup.string().required("object.validation.companiesId"),
	city: yup.string().required("object.validation.city"),
	address: yup.string().required("object.validation.address"),
	start: yup
		.date()
		.nullable()
		.typeError("object.validation.startValid")
		.required("object.validation.start"),
	end: yup
		.date()
		.nullable()
		.min(yup.ref("start"), "object.validation.endMin")
		.typeError("object.validation.endValid")
		.required("object.validation.end"),
	stage: yup.number().required("object.validation.stage"),
	padez: yup.number().required("object.validation.padez"),
	image: yup.mixed().nullable().optional()
})

const ObjectAddEdit = () => {
	const { id } = useParams()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const { submit, isSubmitting } = useFormSubmit()
	const { setComponent } = useTopPanel()

	const formik = useFormik({
		initialValues: {
			name: "",
			region_id: "",
			companies_id: "",
			city: "",
			address: "",
			start: null,
			end: null,
			stage: "",
			padez: "",
			image: null
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			if (id)
				submit(
					{ type: "put", contentType: "formData" },
					values,
					"/admin/object",
					values.name,
					id
				)
			else
				submit(
					{ type: "post", contentType: "formData" },
					values,
					"/admin/object",
					values.name
				)
		}
	})
	const { isLoading, isFetching } = useQuery({
		queryKey: "objectSingle",
		queryFn: async function () {
			const response = await axiosPrivate.get(`/admin/object/edit/${id}`)
			return response.data.data
		},
		onSuccess: (data) => {
			formik.setValues({
				name: data.name,
				region_id: data.region_id,
				companies_id: data.companies_id,
				city: data.city,
				address: data.address,
				start: data.start,
				end: data.end,
				stage: data.stage,
				image: data.image,
				padez: data.padez
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
				{id ? (
					<span>{t("object.editTitle")}</span>
				) : (
					<span>{t("object.addTitle")}</span>
				)}
			</div>
		)
	}, [i18n.language])

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
									label={t("object.objectName")}
									fieldName="name"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormAutocompleteField
									delay={0.2}
									fieldName="companies_id"
									label={t("object.company")}
									formik={formik}
									path={"/dictionary/companies"}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormAutocompleteField
									delay={0.3}
									fieldName="region_id"
									label={t("object.region")}
									formik={formik}
									path={"/dictionary/regions"}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.4}
									label={t("object.city")}
									fieldName="city"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormTextField
									delay={0.5}
									label={t("object.address")}
									fieldName="address"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormDateField
									delay={0.6}
									label={t("object.startTime")}
									formik={formik}
									fieldName="start"
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormDateField
									delay={0.7}
									label={t("object.endTime")}
									formik={formik}
									fieldName="end"
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormNumberField
									delay={0.8}
									label={t("object.stage")}
									fieldName="stage"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormNumberField
									delay={0.9}
									label={t("object.blocksNumber")}
									fieldName="padez"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} lg={4} sm={6} xs={12}>
								<FormFileUploadField
									delay={1}
									accept=".jpg, .png"
									fieldName="image"
									formik={formik}
									label={t("object.image")}
									btnLabel={t("common.button.imageUpload")}
								/>
							</Grid>

							<Grid item={true} sm={12} xs={12}>
								<FormActionButtons delay={1.1} isSubmitting={isSubmitting} />
							</Grid>
						</Grid>
					</form>
				)}
			</div>
		</div>
	)
}

export default ObjectAddEdit
