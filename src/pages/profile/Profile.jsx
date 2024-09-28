import useTopPanel from "hooks/useTopPanel"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

const Profile = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("profile.title")}
			</div>
		)
	}, [i18n.language])

	return <div>Profile</div>
}

export default Profile
