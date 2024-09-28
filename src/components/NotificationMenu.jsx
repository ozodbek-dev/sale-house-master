import { Badge, Button, Menu } from "@mui/material"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

const NotificationMenu = () => {
	// const { notifications, setNotifications } = useContext(NotificationContext)
	// const [{ user }] = useAuth()
	const [invisible, setInvisible] = useState(false)
	const { t } = useTranslation()
	// const axiosPrivate = useAxiosPrivate()
	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	/* const [hasError, setHasError] = useState(false)
	const {
		error,
		isLoading,
		isFetching,
		isError,
		status,
		refetch
	} = useQuery({
		queryKey: "userNotifications",
		queryFn: async function () {
			const response = await axiosPrivate.get(
				`/notification/user?userId=${user.id}`
			)
			return response.data.items
		},
		enabled: !hasError,
		onSuccess: (data) => {
			setNotifications(data)
		},
		onError: (error) => {
			// console.log(error)
			setHasError(true)
			// if (error && error.response && error.response.status === 401) {
			// 	navigate("/login", { replace: true })
			// }
		},
		retry: false
	}) */

	return (
		<div className="notification-menu-wrapper ml-auto">
			<Button
				variant="notification"
				color="primary"
				rotate="true"
				onClick={handleClick}
			>
				<Badge badgeContent={0} invisible={invisible} color="secondary">
					<i className="bi bi-bell"></i>
				</Badge>
			</Button>
			<Menu
				anchorEl={anchorEl}
				id="notification-menu"
				className="notification-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				disableScrollLock={true}
				transformOrigin={{ horizontal: "center", vertical: "top" }}
				anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
			>
				<div className="p-4 text-base text-gray-400">
					{t("common.global.noNotifications")}
				</div>
				{/* {isLoading || isFetching ? (
					<div className="circular-progress-box">
						<CircularProgress size={25} />
					</div>
				) : (
					notifications &&
					notifications.length > 0 ?
					notifications.map((notification) => (
						<Box
							component="div"
							key={notification.id}
							className={`notification-menu-item${
								!notification.isRead ? " not-read" : ""
							}`}
						>
							<div className="text-xl font-medium leading-5">
								{notification.notification?.title}
							</div>
							<Link
								to={`/notification/${notification.notification?.path}`}
								replace
								className="text-line-3 mt-1 leading-5 simple-link"
							>
								{notification.notification?.content}
							</Link>
						</Box>
					)) : (<div className="px-2 text-base text-gray-400">
						{t("common.global.noNotifications")}
					</div>)
				)} */}
			</Menu>
		</div>
	)
}

export default NotificationMenu
