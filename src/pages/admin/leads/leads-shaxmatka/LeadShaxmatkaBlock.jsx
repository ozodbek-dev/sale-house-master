import { Button, CircularProgress, IconButton, Tab, Tabs } from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useTopPanel from "hooks/useTopPanel"
import { Fragment, useEffect, useState } from "react"
import { useQueries } from "react-query"
import { useParams } from "react-router-dom"
import BackButton from "components/ui/BackButton"
import ShaxmatkaFilter from "components/ui/shaxmatka-filters/ShaxmatkaFilter"
import Shaxmatka2BlockItem from "../../shaxmatka/shaxmatka-parts/Shaxmatka2BlockItem"
import ShaxmatkaBlocksTable from "../../shaxmatka/shaxmatka-parts/ShaxmatkaBlocksTable"
import useLead from "hooks/useLead"
import LeadShaxmatkaBlockItem from "./LeadShaxmatkaBlockItem"
import LeadShaxmatkaHomeDetail from "./LeadShaxmatkaHomeDetail"
import { useTranslation } from "react-i18next"

const LeadShaxmatkaBlock = () => {
	const { objectId } = useParams()
	const { leadData } = useLead()
	const { t, i18n } = useTranslation()
	const axiosPrivate = useAxiosPrivate()
	const { setComponent } = useTopPanel()
	const [resetFilter, setResetFilter] = useState(false)
	const [filterExpanded, setFilterExpanded] = useState(false)
	const [homeExpanded, setHomeExpanded] = useState(false)
	const [hasError, setHasError] = useState(false)
	// const [testMultiple, setTestMultiple] = useState(false)
	const [blocks, setBlocks] = useState([])
	const [tabValue, setTabValue] = useState(0)
	const [selectedHomes, setSelectedHomes] = useState([])

	const [objectQuery, blocksQuery] = useQueries([
		{
			queryKey: "objectSingle",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`/admin/object/edit/${objectId}`
				)
				return response.data.data
			},
			enabled: !hasError && !!objectId,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		},
		{
			queryKey: "objectBlocks",
			queryFn: async function () {
				const response = await axiosPrivate.get(
					`/admin/home/object/${objectId}`
				)
				return response.data.data
			},
			onSuccess: (data) => {
				setBlocks(JSON.parse(JSON.stringify(data)))
			},
			enabled: !hasError,
			onError: (error) => {
				setHasError(true)
			},
			retry: false
		}
	])

	const resetSelection = () => {
		Array.from(document.getElementsByClassName("home-item")).forEach((item) =>
			item.classList.remove("item-selected")
		)
	}

	const resetFilledHomeValues = (homeId, blockIndex) => {
		if (homeId) {
			blocks[blockIndex].homes.splice(
				blocks[blockIndex].homes.findIndex((item) => item.id === homeId),
				1,
				blocksQuery.data[blockIndex].homes.filter(
					(item) => item.id === homeId
				)[0]
			)
			setBlocks([...blocks])
		}
	}

	const toggleSelectionItem = (id, blockIndex) => {
		// if (testMultiple) {
		// 	document
		// 		.querySelector(`.block-${blockIndex}-home#home-${id}`)
		// 		.classList.toggle("item-selected")
		// 	if (selectedHomes.find((item) => item.id === id)) {
		// 		selectedHomes.splice(selectedHomes.map((el) => el.id).indexOf(id), 1)
		// 		resetFilledHomeValues(id, blockIndex)
		// 	} else {
		// 		if (selectedHomes.length === 0) {
		// 		} else {
		// 			setBlocks([...blocks])
		// 		}
		// 		selectedHomes.push({ id: id, blockIndex: blockIndex })
		// 	}
		// 	setSelectedHomes(selectedHomes)
		// } else {
		Array.from(document.getElementsByClassName("home-item")).forEach(
			(item) =>
				item.id !== `home-${id}` && item.classList.remove("item-selected")
		)
		document
			.querySelector(`.block-${blockIndex}-home#home-${id}`)
			.classList.toggle("item-selected")
		if (selectedHomes.find((item) => item.id === id)) {
			setHomeExpanded(false)
			setSelectedHomes([])
			resetFilledHomeValues(id, blockIndex)
		} else {
			setHomeExpanded(true)
			resetFilledHomeValues(selectedHomes[0]?.id, selectedHomes[0]?.blockIndex)
			setSelectedHomes([{ id: id, blockIndex: blockIndex }])
		}
		// }
	}

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
		setResetFilter(true)
		setFilterExpanded(false)
		handleCloseHomeDetail()
	}

	const handleCloseHomeDetail = () => {
		resetSelection()
		setSelectedHomes([])
		setHomeExpanded(false)
	}

	const handleRefetchBlocks = () => {
		resetSelection()
		setSelectedHomes([])
		setHomeExpanded(false)
		blocksQuery.refetch()
	}

	useEffect(() => {
		setComponent(
			<div className="flex flex-row items-center w-full">
				<BackButton />
				<div className="text-xl">
					{t("lead.shaxmatka.shortTitle")} |{" "}
					<span className="text-base-color">{objectQuery?.data?.name}</span>
				</div>
			</div>
		)
	}, [objectQuery?.data, i18n.language])

	return (
		<div className="flex">
			<div
				className={`sheet-filter-wrapper${filterExpanded ? " is-full" : ""}`}
			>
				{Object.keys(blocks).length > 0 && (
					<div className="sheet-filter-body">
						<div className="absolute top-0 right-0">
							<IconButton
								variant="onlyIcon"
								color="primary"
								onClick={() => setFilterExpanded((prev) => !prev)}
							>
								<i className="bi bi-x" />
							</IconButton>
						</div>
						<ShaxmatkaFilter
							blocks={blocks}
							filterExpanded={filterExpanded}
							resetFilter={resetFilter}
							setResetFilter={setResetFilter}
						/>
					</div>
				)}
			</div>
			<div
				className={`sheet-type-tabs${
					filterExpanded
						? homeExpanded
							? " is-mini-dual"
							: " is-mini"
						: homeExpanded
						? " is-mini"
						: ""
				}`}
			>
				<div className="flex mb-1 items-center">
					{!filterExpanded && (
						<div className="mt-2">
							<Button
								variant={filterExpanded ? "filterContained" : "filterOutlined"}
								color="primary"
								startIcon={<i className="bi bi-filter" />}
								onClick={() => setFilterExpanded((prev) => !prev)}
							>
								{t("common.button.filter")}
							</Button>
						</div>
					)}
					<div className="flex items-center justify-between w-full ml-4 flex-wrap">
						<div className="flex mt-2">
							<div className="flex items-center">
								<div className="w-4 h-4 rounded-sm bg-gray-400 mr-1"></div>
								{t("lead.shaxmatka.homeType.disabled")}
							</div>
							<div className="flex ml-4 items-center">
								<div className="w-4 h-4 rounded-sm bg-orange-400 mr-1"></div>
								{t("lead.shaxmatka.homeType.ordered")}
							</div>
							<div className="flex ml-4 items-center">
								<div className="w-4 h-4 rounded-sm bg-red-500 mr-1"></div>
								{t("lead.shaxmatka.homeType.sold")}
							</div>
						</div>
						<div className="flex items-center justify-end mt-2">
							{leadData && Object.keys(leadData).length > 0 && (
								<div className="mr-2 border border-base-color-light px-2 h-[40px] flex items-center rounded-lg">
									<span className="font-medium mr-1">
										{t("lead.shaxmatka.currentLead")}:
									</span>
									{leadData?.surname} {leadData?.name}
								</div>
							)}
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								className="sheet-tabs"
							>
								<Tab
									label={
										<span>
											<i className="bi bi-grid" />{" "}
											{t("lead.shaxmatka.type.shaxmatka1")}
										</span>
									}
								/>
								<Tab
									label={
										<span>
											<i className="bi bi-grid" />{" "}
											{t("lead.shaxmatka.type.shaxmatka2")}
										</span>
									}
								/>
								<Tab
									label={
										<span>
											<i className="bi bi-list-task" />{" "}
											{t("lead.shaxmatka.type.table")}
										</span>
									}
								/>
							</Tabs>
						</div>
					</div>
				</div>

				{tabValue === 0 && (
					<div className="sheet-wrapper">
						<div className="sheet-base-area">
							<div className="sheet-grid">
								{(blocksQuery.isLoading || blocksQuery.isFetching) &&
								(objectQuery.isLoading || objectQuery.isFetching) ? (
									<div className="circular-progress-box min-h-[500px] h-full w-full">
										<CircularProgress size={50} />
									</div>
								) : (
									blocksQuery.data &&
									blocksQuery.data.length > 0 &&
									blocks && (
										<Fragment>
											{blocks.map((block, index) => (
												<div
													className="sheet-column"
													key={`block-${block?.id}-columns`}
													id={`block-${block?.id}-columns`}
												>
													<LeadShaxmatkaBlockItem
														blockItem={block}
														blockIndex={index}
														toggleSelectionItem={toggleSelectionItem}
													/>
												</div>
											))}
										</Fragment>
									)
								)}
							</div>
						</div>
					</div>
				)}
				{tabValue === 1 && (
					<div className="sheet-wrapper type-2">
						<div className="sheet-base-area">
							<div className="sheet-grid">
								{(blocksQuery.isLoading || blocksQuery.isFetching) &&
								(objectQuery.isLoading || objectQuery.isFetching) ? (
									<div className="circular-progress-box min-h-[500px] h-full w-full">
										<CircularProgress size={50} />
									</div>
								) : (
									blocksQuery.data &&
									blocksQuery.data.length > 0 &&
									blocks &&
									blocks.map((block, index) => (
										<div
											className="sheet-column"
											key={`block-${block?.id}-columns`}
											id={`block-${block?.id}-columns`}
										>
											<Shaxmatka2BlockItem
												blockItem={block}
												blockIndex={index}
												toggleSelectionItem={toggleSelectionItem}
											/>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				)}
				{tabValue === 2 && (
					<div className="pb-4 pt-2">
						<ShaxmatkaBlocksTable
							isLoading={
								(blocksQuery.isLoading || blocksQuery.isFetching) &&
								(objectQuery.isLoading || objectQuery.isFetching)
							}
							isError={blocksQuery.isError || objectQuery.isError}
							blocks={blocks}
							toggleSelectionItem={toggleSelectionItem}
						/>
					</div>
				)}
			</div>
			<div className={`sheet-actions-area${homeExpanded ? " is-full" : ""}`}>
				{homeExpanded && (
					<div className="sheet-actions-body">
						<div className="absolute top-0 right-0">
							<IconButton
								variant="onlyIcon"
								color="primary"
								onClick={() => handleCloseHomeDetail()}
							>
								<i className="bi bi-x" />
							</IconButton>
						</div>
						<LeadShaxmatkaHomeDetail
							selectedHome={selectedHomes}
							blocks={blocksQuery.data}
							refetchFn={handleRefetchBlocks}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default LeadShaxmatkaBlock
