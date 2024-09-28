import { ButtonBase, Grid } from "@mui/material"
import React, { Fragment } from "react"

const Shaxmatka2Row = ({
	homesData,
	blockIndex,
	floorNumber,
	size,
	toggleSelectionItem = () => {}
}) => {
	return (
		<Fragment>
			<Grid
				container
				rowSpacing={0.5}
				columns={{
					xs: parseInt(size),
					sm: parseInt(size)
				}}
				className="sheet-home-row"
			>
				<Grid item={true} sm={1} xs={1}>
					<ButtonBase className="sheet-home-row-floor h-full w-8 !-ml-3 !mr-1 text-sm font-medium">
						{floorNumber}
					</ButtonBase>
				</Grid>
				{homesData.filter((home) => home.stage === floorNumber).length > 0
					? homesData
							.filter((home) => home.stage === floorNumber)
							.map((item) => (
								<Grid
									item={true}
									sm={1}
									xs={1}
									key={`block-${blockIndex}-home-${item.id}`}
									id={`block-${blockIndex}-home-${item.id}`}
									className={`sheet-home-cell floor-${floorNumber}`}
								>
									<ButtonBase
										className={`block-${blockIndex}-home home-item status-${
											item.status
										}${item.disabled ? " is-disabled" : ""}`}
										id={`home-${item.id}`}
										onClick={() => toggleSelectionItem(item.id, blockIndex)}
									>
										{!(item.stage && parseInt(item.stage) < 0) ? (
											<div>{item.rooms}</div>
										) : (
											<div>P</div>
										)}
									</ButtonBase>
								</Grid>
							))
					: [1].map((item) => (
							<Grid
								item={true}
								sm={1}
								xs={1}
								key={`block-${blockIndex}-home-empty-${item}`}
								id={`block-${blockIndex}-home-empty-${item}`}
								className={`sheet-home-cell sheet-home-empty-cell floor-${floorNumber}`}
							>
								<ButtonBase className="home-item is-empty">
									<div className="home-item-data"></div>
								</ButtonBase>
							</Grid>
					  ))}
			</Grid>
		</Fragment>
	)
}

export default Shaxmatka2Row
