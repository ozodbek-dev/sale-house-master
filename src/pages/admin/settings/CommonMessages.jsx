import { Tab, Tabs } from "@mui/material"
import { Box } from "@mui/system"
import TabPanel from "components/ui/tabs/TabPanel"
import React from "react"

const CommonMessages = () => {
	const [value, setValue] = React.useState(0)
	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (
		<div>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={() => handleChange()}
					aria-label="basic tabs example"
				>
					<Tab label="Uylar bo'yicha" />
					<Tab label="Shartnoma qilganlar bo'yicha" />
					<Tab label="Shartnoma qilmaganlar bo'yicha" />
					<Tab label="Hamma mijozlarga" />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				Uylar bo'yicha
			</TabPanel>
			<TabPanel value={value} index={1}>
				Shartnoma qilganlar bo'yicha
			</TabPanel>
			<TabPanel value={value} index={2}>
				Shartnoma qilmaganlar bo'yicha
			</TabPanel>
			<TabPanel value={value} index={3}>
				Hamma mijozlarga
			</TabPanel>
		</div>
	)
}

export default CommonMessages
