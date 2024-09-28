import React from "react"
import NotificationMenu from "./NotificationMenu"
import useTopPanel from "hooks/useTopPanel"
import LanguageMenu from "./LanguageMenu"

const TopPanel = () => {
	const { component } = useTopPanel()

	return (
		<div className="with-max-width h-16 my-shadow-3">
			<div
				id="top-panel"
				className="top-panel-wrapper py-4 px-6 flex items-center justify-between z-[10] h-16 with-max-width"
			>
				<div className="top-panel-tools flex items-center justify-between w-full mx-2">
					{component}
					<div className="flex items-center">
						<div className="mr-1">
							<LanguageMenu />
						</div>
						<div className="ml-1">
							<NotificationMenu />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TopPanel
