import { Box, CircularProgress, Grid, Pagination } from "@mui/material"
import { motion } from "framer-motion"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { Link, useSearchParams } from "react-router-dom"
import { fadeUp } from "utils/motion"

const ShaxmatkaCardsPaginationList = ({ emitRefetch = {} }) => {
	const { t } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [queryPath, setQueryPath] = useState("")

	const {
		error,
		data: rows,
		isLoading,
		isFetching,
		isError,
		refetch
	} = useQuery({
		queryKey: "shaxmatkaCardsListKey",
		queryFn: async function () {
			const response = await axiosPrivate.get(queryPath)
			return response?.data?.data
		},
		onSettled: () => {
			emitRefetch.setRefetch(false)
		},
		enabled: false,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

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

	useEffect(() => {
		if (emitRefetch && emitRefetch.refetch) {
			refetch()
		}
	}, [emitRefetch.refetch])

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
		searchParams.set("page", newPage)
		setSearchParams(searchParams)
	}

	const createQueryPath = () => {
		let newQueryPath = `/dictionary/objects`
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

	return (
		<Box className="shaxmatka-cards-list-wrapper">
			{isLoading || isFetching ? (
				<div className="circular-progress-box h-[100px]">
					<CircularProgress size={40} />
				</div>
			) : isError ? (
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
								<span>{error?.response?.data?.details[0]?.message}</span>
							</div>
						)}
				</div>
			) : rows && rows.data && rows.data.length > 0 ? (
				<Grid
					container
					spacing={4}
					columns={{ xl: 8, md: 12, sm: 12, xs: 12 }}
					className="shaxmatka-card-items"
				>
					{rows.data.map((row, rowIndex) => (
						<Grid
							key={row.id}
							item={true}
							xl={2}
							md={4}
							sm={6}
							xs={12}
							className="shaxmatka-card-item"
							component={motion.div}
							variants={fadeUp(30, "tween", rowIndex * 0.2, 0.5)}
							initial="hidden"
							animate="show"
							viewport={{ once: true }}
						>
							<Link
								to={`${row.id}/object`}
								className="no-underline no-bg-underline"
							>
								<div className="shaxmatka-card">
									<div className="shaxmatka-card-content-wrapper">
										<img
											src={
												row.image
													? `${process.env.REACT_APP_BACKEND_URL}/${row.image}`
													: require("assets/images/shaxmatka/shaxmatka-card-bg.png")
											}
											alt={row.image ? "object-image" : "shaxmatka-card-bg-img"}
											className="shaxmatka-card-image"
										/>
										<div className="shaxmatka-card-content-body">
											<span className="shaxmatka-card-title">{row?.name}</span>
											<div className="shaxmatka-card-details">
												<div className="card-detail-item">
													<i className="bi bi-buildings card-detail-item-icon" />
													<div className="card-details-item-value">
														<span>{t("shaxmatka.card.company")}:</span>{" "}
														{row?.companies?.name}
													</div>
												</div>
												<div className="card-detail-item">
													<i className="bi bi-pin-map card-detail-item-icon" />
													<div className="card-details-item-value">
														<span>{t("shaxmatka.card.region")}:</span>{" "}
														{row?.regions.name}
													</div>
												</div>
												<div className="card-detail-item">
													<i className="bi bi-geo-alt card-detail-item-icon" />
													<div className="card-details-item-value">
														<span>{t("shaxmatka.card.city")}:</span> {row?.city}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Link>
						</Grid>
					))}
				</Grid>
			) : (
				<span className="no-data-found-wrapper">
					<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
					{t("common.global.noDataFound")}
				</span>
			)}
			{rows && rows.data && rows.data.length > 0 && (
				<div className="p-3 mb-2 mt-4 flex items-center justify-center rounded-lg my-shadow-2">
					<Pagination
						count={Math.ceil(rows.total / rows.per_page) || 1}
						page={page}
						onChange={handleChangePage}
						variant="outlined"
						color="primary"
						showFirstButton
						showLastButton
					/>
				</div>
			)}
		</Box>
	)
}

export default ShaxmatkaCardsPaginationList
