const HOME_TYPE = require("shared/homeTypeList")

function setShaxmatkaHomesDisabled(
	blocks = [],
	filter = {
		selectedRooms: [],
		repairedPrice: [],
		square: [],
		stage: [],
		onlyFree: false
	}
) {
	if (blocks.length > 0) {
		blocks.map((block, index) =>
			block?.homes.forEach((item) => {
				getRoomsDisabled(item, filter.selectedRooms) &&
				getDisabledByCode(item, "repaired", filter.repairedPrice) &&
				getDisabledByCode(item, "square", filter.square) &&
				getDisabledByCode(item, "stage", filter.stage) &&
				getOnlyFreesDisabled(item, filter.onlyFree)
					? document
							.querySelector(`.block-${index}-home#home-${item?.id}`)
							.classList.remove("is-disabled")
					: document
							.querySelector(`.block-${index}-home#home-${item?.id}`)
							.classList.add("is-disabled")
			})
		)
	}
}

const getRoomsDisabled = (item, selectedRooms) => {
	if (item.rooms) {
		return selectedRooms.includes(parseFloat(item.rooms))
	}
	return true
}

const getDisabledByCode = (item, code, values) => {
	if (item[code]) {
		return (
			parseFloat(item[code]) >= values[0] && parseFloat(item[code]) <= values[1]
		)
	}
	return true
}

const getOnlyFreesDisabled = (item, onlyFree) => {
	if (item.status && onlyFree) {
		return item.status === HOME_TYPE.ACTIVE.code
	}
	return true
}

module.exports = setShaxmatkaHomesDisabled
