import React from "react"
import image404 from "assets/images/errors/404.svg"
import usePrevNext from "hooks/usePrevNext"
import { Button } from "@mui/material"
import { useTranslation } from "react-i18next"

const NotFoundPage = ({ from }) => {
	const { prev } = usePrevNext()
	const { t } = useTranslation()

	return (
		<div className="not-found-page flex items-center justify-center flex-col h-full overflow-y-auto">
			<img
				src={image404}
				alt="Page Not Found"
				className="sm:w-[600px] w-[400px] sm:px-10 px-5"
			/>
			<Button
				color="primary"
				variant="contained"
				className="!-mt-4 lg:!text-xl font-medium px-2 py-1 animate-[bounce_2s_infinite]"
				onClick={() => prev()}
			>
				{t("errorPage.notFound.goBack")}
			</Button>
			{from && (
				<span className="text-red-600 text-xl font-medium">From:{from}</span>
			)}
		</div>
	)
}

export default NotFoundPage
