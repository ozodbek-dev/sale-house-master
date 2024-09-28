import { ButtonBase, CircularProgress } from "@mui/material"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import { useState } from "react"
import { useQuery } from "react-query"
import Slider from "react-slick"
import BaseTooltip from "./ui/tooltips/BaseTooltip"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

const BlocksSlider = ({ blockId, setBlockId, setBlocksError }) => {
	const { t } = useTranslation()
	const settings = {
		dots: false,
		slidesToShow: 5,
		slidesToScroll: 2,
		swipeToSlide: true,
		arrows: true,
		className: "slider-wrapper",
		infinite: false,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 2,
					infinite: true
				}
			},
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 2,
					infinite: true
				}
			},
			{
				breakpoint: 987,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					infinite: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					initialSlide: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	}

	const axiosPrivate = useAxiosPrivate()
	const [searchParams, setSearchParams] = useSearchParams()
	const [hasError, setHasError] = useState(false)
	const {
		data: blocks,
		isLoading,
		isFetching
	} = useQuery({
		queryKey: "blocks",
		queryFn: async function () {
			const response = await axiosPrivate.get("/dictionary/blocks3")
			return response.data.data
		},
		onSuccess: (data) => {
			if (data.length > 0) {
				setBlockId(data[0]?.block.id)
			} else {
				setBlockId("")
			}
		},
		enabled: !hasError,
		onError: (error) => {
			setHasError(true)
			setBlocksError(true)
		},
		retry: false
	})

	const handleBlockId = (blockId) => {
		if (searchParams.get("page")) {
			searchParams.set("page", 1)
			setSearchParams(searchParams)
		}
		setBlockId(blockId)
	}

	return (
		<div className="blocks-slider-wrapper">
			{isLoading || isFetching ? (
				<div className="circular-progress-box h-[100px]">
					<CircularProgress size={40} />
				</div>
			) : blocks && blocks.length > 0 ? (
				<Slider {...settings}>
					{blocks.map((blockItem) => (
						<ButtonBase
							key={blockItem.block?.id}
							className={`block-item${
								blockItem.block?.id === blockId ? " item-selected" : ""
							}`}
							id={`block-${blockItem.block?.id}`}
							onClick={() => handleBlockId(blockItem.block?.id)}
						>
							<div className="flex flex-col justify-start items-start py-2 px-4">
								<div className="block-title">
									<BaseTooltip
										title={`${blockItem.block?.objects?.name} | ${blockItem.block?.name}`}
										arrow={true}
										placement="top"
										enterDelay={500}
									>
										<span>
											{blockItem.block?.objects?.name} | {blockItem.block?.name}
										</span>
									</BaseTooltip>
								</div>
								<div className="text-left text-sm">
									{t("common.global.emptyHomes")}: {blockItem.active}
								</div>
								<div className="text-left text-sm">
									{t("common.global.soldHomes")}: {blockItem.sold}
								</div>
								<div className="text-left text-sm">
									{t("common.global.orderedHomes")}: {blockItem.order}
								</div>
							</div>
						</ButtonBase>
					))}
				</Slider>
			) : (
				<div className="my-6">
					<span className="no-data-found-wrapper">
						<i className="bi bi-exclamation-octagon text-xl mr-1 leading-3" />{" "}
						{t("common.global.noBlocksFound")}
					</span>
				</div>
			)}
		</div>
	)
}

export default BlocksSlider
