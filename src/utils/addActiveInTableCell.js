function addActiveInTableCell(arr = []) {
	return arr.map((item) => ({ ...item, isActive: true }))
}

export default addActiveInTableCell
