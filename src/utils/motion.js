export const textVariant = (delay = 0) => ({
	hidden: {
		opacity: 0,
		y: 20
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "tween",
			ease: "easeIn",
			delay
		}
	}
})

export const fadeUp = (positionY, type, delay = 0, duration = 1) => ({
	hidden: {
		x: 0,
		y: positionY ? positionY : 0,
		opacity: 0
	},
	show: {
		x: 0,
		y: 0,
		opacity: 1,
		transition: {
			type,
			delay,
			duration,
			ease: "easeOut"
		}
	}
})

export const fade = ({
	direction,
	positionHiddenX = 100,
	positionHiddenY = 100,
	positionShowX = 0,
	positionShowY = 0,
	type,
	delay,
	duration
}) => ({
	hidden: {
		x:
			direction === "left"
				? positionHiddenX
				: direction === "right"
				? -positionHiddenX
				: 0,
		y:
			direction === "up"
				? positionHiddenY
				: direction === "down"
				? -positionHiddenY
				: 0,
		opacity: 0
	},
	show: {
		x: positionShowX,
		y: positionShowY,
		opacity: 1,
		transition: {
			type,
			delay,
			duration,
			ease: "easeOut"
		}
	}
})

export const stepperItem = ({ direction, type, delay, duration }) => ({
	hidden: {
		x: direction === "left" ? "100%" : direction === "right" ? "-100%" : 0,
		y: 0,
		opacity: 0,
		display: "none"
	},
	show: {
		x: 0,
		y: 0,
		opacity: 1,
		display: "block",
		transition: {
			type,
			delay,
			duration,
			ease: "easeOut"
		}
	}
})

export const tabItem = ({ type, delay, duration }) => ({
	hidden: {
		x: 0,
		y: 0,
		opacity: 0,
		display: "none"
	},
	show: {
		x: 0,
		y: 0,
		opacity: 1,
		display: "block",
		transition: {
			type,
			delay,
			duration,
			ease: "easeOut"
		}
	}
})
