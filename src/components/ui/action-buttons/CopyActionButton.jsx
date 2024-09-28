import { Fab } from "@mui/material"
import { Fragment, useState } from "react"
import InfoTooltip from "../tooltips/InfoTooltip"

const CopyActionButton = ({
	handlerFn = () => {},
	data = {},
	hasTooltip = false,
	tooltipProps = {}
}) => {
	const [clicked, setClicked] = useState(false)

	const handleClick = () => {
		setClicked(true)
		handlerFn(data)
		setTimeout(() => {
			setClicked(false)
		}, 3000)
	}

	return (
		<Fragment>
			<InfoTooltip
				disableHoverListener={!hasTooltip}
				arrow={true}
				placement="top"
				{...tooltipProps}
			>
				<Fab
					color={clicked ? "success" : "info"}
					variant="action"
					aria-label="copy"
					onClick={() => handleClick()}
				>
					{clicked ? (
						<i className="bi bi-clipboard-check !text-lg" />
					) : (
						<i className="bi bi-clipboard !text-lg" />
					)}
				</Fab>
			</InfoTooltip>
		</Fragment>
	)
}

export default CopyActionButton
