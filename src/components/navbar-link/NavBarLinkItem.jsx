import { ButtonBase } from "@mui/material"
import { motion } from "framer-motion"
import React, { Fragment } from "react"
import { Link, useMatch } from "react-router-dom"
import { fadeUp } from "utils/motion"

const NavBarLinkItem = ({
	linkData = {
		path: "dashboard",
		title: "Dashboard"
	},
	iconName = null,
	subIconName = null,
	delay = 0,
	customTextComponent = null,
	customChild = null
}) => {
	const matchLink = useMatch({
		path: `/${linkData.path}`,
		end: `/${linkData.path}`.length === 1
	})

	return (
		<motion.li
			variants={fadeUp(30, "spring", delay, 1)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
		>
			{customChild ? (
				<div>{customChild}</div>
			) : (
				<Fragment>
					<ButtonBase
						className={`w-full navigation-button${
							matchLink ? " active-link" : ""
						}`}
					>
						<Link
							to={"/" + linkData.path}
							className="navigation-link-bottom no-underline"
						>
							{iconName && <i className={iconName + " link-icon"} />}
							{subIconName && <i className={subIconName + " link-sub-icon"} />}
							{customTextComponent ? (
								customTextComponent
							) : (
								<span>{linkData.title}</span>
							)}
						</Link>
						<Link
							to={"/" + linkData.path}
							className="navigation-link-top no-underline"
						>
							{iconName && <i className={iconName + " link-icon"} />}
							{subIconName && <i className={subIconName + " link-sub-icon"} />}
							{customTextComponent ? (
								customTextComponent
							) : (
								<span>{linkData.title}</span>
							)}
						</Link>
					</ButtonBase>
				</Fragment>
			)}
		</motion.li>
	)
}

export default NavBarLinkItem
