import { CircularProgress, Fab, Grid } from "@mui/material"
import DoughnutChart from "components/ui/charts/DoughnutChart"
import LineChart from "components/ui/charts/LineChart"
import SimpleDateField from "components/ui/simple-fields/date-picker/SimpleDateField"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useTopPanel from "hooks/useTopPanel"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useQueries } from "react-query"
import { colorSeparators, colors } from "shared/colors"
import "moment/locale/uz-latn"
import "moment/locale/ru"
import "moment/locale/uz"
import { numericFormatter } from "react-number-format"
import { useTranslation } from "react-i18next"

const Dashboard = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const [hasError, setHasError] = useState(false)
	const [fromDate, setFromDate] = useState(
		moment().startOf("month").format("YYYY-MM-DD")
	)
	const [endDate, setEndDate] = useState(
		moment().endOf("month").format("YYYY-MM-DD")
	)
	const localeMoment = moment

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("dashboard.title")}
			</div>
		)
		localeMoment.locale(i18n.language === "uz" ? "uz-latn" : "uz")
	}, [i18n.language])

	const [
		debitorsQuery,
		contractsQuery,
		homesQuery,
		futureIncomeQuery,
		leadsQuery,
		leadsFromQuery,
		paymentsQuery
	] = useQueries([
		{
			queryKey: "debitorsQueryKey",
			queryFn: async function () {
				const response = await axiosPrivate.get("/admin/dashboard/debitors")
				return response.data?.data
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "contractsQueryKey",
			queryFn: async function () {
				const response = await axiosPrivate.get("/admin/dashboard/contracts")
				return response.data?.data
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "homesQueryKey",
			queryFn: async function () {
				const response = await axiosPrivate.get("/admin/dashboard/homes")
				return response.data?.data
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "futureIncomeQueryKey",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`/admin/dashboard/within?from=${fromDate}&till=${endDate}`
				)
				return response.data?.data
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "leadsQueryKey",
			queryFn: async function () {
				const response = await axiosPrivate.get("/admin/dashboard/leadcomes")
				return response.data?.data
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "leadsFromQueryKey",
			queryFn: async function () {
				const response = await axiosPrivate.get("/admin/dashboard/leads")
				return response.data?.data
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "paymentsQueryKey",
			queryFn: async function () {
				const response = await axiosPrivate.get("/admin/dashboard/payments")
				return response.data?.data
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		}
	])

	useEffect(() => {
		futureIncomeQuery.refetch()
	}, [fromDate, endDate])

	const handleFromDate = (date) => {
		if (moment(date, "YYYY-MM-DD").isValid()) {
			setFromDate(date)
			if (moment(endDate, "YYYY-MM-DD") < moment(date, "YYYY-MM-DD")) {
				setEndDate(
					moment(date, "YYYY-MM-DD").add(1, "day").format("YYYY-MM-DD")
				)
			}
		} else {
			setFromDate(moment().startOf("month").format("YYYY-MM-DD"))
		}
	}

	const handleEndDate = (date) => {
		if (moment(date, "YYYY-MM-DD").isValid()) {
			setEndDate(date)
			if (moment(date, "YYYY-MM-DD") < moment(fromDate, "YYYY-MM-DD")) {
				setFromDate(
					moment(date, "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD")
				)
			}
		} else {
			setEndDate(moment().endOf("month").format("YYYY-MM-DD"))
		}
	}

	return (
		<div className="dashboard-wrapper">
			<div className="py-6">
				<Grid
					container
					spacing={3}
					columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
				>
					<Grid item={true} lg={9} md={12} sm={12} xs={12}>
						<Grid
							container
							spacing={3}
							columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
						>
							<Grid item={true} md={6} sm={12} xs={12}>
								<div className="payments-wrapper dashboard-item-wrapper">
									<div className="payments-title dashboard-item-title">
										{t("dashboard.monthlyPaymentsGraph")}
									</div>
									<div className="payments-body dashboard-item-body">
										{paymentsQuery.isLoading || paymentsQuery.isFetching ? (
											<div className="circular-progress-box">
												<CircularProgress size={35} />
											</div>
										) : paymentsQuery.data &&
										  paymentsQuery.data?.data &&
										  paymentsQuery.data?.data.length > 0 ? (
											<div>
												<div className="my-4 flex items-center justify-center h-[275px]">
													<LineChart
														chartLabels={[...paymentsQuery.data.data]
															.reverse()
															.map((item) =>
																localeMoment(item.date, "YYYY-MM-DD").format(
																	"D MMM."
																)
															)}
														chartDatasets={[
															{
																data: [...paymentsQuery.data.data]
																	.reverse()
																	.map((item) => item.sum),
																borderRadius: 8,
																borderWidth: 2,
																borderColor: colors.baseColorLight,
																backgroundColor: colors.baseColorOutline,
																hoverBackgroundColor: colors.baseColorLight,
																xAxisID: "xAxis",
																yAxisID: "yAxis",
																tension: 0.3
															}
														]}
														options={{
															scales: {
																xAxis: {
																	ticks: {
																		color: "black"
																	}
																},
																yAxis: {
																	ticks: {
																		color: "black",
																		callback: function (value) {
																			return numericFormatter(
																				value.toString(),
																				{
																					decimalScale: 3,
																					thousandSeparator: " ",
																					allowNegative: false,
																					suffix: " UZS"
																				}
																			)
																		}
																	}
																}
															}
														}}
													/>
												</div>
											</div>
										) : (
											<span className="no-data-found-wrapper">
												<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
												{t("common.global.noDataFound")}
											</span>
										)}
									</div>
									<div className="dashboard-item-refresh-btn">
										<Fab
											variant="action"
											color="info"
											onClick={() => paymentsQuery.refetch()}
											disabled={
												paymentsQuery.isFetching || paymentsQuery.isLoading
											}
										>
											<i
												className={`bi bi-arrow-repeat${
													paymentsQuery.isFetching || paymentsQuery.isLoading
														? " animate-spin"
														: ""
												}`}
											/>
										</Fab>
									</div>
								</div>
							</Grid>

							<Grid item={true} md={6} sm={12} xs={12}>
								<div className="contracts-wrapper dashboard-item-wrapper">
									<div className="contracts-title dashboard-item-title">
										{t("dashboard.contractsGraph")}
									</div>
									<div className="contracts-body dashboard-item-body">
										{contractsQuery.isLoading || contractsQuery.isFetching ? (
											<div className="circular-progress-box">
												<CircularProgress size={35} />
											</div>
										) : contractsQuery.data &&
										  contractsQuery.data.length > 0 ? (
											<div>
												<div className="my-4 flex items-center justify-center h-[275px]">
													<LineChart
														chartLabels={[...contractsQuery.data]
															.reverse()
															.map((item) =>
																localeMoment(item.date, "YYYY-MM-DD").format(
																	"D MMM."
																)
															)}
														chartDatasets={[
															{
																data: [...contractsQuery.data]
																	.reverse()
																	.map((item) => item.count),
																borderRadius: 8,
																borderWidth: 2,
																borderColor: colors.baseColorLight,
																backgroundColor: colors.baseColorOutline,
																hoverBackgroundColor: colors.baseColorLight,
																xAxisID: "xAxis",
																yAxisID: "yAxis",
																tension: 0.3
															}
														]}
														options={{
															scales: {
																xAxis: {
																	ticks: {
																		color: "black"
																	}
																},
																yAxis: {
																	ticks: {
																		color: "black"
																	}
																}
															}
														}}
													/>
												</div>
											</div>
										) : (
											<span className="no-data-found-wrapper">
												<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
												{t("common.global.noDataFound")}
											</span>
										)}
									</div>
									<div className="dashboard-item-refresh-btn">
										<Fab
											variant="action"
											color="info"
											onClick={() => contractsQuery.refetch()}
											disabled={
												contractsQuery.isFetching || contractsQuery.isLoading
											}
										>
											<i
												className={`bi bi-arrow-repeat${
													contractsQuery.isFetching || contractsQuery.isLoading
														? " animate-spin"
														: ""
												}`}
											/>
										</Fab>
									</div>
								</div>
							</Grid>
						</Grid>
					</Grid>

					<Grid item={true} lg={3} md={6} sm={6} xs={12}>
						<div className="future-income-wrapper dashboard-item-wrapper h-full">
							<div className="future-income-title dashboard-item-title mr-10">
								{t("dashboard.futureIncomeGraph.title")}
							</div>
							<div className="future-income-body dashboard-item-body">
								{futureIncomeQuery.isLoading || futureIncomeQuery.isFetching ? (
									<div className="circular-progress-box">
										<CircularProgress size={35} />
									</div>
								) : futureIncomeQuery.data ? (
									<div>
										<div className="w-full text-sm">
											<div>
												{t("dashboard.futureIncomeGraph.all")}:{" "}
												<CurrencyFormat value={futureIncomeQuery.data?.total} />
											</div>
											<div>
												{t("dashboard.futureIncomeGraph.paid")}:{" "}
												<CurrencyFormat value={futureIncomeQuery.data?.pay} />
											</div>
											<div>
												{t("dashboard.futureIncomeGraph.notPaid")}:{" "}
												<CurrencyFormat
													value={
														futureIncomeQuery.data?.total -
														futureIncomeQuery.data?.pay
													}
												/>
											</div>
										</div>
										<div className="w-full mt-1 flex items-center justify-between">
											<div className="mr-1.5">
												<SimpleDateField
													delay={0}
													name="from-date"
													label={t("common.fields.fromDate")}
													value={fromDate}
													setValue={handleFromDate}
													size="small"
												/>
											</div>
											<div className="ml-1.5">
												<SimpleDateField
													delay={0.1}
													name="end-date"
													label={t("common.fields.endDate")}
													value={endDate}
													setValue={handleEndDate}
													size="small"
												/>
											</div>
										</div>
										<div className="h-[175px] mx-auto">
											<DoughnutChart
												chartLabels={[
													t("dashboard.futureIncomeGraph.notPaidQuantity"),
													t("dashboard.futureIncomeGraph.paidQuantity")
												]}
												chartDatasets={[
													{
														data: [
															futureIncomeQuery.data?.total -
																futureIncomeQuery.data?.pay,
															futureIncomeQuery.data?.pay
														],
														backgroundColor: [
															`rgba(${colorSeparators.errorColor}, 0.65)`,
															`rgba(${colorSeparators.successColor}, 0.65)`
														],
														hoverBorderColor: [
															`rgba(${colorSeparators.errorColor}, 1)`,
															`rgba(${colorSeparators.successColor}, 1)`
														],
														borderWidth: 1,
														hoverBorderWidth: 3
													}
												]}
												options={{
													plugins: {
														legend: {
															display: false
														}
													}
												}}
											/>
										</div>
									</div>
								) : (
									<span className="no-data-found-wrapper">
										<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
										{t("common.global.noDataFound")}
									</span>
								)}
							</div>
							<div className="dashboard-item-refresh-btn">
								<Fab
									variant="action"
									color="info"
									onClick={() => futureIncomeQuery.refetch()}
									disabled={
										futureIncomeQuery.isFetching || futureIncomeQuery.isLoading
									}
								>
									<i
										className={`bi bi-arrow-repeat${
											futureIncomeQuery.isFetching ||
											futureIncomeQuery.isLoading
												? " animate-spin"
												: ""
										}`}
									/>
								</Fab>
							</div>
						</div>
					</Grid>

					<Grid item={true} lg={4} md={6} sm={6} xs={12}>
						<div className="debitors-wrapper dashboard-item-wrapper">
							<div className="debitors-title dashboard-item-title">
								{t("dashboard.debtsGraph.title")}
							</div>
							<div className="debitors-body dashboard-item-body">
								{debitorsQuery.isLoading || debitorsQuery.isFetching ? (
									<div className="circular-progress-box">
										<CircularProgress size={35} />
									</div>
								) : debitorsQuery.data ? (
									<div className="flex flex-col items-center">
										<div className="w-full text-base">
											<div>
												{t("dashboard.debtsGraph.all")}:{" "}
												<CurrencyFormat value={debitorsQuery.data?.totaldebt} />
											</div>
											<div>
												{t("dashboard.debtsGraph.monthly")}:{" "}
												<CurrencyFormat value={debitorsQuery.data?.month} />
											</div>
										</div>
										<div className="w-3/4 h-[250px]">
											<DoughnutChart
												chartLabels={[
													t("dashboard.debtsGraph.monthly"),
													t("dashboard.debtsGraph.all")
												]}
												chartDatasets={[
													{
														data: [
															debitorsQuery.data?.month,
															debitorsQuery.data?.totaldebt
														],
														backgroundColor: [
															`rgba(${colorSeparators.warningColor}, 0.65)`,
															`rgba(${colorSeparators.baseColorLight}, 0.65)`
														],
														hoverBorderColor: [
															`rgba(${colorSeparators.warningColor}, 1)`,
															`rgba(${colorSeparators.baseColorLight}, 1)`
														],
														borderWidth: 1,
														hoverBorderWidth: 3
													}
												]}
											/>
										</div>
									</div>
								) : (
									<span className="no-data-found-wrapper">
										<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
										{t("common.global.noDataFound")}
									</span>
								)}
							</div>
							<div className="dashboard-item-refresh-btn">
								<Fab
									variant="action"
									color="info"
									onClick={() => debitorsQuery.refetch()}
									disabled={debitorsQuery.isFetching || debitorsQuery.isLoading}
								>
									<i
										className={`bi bi-arrow-repeat${
											debitorsQuery.isFetching || debitorsQuery.isLoading
												? " animate-spin"
												: ""
										}`}
									/>
								</Fab>
							</div>
						</div>
					</Grid>

					<Grid item={true} lg={4} md={6} sm={6} xs={12}>
						<div className="leads-wrapper dashboard-item-wrapper">
							<div className="leads-title dashboard-item-title">
								{t("dashboard.leadsGraph")}
							</div>
							<div className="leads-body dashboard-item-body">
								{leadsQuery.isLoading || leadsQuery.isFetching ? (
									<div className="circular-progress-box">
										<CircularProgress size={35} />
									</div>
								) : leadsQuery.data && leadsQuery.data.length > 0 ? (
									<div>
										<div className="my-4 flex items-center justify-center h-[275px]">
											<LineChart
												chartLabels={[...leadsQuery.data]
													.reverse()
													.map((item) =>
														localeMoment(item.date, "YYYY-MM-DD").format(
															"D MMM."
														)
													)}
												chartDatasets={[
													{
														data: [...leadsQuery.data]
															.reverse()
															.map((item) => item.count),
														borderRadius: 8,
														borderWidth: 2,
														borderColor: colors.baseColorLight,
														backgroundColor: colors.baseColorOutline,
														hoverBackgroundColor: colors.baseColorLight,
														xAxisID: "xAxis",
														yAxisID: "yAxis",
														tension: 0.3
													}
												]}
												options={{
													scales: {
														xAxis: {
															ticks: {
																color: "black"
															}
														},
														yAxis: {
															ticks: {
																color: "black"
															}
														}
													}
												}}
											/>
										</div>
									</div>
								) : (
									<span className="no-data-found-wrapper">
										<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
										{t("common.global.noDataFound")}
									</span>
								)}
							</div>
							<div className="dashboard-item-refresh-btn">
								<Fab
									variant="action"
									color="info"
									onClick={() => leadsQuery.refetch()}
									disabled={leadsQuery.isFetching || leadsQuery.isLoading}
								>
									<i
										className={`bi bi-arrow-repeat${
											leadsQuery.isFetching || leadsQuery.isLoading
												? " animate-spin"
												: ""
										}`}
									/>
								</Fab>
							</div>
						</div>
					</Grid>

					<Grid item={true} lg={4} md={6} sm={6} xs={12}>
						<div className="leads-from-wrapper dashboard-item-wrapper">
							<div className="leads-from-title dashboard-item-title">
								{t("dashboard.leadSourcesGraph")}
							</div>
							<div className="leads-from-body dashboard-item-body">
								{leadsFromQuery.isLoading || leadsFromQuery.isFetching ? (
									<div className="circular-progress-box">
										<CircularProgress size={35} />
									</div>
								) : leadsFromQuery.data && leadsFromQuery.data.length > 0 ? (
									<div className="flex flex-col items-center">
										<div className="w-3/4 h-[300px]">
											<DoughnutChart
												chartLabels={[
													...leadsFromQuery.data.map((item) => item.name)
												]}
												chartDatasets={[
													{
														data: [
															...leadsFromQuery.data.map((item) => item.count)
														],
														borderWidth: 1,
														hoverBorderWidth: 3
													}
												]}
											/>
										</div>
									</div>
								) : (
									<span className="no-data-found-wrapper">
										<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
										{t("common.global.noDataFound")}
									</span>
								)}
							</div>
							<div className="dashboard-item-refresh-btn">
								<Fab
									variant="action"
									color="info"
									onClick={() => leadsFromQuery.refetch()}
									disabled={
										leadsFromQuery.isFetching || leadsFromQuery.isLoading
									}
								>
									<i
										className={`bi bi-arrow-repeat${
											leadsFromQuery.isFetching || leadsFromQuery.isLoading
												? " animate-spin"
												: ""
										}`}
									/>
								</Fab>
							</div>
						</div>
					</Grid>

					<Grid item={true} lg={8} sm={12} xs={12}>
						<div className="free-homes-wrapper dashboard-item-wrapper">
							<div className="leads-from-title dashboard-item-title">
								{t("dashboard.freeHomesGraph.title")}
							</div>
							<div className="free-homes-body dashboard-item-body">
								{homesQuery.isLoading || homesQuery.isFetching ? (
									<div className="circular-progress-box">
										<CircularProgress size={35} />
									</div>
								) : homesQuery.data && homesQuery.data ? (
									<div className="w-full mt-3">
										<div className="font-medium underline">
											{t("dashboard.freeHomesGraph.all")}:{" "}
											{homesQuery.data?.freehomes}
										</div>
										<div className="flex flex-row mt-3">
											<div className="w-1/2 pr-3 border-r-[1px] border-gray-300">
												<span className="font-medium text-base-color">
													{t("dashboard.freeHomesGraph.freeBlocks.title")}:
												</span>
												{homesQuery.data?.freeblocks &&
													homesQuery.data?.freeblocks.length > 0 &&
													homesQuery.data?.freeblocks.map((item) => (
														<div
															key={`free-block-${item.id}`}
															className="text-sm p-2 rounded-lg my-shadow-1 my-3"
														>
															<div>
																{t("dashboard.freeHomesGraph.freeBlocks.name")}:{" "}
																{item?.name}
															</div>
															<div>
																{t(
																	"dashboard.freeHomesGraph.freeBlocks.freeHomesNumber"
																)}
																: {item?.room_number}
															</div>
														</div>
													))}
											</div>
											<div className="w-1/2 pl-3 border-l-[1px] border-gray-300">
												<span className="font-medium text-base-color">
													{t("dashboard.freeHomesGraph.freeObjects")}:
												</span>
												{homesQuery.data?.freeobjects &&
													homesQuery.data?.freeobjects.length > 0 &&
													homesQuery.data?.freeobjects.map((item) => (
														<div
															key={`free-object-${item.id}`}
															className="text-sm p-2 rounded-lg my-shadow-1 my-3"
														>
															{item?.name}
														</div>
													))}
											</div>
										</div>
									</div>
								) : (
									<span className="no-data-found-wrapper">
										<i className="bi bi-exclamation-octagon text-xl leading-4 mr-1" />{" "}
										{t("common.global.noDataFound")}
									</span>
								)}
								<div className="dashboard-item-refresh-btn">
									<Fab
										variant="action"
										color="info"
										onClick={() => homesQuery.refetch()}
										disabled={homesQuery.isFetching || homesQuery.isLoading}
									>
										<i
											className={`bi bi-arrow-repeat${
												homesQuery.isFetching || homesQuery.isLoading
													? " animate-spin"
													: ""
											}`}
										/>
									</Fab>
								</div>
							</div>
						</div>
					</Grid>
				</Grid>
			</div>
		</div>
	)
}

export default Dashboard
