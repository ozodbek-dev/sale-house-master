import i18n from "config/i18n"

function formLocalizedHelperText(errorText) {
	if (errorText) {
		return typeof errorText === "object"
			? i18n.t(errorText?.label, {
					value: errorText?.value
			  })
			: i18n.t(errorText)
	}
	return errorText
}

export default formLocalizedHelperText
