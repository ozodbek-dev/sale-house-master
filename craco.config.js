const path = require("path")

module.exports = {
	webpack: {
		alias: {
			utils: path.resolve(__dirname, "src/utils/"),
			api: path.resolve(__dirname, "src/api/"),
			assets: path.resolve(__dirname, "src/assets/"),
			components: path.resolve(__dirname, "src/components/"),
			config: path.resolve(__dirname, "src/config/"),
			context: path.resolve(__dirname, "src/context/"),
			shared: path.resolve(__dirname, "src/shared/"),
			hoc: path.resolve(__dirname, "src/hoc/"),
			hooks: path.resolve(__dirname, "src/hooks/"),
			layouts: path.resolve(__dirname, "src/layouts/"),
			locales: path.resolve(__dirname, "src/locales/"),
			pages: path.resolve(__dirname, "src/pages/"),
			plugins: path.resolve(__dirname, "src/plugins/"),
			routes: path.resolve(__dirname, "src/routes/")
		}
	}
}
