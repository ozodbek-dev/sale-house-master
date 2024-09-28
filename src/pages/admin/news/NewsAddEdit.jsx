import { CircularProgress, Grid } from "@mui/material"
import FormActionButtons from "components/ui/form/FormActionButtons"
import FormEditor from "components/ui/form/FormEditor"
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
	title: yup.string().required("news.validation.title"),
	body: yup.string().required("news.validation.body"),
	link: yup.string().required("news.validation.link")
})

const NewsAddEdit = () => {
	const { id } = useParams()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const { submit, isSubmitting } = useFormSubmit()
	const { setComponent } = useTopPanel()

	const formik = useFormik({
		initialValues: {
			title: "",
			body: "",
			link: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {
			if (id)
				submit(
					{ type: "postUpdate", contentType: "simple" },
					values,
					"/admin/news",
					values.title,
					id
				)
			else
				submit(
					{ type: "post", contentType: "simple" },
					values,
					"/admin/news",
					values.title
				)
		}
	})
	const { isLoading, isFetching } = useQuery({
		queryKey: "newsSingle",
		queryFn: async function () {
			const response = await axiosPrivate.get(`/admin/news/edit/${id}`)
			return response.data.data
		},
		onSuccess: (data) => {
			formik.setValues({
				title: data.title,
				body: data.body,
				link: data.link
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
					<span>{t("news.editTitle")}</span>
				) : (
					<span>{t("news.addTitle")}</span>
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
							<Grid item={true} sm={6} xs={12}>
								<FormTextField
									delay={0.1}
									label={t("news.fields.title")}
									fieldName="title"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} sm={6} xs={12}>
								<FormTextField
									delay={0.2}
									label={t("news.fields.link")}
									fieldName="link"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} sm={12} xs={12}>
								<FormEditor
									delay={0.3}
									label={t("news.fields.body")}
									fieldName="body"
									formik={formik}
								/>
							</Grid>

							<Grid item={true} sm={12} xs={12}>
								<FormActionButtons delay={0.4} isSubmitting={isSubmitting} />
							</Grid>
						</Grid>
					</form>
				)}
			</div>
		</div>
	)
}

export default NewsAddEdit
