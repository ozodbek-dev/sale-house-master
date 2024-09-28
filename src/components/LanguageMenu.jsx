import { Button, Menu, MenuItem } from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { fadeUp } from "utils/motion"

const LanguageMenu = ({ animate = false }) => {
	const { t, i18n } = useTranslation()
	const [lang, setLang] = useState(localStorage.getItem("lang") || "uz")
	const handleChangeLng = (event) => {
		i18n.changeLanguage(event.target.lang)
		localStorage.setItem("lang", event.target.lang)
		setLang(event.target.lang)
		menuToggle()
	}

	let anchorEl = document.getElementById("language-btn")

	const menuToggle = () => {
		setOpen((prev) => !prev)
	}

	const [open, setOpen] = useState(false)

	return (
		<motion.div
			className="language-wrapper"
			variants={fadeUp(30, "tween", 0.1, 0.5)}
			initial={animate ? "hidden" : ""}
			animate={animate ? "show" : ""}
			viewport={{ once: true, amount: 0.25 }}
		>
			<Button id="language-btn" onClick={menuToggle} variant="language">
				{t(`common.language.short.${lang}`)}
			</Button>
			<Menu
				open={open}
				anchorEl={anchorEl}
				disableScrollLock={true}
				onClose={menuToggle}
				className="language-menu"
			>
				<MenuItem
					onClick={handleChangeLng}
					lang="uz"
					className={`language-menu-item${lang === "uz" ? " active-link" : ""}`}
				>
					{t("common.language.short.uz")}
				</MenuItem>
				<MenuItem
					onClick={handleChangeLng}
					lang="uz_kr"
					className={`language-menu-item${
						lang === "uz_kr" ? " active-link" : ""
					}`}
				>
					{t("common.language.short.uz_kr")}
				</MenuItem>
				<MenuItem
					onClick={handleChangeLng}
					lang="ru"
					className={`language-menu-item${lang === "ru" ? " active-link" : ""}`}
				>
					{t("common.language.short.ru")}
				</MenuItem>
			</Menu>
		</motion.div>
	)
}

export default LanguageMenu
