import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import React, { useState } from "react"
import { useMatch, useLocation } from "react-router-dom"
import NavBarLinkItem from "./NavBarLinkItem"
import { motion } from "framer-motion"
import { fadeUp } from "utils/motion"

const NavBarLinkAccordion = ({
	linkData = {
		path: "dashboard",
		title: "Dashboard"
	},
	linkClassName = "navigation-link-accordion",
	accordionItems = [],
	iconName = null,
	delay = 0
}) => {
	const [expand, setExpand] = useState(false)

	const location = useLocation()

	const matchAccordionLink = useMatch({
		path:
			location.pathname.split(/-|\//).length > 1 &&
			location.pathname.split(/-|\//)[1] === linkData.path
				? location.pathname
				: `/${linkData.path}`
	})

	const linkClass = (isMatch, isExpanded) => {
		let className = "navigation-link-accordion"
		className = isMatch ? className + " active-link" : className
		className = isExpanded ? className + " expanded" : className
		return className
	}

	return (
		<motion.li
			variants={fadeUp(30, "spring", delay, 1)}
			initial="hidden"
			animate="show"
			viewport={{ once: true, amount: 0.25 }}
		>
			<Accordion
				expanded={expand}
				onChange={() => setExpand((prev) => (prev = !prev))}
				sx={{
					boxShadow: "none"
				}}
				className={linkClass(matchAccordionLink, expand)}
			>
				<AccordionSummary
					aria-controls={`${linkData.path}-content`}
					id={`${linkData.path}-header`}
					data-text={linkData.title}
					expandIcon={
						<i className="bi bi-chevron-right accordion-expand-icon" />
					}
				>
					{iconName && <i className={iconName + " link-icon"} />}
					<span>{linkData.title}</span>
				</AccordionSummary>
				<AccordionDetails>
					<ul className="navigation-link-accordion-list-wrapper">
						{accordionItems.map((item) => (
							<NavBarLinkItem
								key={`accordion-item-${item.id}`}
								linkData={{
									path: `${linkData.path}/${item.path}`,
									title: item.title
								}}
							/>
						))}
					</ul>
				</AccordionDetails>
			</Accordion>
		</motion.li>
	)
}

export default NavBarLinkAccordion
