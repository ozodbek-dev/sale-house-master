const { colors } = require("../shared/colors")
const plugin = require("tailwindcss/plugin")

const lines = {
	1: "1",
	2: "2",
	3: "3"
}

const nLineText = plugin(function ({ matchComponents }) {
	matchComponents(
		{
			"text-line": (value) => {
				return {
					"-webkit-line-clamp": value,
					overflow: "hidden",
					display: "-webkit-box",
					"-webkit-box-orient": "vertical"
				}
			}
		},
		{ values: lines }
	)
})

const rotateX = plugin(function ({ matchComponents }) {
	matchComponents(
		{
			"rotate-x": (value) => {
				return {
					transform: `rotateX(${value}deg)`
				}
			}
		},
		{
			values: {
				1: "45",
				2: "90",
				3: "180",
				4: "360"
			}
		}
	)
})

const rotateY = plugin(function ({ matchComponents }) {
	matchComponents(
		{
			"rotate-y": (value) => {
				return {
					transform: `rotateY(${value}deg)`
				}
			}
		},
		{
			values: {
				1: "45",
				2: "90",
				3: "180",
				4: "360"
			}
		}
	)
})

const shadowsCustom = plugin(function ({ addComponents }) {
	addComponents({
		".my-shadow-1": {
			boxShadow: `0 0 #0000, 0 0 #0000, 0 0 5px 1px ${colors.shadowColor};`
		},
		".my-shadow-2": {
			boxShadow: `0 0 #0000, 0 0 #0000, 0 0 10px 1px ${colors.shadowColor};`
		},
		".my-shadow-3": {
			boxShadow: `0 0 #0000, 0 0 #0000, 8px 0 10px 1px ${colors.shadowColor};`
		},
		".my-shadow-4": {
			boxShadow: `0 0 #0000, 0 0 #0000, 0 0 16px 4px ${colors.shadowColor};`
		}
	})
})

const noBgUnderline = plugin(function ({ addComponents }) {
	addComponents({
		".no-bg-underline": {
			backgroundImage: "none",
			backgroundSize: "0"
		}
	})
})

module.exports = [nLineText, rotateX, rotateY, shadowsCustom, noBgUnderline]
