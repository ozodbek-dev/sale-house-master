function getShaxmatkaFilterSliderData(homesData = {}, code = "") {
	if (code && Object.keys(homesData).length > 0) {
		let a = Object.keys(homesData).map((home) =>
			Array.from(
				new Set(
					homesData[home]
						.map((item) => (item[code] ? parseInt(item[code]) : null))
						.filter((item) => item > 0)
				)
			)
		)
		let marks = Array.from(new Set(a.flat()))
			.sort((a, b) => a - b)
			.map((item) => ({
				value: item
			}))
		let min = marks[0].value
		let max = marks[marks.length - 1].value
		return { min, max, marks }
	}
	return { min: 0, max: 1, marks: [] }
}

function setShaxmatkaSliderDisabled(
	homesData = {},
	code = "",
	values = [],
	reset = false
) {
	let newHomesData = {}
	if (reset) {
		return {}
	}
	if (values.length === 2 && Object.keys(homesData).length > 0) {
		Object.keys(homesData).map((home) =>
			homesData[home].forEach((item) => {
				if (item[code]) {
					item.disabled = !(
						parseFloat(item[code]) >= values[0] &&
						parseFloat(item[code]) <= values[1]
					)
				}
			})
		)
		newHomesData = { ...homesData }
	}
	return newHomesData
}

function setShaxmatkaRoomsDisabled(
	homesData = {},
	selectedRooms = []
) {
	let newHomesData = {}
	if (selectedRooms.length > 0 && Object.keys(homesData).length > 0) {
		Object.keys(homesData).map((home) =>
			homesData[home].forEach((item) => {
				if (item.rooms) {
					item.disabled = !(selectedRooms.includes(parseFloat(item.rooms)))
				}
			})
		)
		newHomesData = { ...homesData }
	}
	return newHomesData
}

module.exports = { getShaxmatkaFilterSliderData, setShaxmatkaSliderDisabled, setShaxmatkaRoomsDisabled }
