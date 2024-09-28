import { Step, StepLabel, Stepper } from "@mui/material"
import { useEffect, useState } from "react"
import StepOne from "./steps/StepOne"
import StepTwo from "./steps/StepTwo"
import StepThree from "./steps/StepThree"
import StepFour from "./steps/StepFour"
import PhoneFormat from "components/ui/text-formats/PhoneFormat"
import CurrencyFormat from "components/ui/text-formats/CurrencyFormat"
import useTopPanel from "hooks/useTopPanel"
import BackButton from "components/ui/BackButton"
import { useTranslation } from "react-i18next"

const ContractAdd = () => {
	const {t, i18n} = useTranslation()
	const steps = [t("contract.add.step.custom"), t("contract.add.step.home"), t("contract.add.step.payment"), t("contract.add.step.contract")]
	const [activeStep, setActiveStep] = useState(0)
	const [completed, setCompleted] = useState({})
	const [clientData, setClientData] = useState(null)
	const [homeData, setHomeData] = useState(null)
	const [paymentData, setPaymentData] = useState(null)
	const [slideDirection, setSlideDirection] = useState("left")
	const { setComponent } = useTopPanel()

	useEffect(() => {
		setComponent(
			<div className="flex flex-row items-center">
				<BackButton />
				<div className="text-base-color text-xl font-medium">
					{t("contract.add.title")}
				</div>
			</div>
		)
	}, [i18n.language])

	const totalSteps = () => {
		return steps.length
	}

	const completedSteps = () => {
		return Object.keys(completed).length
	}

	const isLastStep = () => {
		return activeStep === totalSteps() - 1
	}

	const allStepsCompleted = () => {
		return completedSteps() === totalSteps()
	}

	const handleNext = () => {
		setSlideDirection("left")
		const newActiveStep =
			isLastStep() && !allStepsCompleted()
				? // It's the last step, but not all steps have been completed,
				  // find the first step that has been completed
				  steps.findIndex((step, i) => !(i in completed))
				: activeStep + 1
		setActiveStep(newActiveStep)
	}

	const handleBack = () => {
		setSlideDirection("right")
		setActiveStep((prevActiveStep) => prevActiveStep - 1)
	}

	return (
		<div className="component-add-edit-wrapper h-calc(100%-0.25rem)">
			<div className="component-add-edit-body mt-3 h-full">
				<div className="flex flex-col h-full">
					<Stepper activeStep={activeStep} alternativeLabel>
						{steps.map((label, index) => (
							<Step key={label} completed={completed[index]}>
								<StepLabel StepIconComponent={StepIcons} className="text-lg">
									<span className="text-base">{label}</span>
								</StepLabel>
							</Step>
						))}
					</Stepper>
					{/* <Stepper activeStep={activeStep} alternativeLabel>
						<Step completed={completed[0]}>
							<StepLabel StepIconComponent={StepIcons} className="text-2xl">
								<span className="text-xl">Mijoz</span>
							</StepLabel>
						</Step>
						<Step completed={completed[1]}>
							<StepLabel StepIconComponent={StepIcons} className="text-2xl">
								<span className="text-xl">Xonadon</span>
							</StepLabel>
						</Step>
						<Step completed={completed[2]}>
							<StepLabel StepIconComponent={StepIcons} className="text-2xl">
								<span className="text-xl">To'lov</span>
							</StepLabel>
						</Step>
						<Step completed={completed[3]}>
							<StepLabel StepIconComponent={StepIcons} className="text-2xl">
								<span className="text-xl">Shartnoma</span>
							</StepLabel>
						</Step>
					</Stepper> */}

					<div className="selected-items-wrapper my-shadow-2 border-dashed border-base-color border-[2px] mx-36 mt-6 p-2 rounded-lg flex min-h-[100px]">
						{clientData && (
							<div className="selected-item w-1/3 bg-base-color-light text-white p-2 rounded-lg flex flex-col justify-center mr-2">
								<div className="name text-lg">
									{clientData?.surname} {clientData?.name}{" "}
									{clientData?.middlename}
								</div>
								<div className="phone text-base">
									<PhoneFormat value={clientData.phone} />
								</div>
							</div>
						)}
						{homeData && (
							<div className="selected-item w-1/3 bg-base-color-light text-white p-2 rounded-lg flex flex-col justify-center mx-2">
								<div className="name text-lg">{homeData?.blocks?.name}</div>
								<div className="home-details text-base flex justify-between mt-2">
									<span>
										{t("contract.add.details", {stage: homeData.stage, rooms: homeData.rooms})}
									</span>
									<span>№{homeData.number}</span>
								</div>
							</div>
						)}
						{paymentData && (
							<div className="selected-item w-1/3 bg-base-color-light text-white p-2 rounded-lg flex flex-col justify-center ml-2">
								<div className="sum text-lg">
									<CurrencyFormat
										value={paymentData.sum}
										suffix={paymentData.isvalute === "1" ? " $" : " UZS"}
									/>
								</div>
								<div className="start-price text-base">
									<CurrencyFormat
										value={paymentData.start_price}
										suffix={paymentData.isvalute === "1" ? " $" : " UZS"}
									/>
								</div>
								<div className="month text-base text-end">
								{t("contract.add.month", {value: paymentData.month})}
								</div>
							</div>
						)}
					</div>

					<div className="stepper-items-wrapper px-5 mt-4 pb-2 flex-auto overflow-y-auto overflow-x-hidden">
						<div className="stepper-item">
							<StepOne
								direction={slideDirection}
								appear={activeStep === 0}
								next={handleNext}
								back={handleBack}
								setData={setClientData}
							/>
						</div>
						<div>
							<StepTwo
								direction={slideDirection}
								appear={activeStep === 1}
								next={handleNext}
								back={handleBack}
								setData={setHomeData}
								clientData={clientData}
							/>
						</div>
						<div className="stepper-item">
							<StepThree
								direction={slideDirection}
								appear={activeStep === 2}
								next={handleNext}
								back={handleBack}
								homeData={homeData}
								setData={setPaymentData}
							/>
						</div>
						<div className="stepper-item">
							<StepFour
								direction={slideDirection}
								appear={activeStep === 3}
								back={handleBack}
								clientData={clientData}
								homeData={homeData}
								paymentData={paymentData}
							/>
						</div>
					</div>

					{/* <div>
						<Button onClick={handleBack}>Back</Button>
						<Button onClick={handleNext}>Next</Button>
					</div> */}
				</div>
			</div>
		</div>
	)
}

function StepIcons(props) {
	const { active, completed } = props

	const icons = {
		1: (
			<div className="step-icon">
				<i className="bi bi-person-add" />
			</div>
		),
		2: (
			<div className="step-icon">
				<i className="bi bi-building-add" />
			</div>
		),
		3: (
			<div className="step-icon">
				<i className="bi bi-cash" />
			</div>
		),
		4: (
			<div className="step-icon">
				<i className="bi bi-file-earmark-text" />
			</div>
		)
	}

	return (
		<div
			className={`step-icon-wrapper${completed ? " competed" : ""}${
				active ? " active" : ""
			}`}
		>
			{icons[String(props.icon)]}
		</div>
	)
}

export default ContractAdd
