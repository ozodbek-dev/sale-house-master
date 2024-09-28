import React from "react"
import { Outlet } from "react-router-dom"
import TopPanelProvider from "./providers/TopPanelProvider"
import NotificationProvider from "./providers/NotificationProvider"
import CurrencyProvider from "./providers/CurrencyProvider"

const BaseProvider = () => {
	return (
		<TopPanelProvider>
			<NotificationProvider>
				<CurrencyProvider>
					<Outlet />
				</CurrencyProvider>
			</NotificationProvider>
		</TopPanelProvider>
	)
}

export default BaseProvider
