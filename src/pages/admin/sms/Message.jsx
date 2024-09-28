import useTopPanel from "hooks/useTopPanel"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

const Message = () => {
	const { setComponent } = useTopPanel()
	const { t, i18n } = useTranslation()

	useEffect(() => {
		setComponent(
			<div className="text-base-color text-xl font-medium">
				{t("sms.title")}
			</div>
		)
	}, [i18n.language])

	return <div>SMS</div>
}

export default Message
