import { Button, ButtonBase, CircularProgress } from "@mui/material"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { stepperItem } from "utils/motion"
import useNotification from "hooks/useNotification"
import { useQuery } from "react-query"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import ContractHomeOrderModal from "../ContractHomeOrderModal"
import ImagePreviewDialog from "components/ui/dialogs/ImagePreviewDialog"
import { useTranslation } from "react-i18next"

const StepTwo = ({ appear, direction, next, back, clientData, setData }) => {
	const { t } = useTranslation()
	const [homeId, setHomeId] = useState("")
	const [selectedHome, setSelectedHome] = useState("")
	const [hasError, setHasError] = useState(false)
	const [open, setOpen] = useState(false)
	const [openHomeLayoutImageDialog, setOpenHomeLayoutImageDialog] =
		useState(false)
	const sendNotification = useNotification()
	const axiosPrivate = useAxiosPrivate()

	const {
		data: homesList,
		isLoading,
		isFetching,
		refetch
	} = useQuery({
		queryKey: "contractObjects",
		queryFn: async function () {
			const response = await axiosPrivate.get(
				`/admin/custom/contracts/${clientData?.id}`
			)
			return response.data.data
		},
		enabled: !hasError && !!clientData?.id,
		onError: (error) => {
			setHasError(true)
		},
		retry: false
	})

	useEffect(() => {
		if (clientData?.id) {
			refetch()
			setHomeId("")
			setSelectedHome("")
		}
	}, [clientData])

	const handleHome = (home) => {
		Array.from(document.getElementsByClassName("home-database-item")).forEach(
			(item) =>
				item.id !== `home-database-${home.id}` &&
				item.classList.remove("item-selected")
		)
		document
			.getElementById(`home-database-${home.id}`)
			.classList.toggle("item-selected")
		if (selectedHome && selectedHome.id === home.home.id) {
			setHomeId("")
			setSelectedHome({})
		} else {
			setHomeId(home.id)
			setSelectedHome(home?.home)
		}
	}

	const handleNext = () => {
		if (homeId) {
			setData(selectedHome)
			next()
		} else {
			sendNotification({
				msg: t("contract.step.two.alerts.warning"),
				variant: "warning"
			})
		}
	}

	return (
		<motion.div
			variants={stepperItem({
				direction: direction,
				duration: 0
			})}
			initial="hidden"
			animate={appear ? "show" : "hidden"}
		>
			<div className="component-add-wrapper">
				<div className="component-add-body flex justify-between">
					<div className="client-home-details w-2/3">
						<div className="title text-xl text-base-color">
							{t("contract.step.two.home")}
						</div>
						<div className="client-home-detail-items">
							<div className="home-item">
								<div className="home-item-title">№:</div>
								<div className="home-item-value">{selectedHome?.number}</div>
							</div>
							<div className="home-item">
								<div className="home-item-title">
									{t("contract.step.two.stage")}:
								</div>
								<div className="home-item-value">{selectedHome?.stage}</div>
							</div>
							<div className="home-item">
								<div className="home-item-title">
									{t("contract.step.two.area")}:
								</div>
								<div className="home-item-value">{selectedHome?.square}</div>
							</div>
							<div className="home-item">
								<div className="home-item-title">
									{t("contract.step.two.block")}:
								</div>
								<div className="home-item-value">
									{selectedHome?.blocks?.name}
								</div>
							</div>

							<div className="home-item">
								<Button
									color="primary"
									variant="contained"
									disabled={!(selectedHome?.plan && selectedHome?.plan?.link)}
									onClick={() => setOpenHomeLayoutImageDialog(true)}
								>
									{t("common.button.homePlan")}
								</Button>
							</div>
						</div>
						<div className="text-center mt-4">
							<Button
								onClick={back}
								color="inherit"
								variant="contained"
								className="!mr-2"
							>
								{t("common.button.back")}
							</Button>
							<Button
								onClick={handleNext}
								color="success"
								variant="contained"
								className="!ml-2"
							>
								{t("common.button.next")}
							</Button>
						</div>
					</div>

					<div className="client-homes-database-wrapper w-1/3 pl-8 py-2">
						<div className="client-homes-database-title text-xl text-base-color">
							{t("contract.step.two.clientOrders")}:
						</div>
						<div className="client-homes-database-add-edit my-4">
							<Button
								variant="outlined"
								color="success"
								startIcon={
									<i className="bi bi-plus-square-dotted !text-2xl !leading-none" />
								}
								onClick={() => setOpen(true)}
							>
								{t("contract.step.two.orderNewHome")}
							</Button>
						</div>
						<div className="client-homes-database-body flex flex-col mt-2 pr-2 overflow-y-auto h-40">
							{isLoading || isFetching ? (
								<div className="circular-progress-box py-5">
									<CircularProgress size={30} />
								</div>
							) : homesList && homesList.length > 0 ? (
								homesList.map((home) => (
									<ButtonBase
										className="home-database-item"
										id={`home-database-${home.id}`}
										key={home.id}
										onClick={() => handleHome(home)}
									>
										<div>
											<div className="name">{home?.home?.blocks?.name}</div>
										</div>
										<div>
											<div className="details">
												{t("contract.step.two.homeDetails", {
													stage: home?.home?.stage,
													rooms: home?.home?.rooms
												})}
											</div>
										</div>
									</ButtonBase>
								))
							) : (
								<div className="text-gray-400 flex items-center mt-2">
									<i className="bi bi-exclamation-octagon text-lg mr-1 flex items-center" />{" "}
									<span className="text-sm">
										{t("contract.step.two.noOrdersFound")}
									</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<ContractHomeOrderModal
					open={open}
					setOpen={setOpen}
					refetch={refetch}
					customerId={clientData?.id}
				/>

				{openHomeLayoutImageDialog &&
					selectedHome?.plan &&
					selectedHome?.plan?.link && (
						<ImagePreviewDialog
							open={openHomeLayoutImageDialog}
							setOpen={setOpenHomeLayoutImageDialog}
							url={selectedHome?.plan?.link}
						/>
					)}
			</div>
		</motion.div>
	)
}

export default StepTwo
