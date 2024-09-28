import {
	Button,
	Fab,
	LinearProgress,
	Pagination,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material"
import { useFormik } from "formik"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { useQuery } from "react-query"
import * as yup from "yup"
import HomeDeactivateModal from "./HomeDeactivateModal"
import HomeAcceptActivateModal from "./HomeAcceptActivateModal"
import { useSearchParams } from "react-router-dom"
import SearchInput from "components/SearchInput"
import HomeFiltersComponent from "components/ui/filters/HomeFiltersComponent"
import { Trans, useTranslation } from "react-i18next"

const validationSchema = yup.object({
	objectId: yup.number().required("settings.home.validation.objectId"),
	blockId: yup.number().required("settings.home.validation.blockId"),
	home_id: yup.string().required("settings.home.validation.homeId")
})

const Home = () => {
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [open, setOpen] = useState(false)
	const [openDeactivate, setOpenDeactivate] = useState(false)
	const [homeId, setHomeId] = useState("")
	const [hasError, setHasError] = useState(false)
	const [expanded, setExpanded] = useState(false)
	const [total, setTotal] = useState(0)
	const [perPage, setPerPage] = useState(12)
	const { setComponent } = useTopPanel()

	const formik = useFormik({
		initialValues: {
			objectId: "",
			blockId: "",
			home_id: ""
		},
		validationSchema: validationSchema,
		onSubmit: async (values) => {}
	})
	const {
		data: homes,
		isLoading,
		isFetching,
		isError,
		error,
		refetch
	} = useQuery({
		queryKey: "homes",
		queryFn: async function () {
			const response = await axiosPrivate.post(queryPath)
			if (response?.data?.data.total || response?.data?.data.per_page) {
				setTotal(response?.data?.data.total)
				setPerPage(response?.data?.data.per_page)
			}
			return response.data.data.data
		},
		enabled: !hasError,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	useEffect(() => {
		if (formik?.values?.blockId) {
			homes.refetch()
		}
	}, [formik?.values?.blockId])

	const [queryPath, setQueryPath] = useState("/changer/index")

	const [searchParams, setSearchParams] = useSearchParams()
	const [page, setPage] = useState(
		(searchParams.get("page") && parseInt(searchParams.get("page"))) || 1
	)

	useEffect(() => {
		if (queryPath && queryPath.length > 0) {
			refetch()
		}
	}, [queryPath])

	useEffect(() => {
		createQueryPath()
	}, [searchParams])

	const createQueryPath = () => {
		let newQueryPath = "/changer/index"
		let localSearchParams = Object.fromEntries([...searchParams])
		Object.keys(localSearchParams).forEach((item, index) => {
			if (index === 0) {
				newQueryPath += `?${item}=${localSearchParams[item]}`
			} else {
				newQueryPath += `&${item}=${localSearchParams[item]}`
			}
		})
		setQueryPath(newQueryPath)
		if (!isNaN(localSearchParams.page)) {
			setPage(parseInt(localSearchParams.page))
		}
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
		searchParams.set("page", newPage)
		setSearchParams(searchParams)
	}

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("settings.home.title")}
			</div>
		)
	}, [i18n.language])

	return (
		<div className="component-add-edit-wrapper">
			<div className="component-list-header mb-2">
				<div className="header-actions-container py-3 flex flex-row items-center">
					<div className="header-actions filter-box flex items-center my-shadow-2 rounded-lg px-4 w-full">
						<Button
							variant="filterOutlined"
							color="primary"
							startIcon={<i className="bi bi-filter" />}
							className="!mr-2"
							onClick={() => setExpanded((prev) => !prev)}
						>
							{t("common.button.filter")}
						</Button>
						<SearchInput inputKey="name" />
					</div>
					<div className="header-actions action-buttons-box py-2.5 px-4 my-shadow-2 rounded-lg flex items-center justify-center ml-4">
						<Button
							variant="action"
							color="info"
							onClick={() => refetch()}
							disable={`${isFetching || isLoading}`}
						>
							<i
								className={`bi bi-arrow-repeat${
									isFetching || isLoading ? " animate-spin" : ""
								}`}
							/>
						</Button>
						<Button
							color="primary"
							variant="outlined"
							onClick={() => setOpenDeactivate(true)}
							className="!ml-2 !whitespace-nowrap"
						>
							{t("settings.home.deactivateHome")}
						</Button>
					</div>
				</div>
				{expanded && (
					<div className="my-shadow-2 rounded-lg px-4 w-full mt-2">
						<HomeFiltersComponent />
					</div>
				)}
			</div>

			<div className="w-full h-full flex flex-col">
				<TableContainer className="flex-auto h-full">
					<Table
						stickyHeader
						sx={{ minWidth: 750, height: "max-content" }}
						aria-labelledby="tableTitle"
					>
						<TableHead>
							<TableRow>
								<TableCell>№</TableCell>
								<TableCell>{t("settings.home.table.blockName")}</TableCell>
								<TableCell>{t("settings.home.table.homeNumber")}</TableCell>
								<TableCell>
									<Trans i18nKey="settings.home.table.homeDetails">
										Xona ma'lumotlari (q.|x.s.|m<sup>2</sup>)
									</Trans>
								</TableCell>
								<TableCell>{t("common.table.actions")}</TableCell>
							</TableRow>
						</TableHead>
						{isLoading || isFetching ? (
							<TableBody className="overflow-hidden">
								<TableRow>
									<TableCell colSpan={5}>
										<LinearProgress />
									</TableCell>
								</TableRow>
							</TableBody>
						) : isError ? (
							<TableBody className="overflow-hidden">
								<TableRow>
									<TableCell colSpan={5}>
										<div className="flex flex-col items-center">
											{error?.response?.data?.message && (
												<span className="text-red-600 font-medium">
													{error?.response?.data?.message}
												</span>
											)}
											{error?.response?.data?.details &&
												error?.response?.data?.details[0]?.message && (
													<div>
														<span className="text-red-600 font-medium">
															{t("common.errors.message")}
														</span>
														<span>
															{error?.response?.data?.details[0]?.message}
														</span>
													</div>
												)}
										</div>
									</TableCell>
								</TableRow>
							</TableBody>
						) : homes && homes.length > 0 ? (
							<TableBody className="overflow-hidden">
								{homes.map((row, rowIndex) => {
									return (
										<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
											<TableCell>{rowIndex + 1}</TableCell>
											<TableCell>{row.blocks?.name}</TableCell>
											<TableCell>{row?.number}</TableCell>
											<TableCell>
												<div>
													<span className="mx-1">{row?.stage}</span>|
													<span className="mx-1">{row?.rooms}</span>|
													<span className="mx-1">
														{row?.square}
														<Trans i18nKey="common.global.meter">
															m<sup>2</sup>
														</Trans>
													</span>
												</div>
											</TableCell>
											<TableCell>
												<Fab
													color="error"
													variant="action"
													aria-label="delete"
													onClick={() => {
														setHomeId(row.id)
														setOpen(true)
													}}
												>
													<i className="bi bi-trash3" />
												</Fab>
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						) : (
							<TableBody>
								<TableRow>
									<TableCell colSpan={5}>
										<span className="no-data-found-wrapper">
											<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
											{t("common.global.noDataFound")}
										</span>
									</TableCell>
								</TableRow>
							</TableBody>
						)}
					</Table>
				</TableContainer>
				{homes && homes.length > 0 && (
					<div className="p-3 mb-2 mt-4 flex items-center justify-center rounded-lg my-shadow-2">
						<Pagination
							count={Math.ceil(total / perPage) || 1}
							page={page}
							onChange={handleChangePage}
							variant="outlined"
							color="primary"
							showFirstButton
							showLastButton
						/>
					</div>
				)}
			</div>

			{open && (
				<HomeAcceptActivateModal
					open={open}
					setOpen={setOpen}
					homeId={homeId}
					refetch={refetch}
				/>
			)}

			{openDeactivate && (
				<HomeDeactivateModal
					open={openDeactivate}
					setOpen={setOpenDeactivate}
					refetch={refetch}
				/>
			)}
		</div>
	)
}

export default Home
