import { Grid } from "@mui/material"
import React from "react"
import BlocksFilter from "./items/BlocksFilter"
import StatusFilter from "./items/StatusFilter"
import HomeNumberFilter from "./items/HomeNumberFilter"

const ContractFiltersComponent = () => {
	return (
		<div className="mb-1 pb-2">
			<Grid
				container
				spacing={{ xs: 2, sm: 2, lg: 2 }}
				rowSpacing={1}
				columns={{ xs: 12, sm: 12, lg: 12 }}
			>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<HomeNumberFilter />
				</Grid>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<BlocksFilter />
				</Grid>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<StatusFilter />
				</Grid>
			</Grid>
		</div>
	)
}

export default ContractFiltersComponent
