import { Grid } from "@mui/material"
import React from "react"
import SingleBlockFilter from "./items/SingleBlockFilter"

const OrderFiltersComponent = () => {
	return (
		<div className="mb-1 pb-2">
			<Grid
				container
				spacing={{ xs: 2, sm: 2, lg: 2 }}
				rowSpacing={1}
				columns={{ xs: 12, sm: 12, lg: 12 }}
			>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<SingleBlockFilter />
				</Grid>
			</Grid>
		</div>
	)
}

export default OrderFiltersComponent
