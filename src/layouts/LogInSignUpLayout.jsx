import LanguageMenu from "components/LanguageMenu"
import React from "react"
import { Outlet } from "react-router-dom"

const LogInSignUpLayout = () => {
	return (
		<div className="login-sign-up-wrapper flex md:flex-row flex-col md:items-center justify-center min-h-screen">
			<div className="login-sign-up-img-box md:w-1/2 w-0 md:block hidden min-h-screen">
				<img
					src={require("assets/images/login-reg-bg.jpg")}
					alt="image2"
					className="min-h-screen object-cover"
				/>
			</div>

			<div className="absolute top-10 right-10">
				<LanguageMenu animate={true} />
			</div>

			<div className="login-sign-up-enter-box md:w-1/2 w-full xl:px-32 lg:px-24 md:px-16 sm:px-20 p-12 py-10">
				<Outlet />
			</div>
		</div>
	)
}

export default LogInSignUpLayout
