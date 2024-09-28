import i18n from "config/i18n"

function getLabelByTypeList(typeList = {}, code = "") {
	if (typeList && code) {
		let result = Object.keys(typeList).find(
			(item) => typeList[item].code === code
		)
		return i18n.t(typeList[result].label)
	}
	return ""
}

export default getLabelByTypeList
