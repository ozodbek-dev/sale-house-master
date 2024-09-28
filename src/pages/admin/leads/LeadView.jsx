import {
	Box,
	Button,
	Chip,
	CircularProgress,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow
} from "@mui/material"
import BackButton from "components/ui/BackButton"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useTopPanel from "hooks/useTopPanel"
import { Fragment, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import BaseTooltipCustomWidth from "components/ui/tooltips/BaseTooltipCustomWidth"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import moment from "moment"
import LeadCommentModal from "./LeadCommentModal"
import {
	repairTypeVariants,
	residentTypeVariants
} from "shared/tableColVariantsList"
import { Trans, useTranslation } from "react-i18next"

const LeadView = () => {
	const { id } = useParams()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [openCommentModal, setOpenCommentModal] = useState(false)
	const { setComponent } = useTopPanel()

	const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
		queryKey: "leadSingle",
		queryFn: async function () {
			const response = await axiosPrivate.get(`/operator/lead/edit/${id}`)
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
			<div className="flex flex-row items-center">
				<BackButton />
				<div className="text-base-color text-xl font-medium flex flex-row">
					<BaseTooltipCustomWidth
						arrow={true}
						placement="bottom"
						enterDelay={1000}
						leaveTouchDelay={0}
						title={t("lead.view.title", { name: data?.name })}
						width={"800px"}
						fontSize={"1rem"}
					>
						<span className="text-line-1 max-w-[800px] ml-1">
							{t("lead.view.title", { name: data?.name })}
						</span>
					</BaseTooltipCustomWidth>
				</div>
			</div>
		)
	}, [data, i18n.language])

	const setHomeType = (item, typeArr) => {
		let result = typeArr.filter((variant) => variant.code === item)
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

	return (
		<div className="lead-view-wrapper">
			{isLoading || isFetching ? (
				<div className="circular-progress-box py-5">
					<CircularProgress size={35} />
				</div>
			) : (
				<div className="lead-details-wrapper">
					{data && (
						<Fragment>
							<div className="lead-data-wrapper pr-1">
								<div className="lead-data-item">
									<div className="data-item-title">{t("lead.view.name")}:</div>
									<div className="data-item-value underline font-medium">
										{data?.lead?.name}
									</div>
								</div>

								<div className="lead-data-item">
									<div className="data-item-title">{t("lead.view.phone")}:</div>
									<div className="data-item-value">
										<PhoneFormat value={data?.lead?.phone} />
									</div>
								</div>

								<div className="lead-data-item">
									<div className="data-item-title">{t("lead.view.date")}:</div>
									<div className="data-item-value">
										{data?.lead?.date &&
											moment(data?.lead?.date).format("DD/MM/YYYY")}
									</div>
								</div>

								{data?.lead?.type && data?.lead?.type === "1" && (
									<div className="mt-4">
										<Button
											color="success"
											variant="contained"
											onClick={() => setOpenCommentModal(true)}
										>
											{t("lead.view.addComment")}
										</Button>
									</div>
								)}
							</div>
							<div className="lead-data-wrapper pl-1">
								<div className="lead-data-item">
									<div className="data-item-title">
										{t("lead.view.source")}:
									</div>
									<div className="data-item-value">
										{data?.lead?.come?.name}
									</div>
								</div>
								<div className="lead-data-item">
									<div className="data-item-title">
										{t("lead.view.interest")}:
									</div>
									<div className="data-item-value">
										{data?.lead?.types?.name}
									</div>
								</div>
								<div className="lead-data-item">
									<div className="data-item-title">{t("lead.view.staff")}:</div>
									<div className="data-item-value">
										{data?.lead?.staff?.name}
									</div>
								</div>
							</div>
						</Fragment>
					)}
				</div>
			)}

			<div className="lead-homes-comments-list">
				<div className="lead-homes-wrapper">
					<div className="homes-list-title">{t("lead.view.homes.title")}</div>
					<Box className="base-table">
						<TableContainer className="min-h-[124px]">
							<Table
								stickyHeader
								sx={{ minWidth: 750, height: "max-content" }}
								aria-labelledby="tableTitle"
							>
								<TableHead>
									<TableRow>
										<TableCell>№</TableCell>
										<TableCell>{t("lead.view.homes.stage")}</TableCell>
										<TableCell>{t("lead.view.homes.rooms")}</TableCell>
										<TableCell>{t("lead.view.homes.areaAll")}</TableCell>
										<TableCell>{t("lead.view.homes.residentType")}</TableCell>
										<TableCell>{t("lead.view.homes.repairType")}</TableCell>
										<TableCell>{t("lead.view.homes.staff")}</TableCell>
									</TableRow>
								</TableHead>
								{isLoading || isFetching ? (
									<TableBody className="overflow-hidden">
										<TableRow>
											<TableCell colSpan={8}>
												<LinearProgress />
											</TableCell>
										</TableRow>
									</TableBody>
								) : isError ? (
									<TableBody className="overflow-hidden">
										<TableRow>
											<TableCell colSpan={8}>
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
								) : data && data.homes && data.homes.length > 0 ? (
									<Fragment>
										<TableBody className="overflow-hidden">
											{data.homes.map((row, rowIndex) => (
												<TableRow hover tabIndex={-1} key={"row-" + rowIndex}>
													<TableCell>{rowIndex + 1}</TableCell>
													<TableCell>{row?.home?.stage || "—"}</TableCell>
													<TableCell>{row?.home?.rooms || "—"}</TableCell>
													<TableCell>
														{row?.home?.square ? (
															<>
																{row.home.square}{" "}
																<Trans i18nKey="common.global.meter">
																	m<sup>2</sup>
																</Trans>
															</>
														) : (
															"—"
														)}
													</TableCell>
													<TableCell>
														{row?.home?.islive
															? setHomeType(
																	row.home.islive,
																	residentTypeVariants
															  )
															: "—"}
													</TableCell>
													<TableCell>
														{row?.home?.isrepaired
															? setHomeType(
																	row.home.isrepaired,
																	repairTypeVariants
															  )
															: "—"}
													</TableCell>
													<TableCell>{row?.staff?.name}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Fragment>
								) : (
									<TableBody>
										<TableRow>
											<TableCell colSpan={8}>
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
					</Box>
				</div>
				<div className="lead-comments-wrapper">
					<div className="comments-list-title">
						{t("lead.view.comments.title")}
					</div>
					<div className="lead-comments-list">
						{isLoading || isFetching ? (
							<div className="circular-progress-box py-5">
								<CircularProgress size={30} />
							</div>
						) : data &&
						  data.lead &&
						  data.lead.comment &&
						  data.lead.comment.length > 0 ? (
							[...data.lead.comment].reverse().map((item, index) => (
								<div key={`comment-${index}`} className="comment-item-wrapper">
									<div className="font-bold">{index + 1}.</div>
									<div className="comment-item-body">
										<div>{item?.comment}</div>
										<div className="comment-item-staff-date">
											<span className="comment-item-staff">
												{item?.staff?.name}
											</span>
											<span className="comment-item-date">
												{item?.created_at
													? moment(item.created_at).format("DD/MM/YYYY HH:mm")
													: ""}
											</span>
										</div>
									</div>
								</div>
							))
						) : (
							<span className="no-data-found-wrapper h-[100px]">
								<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
								{t("common.global.noDataFound")}
							</span>
						)}
					</div>
				</div>
			</div>

			{openCommentModal && (
				<LeadCommentModal
					open={openCommentModal}
					setOpen={setOpenCommentModal}
					itemId={id}
					refetch={refetch}
				/>
			)}
		</div>
	)
}

export default LeadView
