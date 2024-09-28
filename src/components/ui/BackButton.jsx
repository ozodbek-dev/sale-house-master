import React from "react"
import BaseTooltip from "./tooltips/BaseTooltip"
import { Button } from "@mui/material"
import usePrevNext from "hooks/usePrevNext"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

const BackButton = () => {
	const { prev } = usePrevNext()
	const { t } = useTranslation()
	const location = useLocation()

	return (
		<BaseTooltip
			title={t("common.button.back")}
			arrow
			placement="bottom"
			enterDelay={1500}
		>
			<Button
				variant="action"
				color="primary"
				onClick={() => {
					if (location && location.state && location.state.from) {
						prev(location.state.from?.pathname)
					} else {
						prev()
					}
				}}
				className="!mr-2"
			>
				<i className="bi bi-arrow-left flex items-center justify-center" />
			</Button>
		</BaseTooltip>
	)
}

export default BackButton
