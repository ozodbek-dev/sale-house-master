import { PolarArea } from "react-chartjs-2"
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

const PolarAreaChart = ({ chartDatasets = [], chartLabels = [] }) => {
	return (
		<PolarArea
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
				}
			}}
			data={{ labels: chartLabels, datasets: chartDatasets }}
		/>
	)
}

export default PolarAreaChart
