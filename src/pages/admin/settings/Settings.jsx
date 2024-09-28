import { Button, Grid } from "@mui/material"
import useTopPanel from "hooks/useTopPanel"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const Settings = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("settings.title")}
			</div>
		)
	}, [i18n.language])

	return (
		<div className="mt-6 setting-wrapper">
			<Grid
				container
				spacing={{ xs: 2, sm: 2, lg: 2 }}
				columns={{ xs: 12, sm: 12, lg: 12 }}
			>
				<Grid item={true} lg={4} sm={6} xs={12}>
					<Link to="/admin/settings/company" className="settings-item">
						<Button fullWidth variant="outlined" className="settings-item-btn">
							<i className="bi bi-buildings text-3xl" />
							<span className="ml-2">{t("settings.company")}</span>
						</Button>
					</Link>
				</Grid>
				<Grid item={true} lg={4} sm={6} xs={12}>
					<Link to="/admin/settings/staff" className="settings-item">
						<Button fullWidth variant="outlined" className="settings-item-btn">
							<i className="bi bi-people text-3xl" />
							<span className="ml-2">{t("settings.staffSettings")}</span>
						</Button>
					</Link>
				</Grid>
				<Grid item={true} lg={4} sm={6} xs={12}>
					<Link to="/admin/settings/home" className="settings-item">
						<Button fullWidth variant="outlined" className="settings-item-btn">
							<i className="bi bi-building-gear text-3xl" />
							<span className="ml-2">{t("settings.homeSettings")}</span>
						</Button>
					</Link>
				</Grid>
				<Grid item={true} lg={4} sm={6} xs={12}>
					<Link to="/admin/settings/home-excel" className="settings-item">
						<Button fullWidth variant="outlined" className="settings-item-btn">
							<span className="relative">
								<i className="bi bi-buildings rotate-y-[-180] pt-0.5 pl-0.5 text-xl absolute bottom-0 bg-white flex" />
								<i className="bi bi-file-earmark text-3xl" />
							</span>
							<span className="ml-2">{t("settings.homeExcel")}</span>
						</Button>
					</Link>
				</Grid>
				<Grid item={true} lg={4} sm={6} xs={12}>
					<Link to="/admin/settings/client-excel" className="settings-item">
						<Button fullWidth variant="outlined" className="settings-item-btn">
							{/* <span className="relative">
								<i className="bi bi-person text-lg absolute -left-1 bg-white flex rounded-lg" />
								<i className="bi bi-filetype-xlsx text-3xl" />
							</span> */}
							<span className="relative">
								<i className="bi bi-people text-xl absolute bottom-0 bg-white flex" />
								<i className="bi bi-file-earmark text-3xl" />
							</span>
							<span className="ml-2">{t("settings.clientExcel")}</span>
						</Button>
					</Link>
				</Grid>
				<Grid item={true} lg={4} sm={6} xs={12}>
					<Link to="/admin/settings/contract-excel" className="settings-item">
						<Button fullWidth variant="outlined" className="settings-item-btn">
							<i className="bi bi-file-earmark-text text-3xl" />
							<span className="ml-2">{t("settings.contractExcel")}</span>
						</Button>
					</Link>
				</Grid>
			</Grid>
		</div>
	)
}

export default Settings
