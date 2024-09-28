import { Doughnut } from "react-chartjs-2"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
} from "chart.js"
import "chart.js/auto"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const DoughnutChart = ({
	chartDatasets = [],
	chartLabels = [],
	options = {}
}) => {
	return (
		<Doughnut
			options={{
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: "top",
						reverse: true,
						labels: {
							usePointStyle: true,
							pointStyle: "rectRounded"
						}
					}
				},
				...options
			}}
			data={{ labels: chartLabels, datasets: chartDatasets }}
		/>
	)
}

export default DoughnutChart
