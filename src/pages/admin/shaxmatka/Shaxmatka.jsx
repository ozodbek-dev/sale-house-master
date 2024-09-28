import { Button } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import ShaxmatkaCardsPaginationList from "./cards/ShaxmatkaCardsPaginationList"
import { useTranslation } from "react-i18next"

const Shaxmatka = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("shaxmatka.title")}
			</div>
		)
	}, [i18n.language])

	const [refetch, setRefetch] = useState(false)

	return (
		<div className="component-list-wrapper">
			<div className="component-list-header mb-2">
				<div className="header-actions-container py-3 flex flex-row items-center">
					<div className="header-actions filter-box flex items-center my-shadow-2 rounded-lg px-4 w-full h-14"></div>
					<div className="header-actions action-buttons-box py-3 px-4 my-shadow-2 rounded-lg flex items-center justify-center ml-4">
						<Button
							variant="action"
							color="info"
							onClick={() => {
								setRefetch(true)
							}}
							disable={`${refetch}`}
						>
							<i
								className={`bi bi-arrow-repeat${
									refetch ? " animate-spin" : ""
								}`}
							/>
						</Button>
					</div>
				</div>
			</div>

			<div className="component-table-wrapper">
				<ShaxmatkaCardsPaginationList emitRefetch={{ refetch, setRefetch }} />
			</div>
		</div>
	)
}

export default Shaxmatka
