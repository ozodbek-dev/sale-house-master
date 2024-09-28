import { useSnackbar } from "notistack"
import IconButton from "@mui/material/IconButton"
import React, { Fragment } from "react"

const useNotification = () => {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const action = (key) => (
		<Fragment>
			<IconButton
				onClick={() => {
					closeSnackbar(key)
				}}
				size="small"
				variant="onlyIcon"
			>
				<i className="bi bi-x" style={{
					color: "white"
				}}/>
			</IconButton>
		</Fragment>
	)
	const setConf = (conf) => {
		if (conf?.msg) {
			let variant = "info"
			if (conf.variant) {
				variant = conf.variant
			}
			enqueueSnackbar(conf.msg, {
				variant: variant,
				autoHideDuration: !conf?.duration ? 5000 : conf?.duration,
				action: !conf?.showClose ? action : null
			})
		}
	}
	return setConf
}

export default useNotification
