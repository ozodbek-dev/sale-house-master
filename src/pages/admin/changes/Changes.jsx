import { Box, Grid, Tab, Tabs, TextField } from "@mui/material"
import { motion } from "framer-motion"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect, useState } from "react"
import { fadeUp } from "utils/motion"
import TabOne from "./tabs/TabOne"
import TabTwo from "./tabs/TabTwo"
import TabThree from "./tabs/TabThree"
import TabFour from "./tabs/TabFour"
import useAuth from "hooks/useAuth"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import { useTranslation } from "react-i18next"

const Changes = () => {
	const [{ user }] = useAuth()
	const { t, i18n } = useTranslation()
	const [clientSearch, setClientSearch] = useState(false)
	const [selectedContract, setSelectedContract] = useState("")
	const [selectedContractId, setSelectedContractId] = useState("")
	const [clientName, setClientName] = useState("")
	const [clientId, setClientId] = useState("")

	const { setComponent } = useTopPanel()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("change.title")}
			</div>
		)
	}, [i18n.language])

	const [tabIndex, setTabIndex] = useState(0)

	const handleChangeTab = (event, newValue) => {
		setTabIndex(newValue)
	}

	const handleKeyDown = (event) => {
		if (event.keyCode === 13) {
			setSelectedContract("")
			setClientSearch(true)
		}
	}

	return (
		<div className="component-add-edit-wrapper mx-4">
			<div className="component-add-edit-body mt-3">
				<div className="flex flex-row mb-4">
					<div className="w-1/2">
						<Grid
							container
							spacing={{ xs: 2, sm: 3, md: 3, lg: 3 }}
							rowSpacing={1}
							columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
						>
							<Grid item={true} lg={6} md={8} sm={12} xs={12}>
								<TextField
									component={motion.div}
									variants={fadeUp(30, "tween", 0, 0.5)}
									initial="hidden"
									animate="show"
									viewport={{ once: true, amount: 0.25 }}
									color="formColor"
									variant="outlined"
									fullWidth
									id="client-name-field"
									name="client-name-field"
									label={t("common.fields.clientName")}
									value={clientName}
									onChange={(event) => setClientName(event.target.value)}
									onKeyDown={handleKeyDown}
									autoComplete="off"
								/>
							</Grid>
						</Grid>
					</div>
				</div>

				<div className="change-tabs-wrapper">
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs value={tabIndex} onChange={handleChangeTab}>
							<Tab label={t("change.tab.client.title")} value={0} />
							<Tab label={t("change.tab.contract.title")} value={1} />
							<Tab label={t("change.tab.paymentList.title")} value={2} />
							{user?.user?.role === ROLE_TYPE_LIST.ACCOUNTER.code && (
								<Tab label={t("change.tab.payment.title")} value={3} />
							)}
						</Tabs>
					</Box>

					<TabOne
						appear={tabIndex === 0}
						clientName={clientName}
						clientSearch={clientSearch}
						setClientSearch={setClientSearch}
						clientId={clientId}
						setClientId={setClientId}
						setSelectedContract={setSelectedContract}
					/>

					<TabTwo
						appear={tabIndex === 1}
						clientId={clientId}
						setSelectedContract={setSelectedContract}
						selectedContract={selectedContract}
						selectedContractId={selectedContractId}
						setSelectedContractId={setSelectedContractId}
					/>

					<TabThree
						appear={tabIndex === 2}
						selectedContract={selectedContract}
					/>

					{user?.user?.role === ROLE_TYPE_LIST.ACCOUNTER.code && (
						<TabFour
							appear={tabIndex === 3}
							selectedContractId={selectedContractId}
							selectedContract={selectedContract}
							setSelectedContract={setSelectedContract}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default Changes
