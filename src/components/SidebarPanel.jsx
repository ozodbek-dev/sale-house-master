import React, { Fragment } from "react"
import { Link } from "react-router-dom"
import NavBarLinkItem from "components/navbar-link/NavBarLinkItem"
import { motion } from "framer-motion"
import { fade } from "utils/motion"
import { Button, IconButton } from "@mui/material"
import BaseTooltip from "./ui/tooltips/BaseTooltip"
import useAuth from "hooks/useAuth"
import ROLE_TYPE_LIST from "shared/roleTypeList"
import getLabelByTypeList from "utils/getLabelByTypeList"
import { Trans, useTranslation } from "react-i18next"

const SidebarPanel = ({ sideBarToggle, setSideBarToggle }) => {
	const [{ user, logout }] = useAuth()
	const { t } = useTranslation()

	const getLogoLink = () => {
		if (user && user?.user?.role) {
			if (user?.user?.role === ROLE_TYPE_LIST.ADMIN.code) {
				return "/admin/dashboard"
			} else if (user?.user?.role === ROLE_TYPE_LIST.ACCOUNTER.code) {
				return "/accounter/payment"
			} else if (user?.user?.role === ROLE_TYPE_LIST.MANAGER.code) {
				return "/manager/dashboard"
			} else if (user?.user?.role === ROLE_TYPE_LIST.OPERATOR.code) {
				return "/operator/lead"
			}
		}
		return "#"
	}

	return (
		<div className="sidebar-panel-wrapper my-shadow-2 overflow-y-auto h-full">
			<div className="sidebar-panel-header h-[100px] flex items-center justify-center xs:flex-row mt-3 p-3">
				<Link to={getLogoLink()} className="no-underline">
					<motion.img
						variants={fade({
							direction: "left",
							positionHiddenX: "-30px",
							duration: 0.5
						})}
						initial="hidden"
						animate="show"
						src={require("assets/images/logo/logo-black.png")}
						alt="logo.png"
						className="w-[120px] xs:m-0 mx-auto"
					/>
				</Link>
				<div className="md:hidden close-btn-wrapper">
					<IconButton
						variant="onlyIcon"
						color="primary"
						onClick={() => setSideBarToggle(false)}
					>
						<i className="bi bi-x" />
					</IconButton>
				</div>
			</div>

			<ul className="sidebar-links-wrapper mt-2 p-3">
				{user?.user?.role === ROLE_TYPE_LIST.ADMIN.code && (
					<Fragment>
						<NavBarLinkItem
							linkData={{
								path: "admin/dashboard",
								title: t("sidebar.dashboard")
							}}
							iconName="bi bi-house"
							delay={0}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/homes",
								title: t("sidebar.homes")
							}}
							iconName="bi bi-houses"
							delay={0.1}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/order",
								title: t("sidebar.order")
							}}
							iconName="bi bi-stopwatch"
							delay={0.2}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/object",
								title: t("sidebar.object")
							}}
							iconName="bi bi-houses"
							delay={0.3}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/shaxmatka",
								title: t("sidebar.shaxmatka")
							}}
							iconName="bi bi-grid-3x3-gap"
							delay={0.4}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/contract",
								title: t("sidebar.contract")
							}}
							iconName="bi bi-clipboard-check"
							delay={0.5}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/payment",
								title: t("sidebar.payment")
							}}
							iconName="bi bi-cash-coin"
							delay={0.6}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/currency",
								title: t("sidebar.currency")
							}}
							iconName="bi bi-coin"
							delay={0.7}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/client",
								title: t("sidebar.client")
							}}
							iconName="bi bi-people"
							delay={0.8}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/lead",
								title: t("sidebar.lead")
							}}
							iconName="bi bi-people"
							subIconName="bi bi-award-fill"
							delay={0.9}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/news",
								title: t("sidebar.news")
							}}
							iconName="bi bi-newspaper"
							delay={1.0}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/arrear",
								title: t("sidebar.arrear")
							}}
							iconName="bi bi-cash-stack"
							delay={1.1}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/message",
								title: t("sidebar.message")
							}}
							iconName="bi bi-chat-right-text"
							delay={1.2}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/change",
								title: t("sidebar.change")
							}}
							iconName="bi bi-arrow-repeat"
							delay={1.3}
						/>
						<NavBarLinkItem
							linkData={{
								path: "admin/payment-change",
								title: t("sidebar.paymentChange")
							}}
							iconName="bi bi-cash-stack"
							delay={1.4}
						/>
					</Fragment>
				)}

				{user?.user?.role === ROLE_TYPE_LIST.MANAGER.code && (
					<Fragment>
						<NavBarLinkItem
							linkData={{
								path: "manager/dashboard",
								title: t("sidebar.dashboard")
							}}
							iconName="bi bi-house"
							delay={0}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/homes",
								title: t("sidebar.homes")
							}}
							iconName="bi bi-houses"
							delay={0.1}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/order",
								title: t("sidebar.order")
							}}
							iconName="bi bi-stopwatch"
							delay={0.2}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/shaxmatka",
								title: t("sidebar.shaxmatka")
							}}
							iconName="bi bi-grid-3x3-gap"
							delay={0.3}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/contract",
								title: t("sidebar.contract")
							}}
							iconName="bi bi-clipboard-check"
							delay={0.4}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/payment",
								title: t("sidebar.payment")
							}}
							iconName="bi bi-cash-coin"
							delay={0.5}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/client",
								title: t("sidebar.client")
							}}
							iconName="bi bi-people"
							delay={0.6}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/news",
								title: t("sidebar.news")
							}}
							iconName="bi bi-newspaper"
							delay={0.7}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/arrear",
								title: t("sidebar.arrear")
							}}
							iconName="bi bi-cash-stack"
							delay={0.8}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/message",
								title: t("sidebar.message")
							}}
							iconName="bi bi-chat-right-text"
							delay={0.9}
						/>

						<NavBarLinkItem
							linkData={{
								path: "manager/change",
								title: t("sidebar.change")
							}}
							iconName="bi bi-arrow-repeat"
							delay={1}
						/>
					</Fragment>
				)}

				{user?.user?.role === ROLE_TYPE_LIST.ACCOUNTER.code && (
					<Fragment>
						<NavBarLinkItem
							linkData={{
								path: "accounter/payment",
								title: t("sidebar.payment")
							}}
							iconName="bi bi-cash-coin"
							delay={0}
						/>

						<NavBarLinkItem
							linkData={{
								path: "accounter/change",
								title: t("sidebar.change")
							}}
							iconName="bi bi-arrow-repeat"
							delay={0.1}
						/>
					</Fragment>
				)}

				{user?.user?.role === ROLE_TYPE_LIST.OPERATOR.code && (
					<Fragment>
						<NavBarLinkItem
							linkData={{
								path: "operator/lead",
								title: t("sidebar.lead")
							}}
							iconName="bi bi-people"
							subIconName="bi bi-award-fill"
							delay={0}
						/>
					</Fragment>
				)}
			</ul>

			<ul className="sidebar-links-wrapper p-3">
				{user?.user?.role === ROLE_TYPE_LIST.ADMIN.code && (
					<Fragment>
						<NavBarLinkItem
							linkData={{
								path: "admin/block",
								title: t("sidebar.block")
							}}
							iconName="bi bi-buildings"
							delay={1.5}
						/>

						<NavBarLinkItem
							linkData={{
								path: "admin/settings",
								title: t("sidebar.settings")
							}}
							iconName="bi bi-gear"
							delay={1.5}
						/>

						{/* <NavBarLinkAccordion
							linkData={{
								path: "admin/settings",
								title: "Sozlash"
							}}
							accordionItems={[
								{
									id: 1,
									path: "company",
									title: "Kompaniyalar"
								},
								{
									id: 2,
									path: "staff",
									title: "Xodimlar"
								},
								{
									id: 3,
									path: "home",
									title: "Uy sozlamalari"
								}
							]}
							iconName="bi bi-gear"
							delay={1.1}
						/> */}
					</Fragment>
				)}

				<NavBarLinkItem
					linkData={{
						path: "profile",
						title: t("sidebar.profile")
					}}
					iconName="bi bi-person"
					delay={0}
					customTextComponent={
						<div className="flex flex-col items-start leading-4 ml-2">
							<span className="text-base-color text-[0.9rem]">
								{user?.user?.name}
							</span>
							<span className="text-gray-400 text-sm leading-4">
								{user?.user?.role &&
									getLabelByTypeList(ROLE_TYPE_LIST, user?.user?.role)}
							</span>
						</div>
					}
				/>

				<Button
					variant="outlined"
					onClick={logout}
					className="w-full flex items-center"
				>
					<i className="bi bi-box-arrow-left text-lg mr-2" />
					<span className="text-[0.9rem]">{t("sidebar.actions.logout")}</span>
				</Button>
			</ul>

			<div className="toggle-btn-wrapper">
				{sideBarToggle ? (
					<BaseTooltip
						enterDelay={2000}
						leaveTouchDelay={0}
						title={
							<div>
								<Trans i18nKey="sidebar.actions.close">
									Yopish uchun <code className="toggle-btn-sign">[</code> ni
									bosing
								</Trans>
							</div>
						}
						arrow={true}
						placement="right"
					>
						<IconButton
							variant="toggle"
							onClick={() => setSideBarToggle(false)}
						>
							<i className="bi bi-caret-left" />
						</IconButton>
					</BaseTooltip>
				) : (
					<BaseTooltip
						enterDelay={2000}
						leaveTouchDelay={0}
						title={
							<div>
								<Trans i18nKey="sidebar.actions.open">
									Ochish uchun <code className="toggle-btn-sign">]</code> ni
									bosing
								</Trans>
							</div>
						}
						arrow={true}
						placement="right"
					>
						<IconButton variant="toggle" onClick={() => setSideBarToggle(true)}>
							<i className="bi bi-caret-right" />
						</IconButton>
					</BaseTooltip>
				)}
			</div>
		</div>
	)
}

export default SidebarPanel
