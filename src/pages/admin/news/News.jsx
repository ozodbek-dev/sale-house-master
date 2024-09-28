import { Button, ButtonBase, Pagination } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import { Fragment, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useQuery } from "react-query"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useAuth from "hooks/useAuth"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import useNavigationByRole from "hooks/useNavigationByRole"
import { useTranslation } from "react-i18next"

const News = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("news.title")}
			</div>
		)
	}, [i18n.language])

	const [{ user }] = useAuth()
	const { navigateFn } = useNavigationByRole()
	const [selectedNews, setSelectedNews] = useState(null)
	const [hasError, setHasError] = useState(false)
	const [queryPath, setQueryPath] = useState("")
	const axiosPrivate = useAxiosPrivate()

	const {
		data: news,
		isLoading,
		isFetching,
		refetch
	} = useQuery({
		queryKey: "newsQueryKey",
		queryFn: async function () {
			const response = await axiosPrivate.get(queryPath)
			return response?.data?.data
		},
		onSuccess: (data) => {
			if (data && data.data && data.data.length > 0) {
				setSelectedNews(data.data[0])
			}
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
		createQueryPath()
	}, [])

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
		searchParams.set("page", newPage)
		setSearchParams(searchParams)
	}

	const createQueryPath = () => {
		let newQueryPath = "/admin/news/index"
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

	const getVideoId = (url) => {
		if (url && url.includes("live")) {
			let ID = ""
			url = url
				.replace(/(>|<)/gi, "")
				.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/live\/)/)
			if (url[2] !== undefined) {
				ID = url[2].split(/[^0-9a-z_\-]/i)
				ID = ID[0]
			}
			return ID
		} else {
			let ID = ""
			url = url
				.replace(/(>|<)/gi, "")
				.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
			if (url[2] !== undefined) {
				ID = url[2].split(/[^0-9a-z_\-]/i)
				ID = ID[0]
			}
			return ID
		}
	}

	const handleSelectedNews = (newsData) => {
		if (selectedNews?.id !== newsData.id) {
			setSelectedNews(newsData)
		}
	}

	return (
		<div className="component-list-wrapper">
			<div className="component-list-header mb-2">
				<div className="header-actions-container py-3 flex flex-row items-center">
					<div className="header-actions filter-box flex items-center my-shadow-2 rounded-lg px-4 w-full h-14"></div>
					<div className="header-actions action-buttons-box py-3 px-4 my-shadow-2 rounded-lg flex items-center justify-center ml-4">
						<Button
							variant="action"
							color="info"
							onClick={() => refetch()}
							disabled={isLoading || isFetching}
						>
							<i
								className={`bi bi-arrow-repeat${
									isLoading || isFetching ? " animate-spin" : ""
								}`}
							/>
						</Button>
						{!(user && user?.user?.role === ROLE_TYPE_LIST.MANAGER.code) && (
							<Button
								variant="action"
								color="success"
								className="!mx-2"
								onClick={() => {
									navigateFn("/BASE/news/add")
								}}
							>
								<i className="bi bi-plus-circle" />
							</Button>
						)}
					</div>
				</div>
			</div>

			{news && news.data && news.data.length > 0 && (
				<Fragment>
					<div className="news-wrapper">
						<div className="news-item-details-wrapper">
							{selectedNews && (
								<Fragment>
									<div className="selected-news-item-video">
										<iframe
											src={`https://www.youtube.com/embed/${getVideoId(
												selectedNews.link
											)}?controls=1&disablekb=1&modestbranding=0`}
											title="YouTube video player"
											frameBorder="0"
											allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
											allowFullScreen
											width="100%"
											height="400px"
										/>
									</div>
									<div className="flex items-center justify-between mt-4 mb-3">
										<div className="selected-news-title">
											{selectedNews.title}
										</div>
										{!(
											user && user?.user?.role === ROLE_TYPE_LIST.MANAGER.code
										) && (
											<Button
												variant="outlined"
												color="warning"
												className="!mx-2"
												onClick={() => {
													navigateFn(`/BASE/news/edit/${selectedNews?.id}`)
												}}
											>
												<i className="bi bi-pencil mr-2" />
												{t("common.button.edit")}
											</Button>
										)}
									</div>
									<div
										className="selected-news-body"
										dangerouslySetInnerHTML={{ __html: selectedNews?.body }}
									></div>
								</Fragment>
							)}
						</div>
						<div className="news-list-wrapper">
							{news.data.map((item) => (
								<ButtonBase
									className={`news-item${
										selectedNews?.id === item?.id ? " item-selected" : ""
									}`}
									id={`news-${item.id}`}
									key={item.id}
									onClick={() => handleSelectedNews(item)}
								>
									<div className="flex flex-row w-full">
										<div className="news-item-video">
											<img
												src={`https://img.youtube.com/vi/${getVideoId(
													item.link
												)}/mqdefault.jpg`}
												alt={item.title}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="news-content">
											<div className="news-title">{item.title}</div>
											<div
												className="news-body"
												dangerouslySetInnerHTML={{ __html: item.body }}
											></div>
										</div>
									</div>
								</ButtonBase>
							))}
						</div>
					</div>
					<div className="p-3 mb-2 mt-4 flex items-center justify-center rounded-lg my-shadow-2">
						<Pagination
							count={Math.ceil(news.total / news.per_page) || 1}
							page={page}
							onChange={handleChangePage}
							variant="outlined"
							color="primary"
							showFirstButton
							showLastButton
						/>
					</div>
				</Fragment>
			)}
		</div>
	)
}

export default News
