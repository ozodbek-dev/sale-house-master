const customPlugins = require("./src/plugins/tailwind-plugins")
const { colors } = require("./src/shared/colors")

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"base-color-light": colors.baseColorLight,
				"base-color-light-hover": colors.baseColorLightHover,
				"base-color": colors.baseColor,
				"base-color-disabled": colors.baseColorDisabled,
				"base-color-hover": colors.baseColorHover,
				"base-color-active": colors.baseColorActive,
				"base-color-outline": colors.baseColorOutline,
				"base-color-deprecated-bg": colors.baseColorDeprecatedBg,
				"base-color-deprecated-border": colors.baseColorDeprecatedBorder,
				"base-1": colors.base1,
				"base-2": colors.base2,
				"base-3": colors.base3,
				"base-4": colors.base4,
				"base-5": colors.base5,
				"base-6": colors.base6,
				"base-7": colors.base7,
				"base-8": colors.base8,
				"base-9": colors.base9,
				"base-10": colors.base10,
				"base-color-deprecated-l-35": colors.baseColorDeprecatedL35,
				"base-color-deprecated-l-20": colors.baseColorDeprecatedL20,
				"base-color-deprecated-t-20": colors.baseColorDeprecatedT20,
				"base-color-deprecated-t-50": colors.baseColorDeprecatedT50,
				"base-color-deprecated-f-12": colors.baseColorDeprecatedF12,
				"base-color-active-deprecated-f-30":
					colors.baseColorActiveDeprecatedF30,
				"base-color-active-deprecated-d-02":
					colors.baseColorActiveDeprecatedD02,
				"footer-color": colors.footerColor
			},
			screens: {
				xs: "475px"
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"]
			}
		}
	},
	plugins: customPlugins
}
