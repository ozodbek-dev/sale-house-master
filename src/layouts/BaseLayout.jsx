import React, { useEffect } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import TopPanel from "components/TopPanel"
import SidebarPanel from "components/SidebarPanel"
import useAuth from "hooks/useAuth"
import useToggle from "hooks/useToggle"

const BaseLayout = () => {
	const location = useLocation()
	const [sideBarToggle, setSideBarToggle] = useToggle("sidebarOpen")
	const [{ user }] = useAuth()

	useEffect(() => {
		window.addEventListener("keypress", (event) => {
			if (event && event.keyCode === 91) {
				setSideBarToggle(false)
			}
			if (event && event.keyCode === 93) {
				setSideBarToggle(true)
			}
		})
	}, [])

	if (!user) {
		return (
			<Navigate
				to={`/login${location.pathname ? `?from=${location.pathname}` : ""}`}
				state={{ from: location }}
			/>
		)
	}

	return (
		<>
			<div className="flex flex-row relative">
				<div
					className={`aside-container${
						sideBarToggle ? " sidebar-full" : " sidebar-small"
					}`}
				>
					<SidebarPanel
						sideBarToggle={sideBarToggle}
						setSideBarToggle={setSideBarToggle}
					/>
				</div>
				<div
					className={`base-container${
						sideBarToggle ? " base-container-small" : " base-container-full"
					}`}
				>
					<div className="header-container">
						<TopPanel />
					</div>
					<main className="main-container with-max-width">
						<Outlet />
					</main>
				</div>
			</div>
		</>
	)
}

export default BaseLayout
