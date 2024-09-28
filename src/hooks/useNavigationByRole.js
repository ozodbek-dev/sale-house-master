import { useNavigate } from "react-router-dom"
import useAuth from "./useAuth"
import ROLE_TYPE_LIST from "shared/roleTypeList"

const useNavigationByRole = () => {
	const navigate = useNavigate()
	const [{ user }] = useAuth()

	const replaceBaseOnLink = (link, role) => {
		if (link && role) {
			return link.replace("BASE", role)
		}
		return link
	}

	const navigateFn = (navigateLink = "", options = {}) => {
		if (user && user?.user?.role) {
			if (user?.user?.role === ROLE_TYPE_LIST.ADMIN.code) {
				navigate(replaceBaseOnLink(navigateLink, "admin"), options)
			} else if (user?.user?.role === ROLE_TYPE_LIST.ACCOUNTER.code) {
				navigate(replaceBaseOnLink(navigateLink, "accounter"), options)
			} else if (user?.user?.role === ROLE_TYPE_LIST.MANAGER.code) {
				navigate(replaceBaseOnLink(navigateLink, "manager"), options)
			} else if (user?.user?.role === ROLE_TYPE_LIST.OPERATOR.code) {
				navigate(replaceBaseOnLink(navigateLink, "operator"), options)
			}
		} else {
			navigate(navigateLink, options)
		}
	}

	const linkFn = (link = "") => {
		if (user && user?.user?.role) {
			if (user?.user?.role === ROLE_TYPE_LIST.ADMIN.code) {
				return replaceBaseOnLink(link, "admin")
			} else if (user?.user?.role === ROLE_TYPE_LIST.ACCOUNTER.code) {
				return replaceBaseOnLink(link, "accounter")
			} else if (user?.user?.role === ROLE_TYPE_LIST.MANAGER.code) {
				return replaceBaseOnLink(link, "manager")
			} else if (user?.user?.role === ROLE_TYPE_LIST.OPERATOR.code) {
				return replaceBaseOnLink(link, "operator")
			}
		}
		return link
	}

	return { navigateFn, linkFn }
}

export default useNavigationByRole
