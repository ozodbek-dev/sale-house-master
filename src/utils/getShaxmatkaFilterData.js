function getShaxmatkaFilterData(blocks = []) {
	let result = {
		rooms: { marks: [] },
		repairedPrice: { marks: [] },
		square: { marks: [] },
		stage: { marks: [] }
	}
	blocks.forEach((block) => {
		result.rooms.marks = [...result.rooms.marks, getMarks(block, "rooms")]
		result.repairedPrice.marks = [
			...result.repairedPrice.marks,
			getMarks(block, "repaired")
		]
		result.square.marks = [...result.square.marks, getMarks(block, "square")]
		result.stage.marks = [...result.stage.marks, getMarks(block, "stage")]
	})
	return {
		rooms: getSortedMarks(result.rooms.marks),
		repairedPrice: getSortedMarks(result.repairedPrice.marks),
		square: getSortedMarks(result.square.marks),
		stage: getSortedMarks(result.stage.marks)
	}
}

const getMarks = (block, code) => {
	return Array.from(
		new Set(
			block?.homes
				.map((item) => (item[code] ? parseFloat(item[code]) : null))
				.filter((item) => item !== 0 && item !== null && item !== undefined)
		)
	)
}

const getSortedMarks = (marks) => {
	let newMarks = Array.from(new Set(marks.flat()))
		.sort((a, b) => a - b)
		.map((item) => ({
			value: item
		}))
	return {
		marks: newMarks,
		min: newMarks.length > 0 ? newMarks[0].value : [],
		max: newMarks.length > 0 ? newMarks[newMarks.length - 1].value : []
	}
}

export default getShaxmatkaFilterData
