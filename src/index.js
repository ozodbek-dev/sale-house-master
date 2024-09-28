import React from "react"
import ReactDOM from "react-dom/client"
import "assets/css/tailwind.scss"
import "assets/css/main.scss"
import "assets/css/bootstrap-icons.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import App from "./App"
import "config/i18n"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
)
