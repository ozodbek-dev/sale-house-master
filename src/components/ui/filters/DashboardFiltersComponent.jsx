import { Grid } from "@mui/material"
import React from "react"
import HomeStatusFilter from "./items/HomeStatusFilter"
import HomeStageFilter from "./items/HomeStageFilter"
import HomeRoomsNumberFilter from "./items/HomeRoomsNumberFilter"
import HomeResidentTypeFilter from "./items/HomeResidentTypeFilter"
import HomeRepairTypeFilter from "./items/HomeRepairTypeFilter"
import HomeAreaFilter from "./items/HomeAreaFilter"

const DashboardFiltersComponent = () => {
	return (
		<div className="mb-1 pb-2">
			<Grid
				container
				spacing={{ xs: 2, sm: 2, lg: 2 }}
				rowSpacing={1}
				columns={{ xs: 12, sm: 12, lg: 12 }}
			>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<HomeRoomsNumberFilter />
				</Grid>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<HomeStageFilter />
				</Grid>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<HomeResidentTypeFilter />
				</Grid>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<HomeRepairTypeFilter />
				</Grid>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<HomeStatusFilter />
				</Grid>
				<Grid item={true} lg={3} sm={6} xs={12}>
					<HomeAreaFilter />
				</Grid>
			</Grid>
		</div>
	)
}

export default DashboardFiltersComponent
